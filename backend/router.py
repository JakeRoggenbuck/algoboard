from fastapi import FastAPI, Query, HTTPException, Cookie, Request, APIRouter, status
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime
import argparse
from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse, RedirectResponse
import requests
from typing import Union
from pydantic import BaseModel
from database_setup import repull_replace_data, setup_database
from database import (
    update_board_participant_counts,
    calculate_total_solved_on_board,
    get_last_entry_time,
    add_user_to_board,
    add_board,
    add_user,
    count_problems,
    log_email,
    get_logins,
)
from dotenv import load_dotenv
from os import getenv
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from datetime import datetime, timedelta
from jose import jwt, ExpiredSignatureError, JWTError
import uuid
import traceback
from starlette.config import Config
import time


config = Config(".env")


def linear_weight(e: int, m: int, h: int) -> float:
    return e + 2 * m + 3 * h


class User(BaseModel):
    username: str


class UserBoard(BaseModel):
    username: str
    board: str


load_dotenv(override=True)

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=getenv("FASTAPI_SECRET_KEY"))


@app.middleware("http")
async def log_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Request: {request.url.path} completed in {process_time:.4f} seconds")
    return response


origins = [
    "http://localhost:3000",
    "http://50.116.10.252:3000",
    "http://algoboard.org",
    "https://algoboard.org",
    "https://leaterboard.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth()
oauth.register(
    name="AlgoBoard",
    client_id=config("GOOGLE_CLIENT_ID"),
    client_secret=config("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    refresh_token_url=None,
    authorize_state=config("SECRET_KEY"),
    redirect_uri="http://127.0.0.1:8000/auth/callback",
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={"scope": "openid profile email"},
)

SECRET_KEY = getenv("JWT_SECRET_KEY")

if SECRET_KEY is None:
    raise Exception("JWT_SECRET_KEY not found!")

ALGORITHM = "HS256"


def jwt_create_access_token(data: dict, expires: Union[timedelta, None] = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def jwt_get_current_user(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user_id": payload.get("sub"), "email": payload.get("email")}
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")


@app.get("/login")
async def login(request: Request):
    request.session.clear()
    referer = request.headers.get("refer")
    frontend_url = getenv("FRONTEND_URL")
    redirect_url = getenv("REDIRECT_URL")
    request.session["login_redirect"] = frontend_url

    return await oauth.AlgoBoard.authorize_redirect(request, redirect_url, prompt="consent",)


@app.route("/auth")
async def auth(request: Request):
    try:
        token = await oauth.AlgoBoard.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google auth failed.")

    try:
        user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {token['access_token']}"}
        google_response = requests.get(user_info_endpoint, headers=headers)
        user_info = google_response.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    user = token.get("userinfo")
    expires_in = token.get("expires_in")
    user_id = user.get("sub")
    iss = user.get("iss")
    user_email = user.get("email")
    first_logged_in = datetime.now()
    last_accessed = datetime.now()

    user_name = user_info.get("name")
    user_pic = user_info.get("picture")

    if iss not in ["https://accounts.google.com", "accounts.google.com"]:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    access_token_expires = timedelta(seconds=expires_in)
    access_token = jwt_create_access_token(
        data={"sub": user_id, "email": user_email}, expires=access_token_expires
    )

    session_id = str(uuid.uuid4())

    # Internal Logging that is not implemented
    # log_user(user_id, user_email, user_name, user_pic, first_logged_in, last_accessed)
    # log_token(access_token, user_email, session_id)

    redirect_url = request.session.pop("login_redirect", "")
    response = RedirectResponse(redirect_url)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return response


def get_current_user(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: str = payload.get("sub")
        user_email: str = payload.get("email")

        if user_id is None or user_email is None:
            raise credentials_exception

        return {"user_id": user_id, "user_email": user_email}

    except ExpiredSignatureError:
        # Specifically handle expired tokens
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired. Please login again.")
    except JWTError:
        # Handle other JWT-related errors
        traceback.print_exc()
        raise credentials_exception
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=401, detail="Not Authenticated")


def validate_user_request(token: str = Cookie(None)):
    session_details = get_current_user(token)

    return session_details


# GitHub Client stuff
CLIENT_ID = ""
CLIENT_SECRET = ""

with open("config.secret") as file:
    # FORMAT:
    # first line = client id
    # second line = client secret

    CLIENT_ID = file.readline().rstrip()
    CLIENT_SECRET = file.readline().rstrip()


@app.get("/access-token")
def get_access_token(code: Union[str, None] = None):
    if code:
        params = (
            "?client_id="
            + CLIENT_ID
            + "&client_secret="
            + CLIENT_SECRET
            + "&code="
            + code
        )

        headers = {"Accept": "application/json", "Content-Type": "application/json"}

        # Ask GitHub for the access token
        res = requests.post(
            "https://github.com/login/oauth/access_token" + params,
            headers=headers,
        )

        return JSONResponse(content=res.json(), status_code=200)

    return JSONResponse(content={"message": "Could not load"}, status_code=400)


@app.get("/user-info")
def get_user_info(authorization: str = Header(default=None)):
    headers = {"Authorization": authorization, "Accept": "application/json"}

    res = requests.get(
        "https://api.github.com/user",
        headers=headers,
    )

    data = res.json()

    email_response = requests.get(
        "https://api.github.com/user/emails",
        headers=headers,
    )

    if email_response.status_code == 200:
        email_data = email_response.json()

        primary_email = None
        for email_obj in email_data:
            if email_obj.get("primary"):
                primary_email = email_obj.get("email")
                break

        if not primary_email and email_data:
            primary_email = email_data[0].get("email")

        data["primary_email"] = primary_email
        data["all_emails"] = email_data

        if primary_email:
            log_email(primary_email, data.get("login"))

    # We can safely assume that the user with the username equal to 'login'
    # has access to the account. This means we can use this username and
    # possibly the id (I think they are unique) to store with my internal
    # user data structure to function like a login
    if data.get("login") and data.get("id"):
        if isinstance(data["login"], str) and isinstance(data["id"], int):
            print(data["id"], data["login"])

        print(
            "GitHub Profile Email: ", data.get("primary_email"), data.get("all_emails")
        )

    # Check if GitHub responded
    if res.status_code == 200:
        return JSONResponse(content=res.json(), status_code=200)

    return JSONResponse(
        content={
            "message": "Could not load",
            "result": res.json(),
        },
        status_code=400,
    )


@app.post("/admin/create-user")
def create_user_router(user: User, authorization: str = Header(default=None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header",
        )

    if not user.username.isalnum():
        raise HTTPException(
            status_code=422,
            detail="Invalid username given",
        )

    headers = {"Authorization": authorization, "Accept": "application/json"}

    res = requests.get(
        "https://api.github.com/user",
        headers=headers,
    )

    data = res.json()

    # We can safely assume that the user with the username equal to 'login'
    # has access to the account. This means we can use this username and
    # possibly the id (I think they are unique) to store with my internal
    # user data structure to function like a login
    if data.get("login") and data.get("id"):
        if isinstance(data["login"], str) and isinstance(data["id"], int):
            # I have admin permissions to add people
            if data.get("login") == "JakeRoggenbuck":
                add_user(user.username)
                add_user_to_board(user.username, "everyone")
                update_board_participant_counts()

            # TODO: Should I actually return the GitHub data again?
            # Check if GitHub responded
            if res.status_code == 200:
                return JSONResponse(content=res.json(), status_code=200)

    return JSONResponse(content={"message": "Could not load"}, status_code=400)


@app.get("/admin/get-logins")
def get_logins_route(authorization: str = Header(default=None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header",
        )

    headers = {"Authorization": authorization, "Accept": "application/json"}

    res = requests.get(
        "https://api.github.com/user",
        headers=headers,
    )

    data = res.json()

    # We can safely assume that the user with the username equal to 'login'
    # has access to the account. This means we can use this username and
    # possibly the id (I think they are unique) to store with my internal
    # user data structure to function like a login
    if data.get("login") and data.get("id"):
        if isinstance(data["login"], str) and isinstance(data["id"], int):
            # I have admin permissions
            if data.get("login") == "JakeRoggenbuck":
                logins = get_logins()

                return JSONResponse(content=logins, status_code=200)

    return JSONResponse(content={"message": "Could not load"}, status_code=400)


@app.post("/admin/add-user-to-board")
def add_user_to_board_route(
    userboard: UserBoard,
    authorization: str = Header(default=None),
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header",
        )

    if not userboard.username.isalnum():
        raise HTTPException(
            status_code=422,
            detail="Invalid username given",
        )

    boardname_without_dash = userboard.board.replace("-", "")
    if not boardname_without_dash.isalnum():
        raise HTTPException(
            status_code=422,
            detail="Invalid board name given",
        )

    headers = {"Authorization": authorization, "Accept": "application/json"}

    res = requests.get(
        "https://api.github.com/user",
        headers=headers,
    )

    data = res.json()

    # We can safely assume that the user with the username equal to 'login'
    # has access to the account. This means we can use this username and
    # possibly the id (I think they are unique) to store with my internal
    # user data structure to function like a login
    if data.get("login") and data.get("id"):
        if isinstance(data["login"], str) and isinstance(data["id"], int):
            # I have admin permissions to add people
            if data.get("login") == "JakeRoggenbuck":
                add_user_to_board(userboard.username, userboard.board)
                update_board_participant_counts()

            # Check if GitHub responded
            if res.status_code == 200:
                return JSONResponse(content=res.json(), status_code=200)

    return JSONResponse(content={"message": "Could not load"}, status_code=400)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/status")
def read_satus():
    return "okay"


@app.get("/boards/")
def get_boards():
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()
    val = cur.execute("SELECT * FROM boards")

    all_rows = []
    for row in val.fetchall():
        all_rows.append({"id": row[2], "name": row[1], "participants": row[3]})

    return all_rows


@app.get("/solved/")
def get_solved():
    return calculate_total_solved_on_board()


@app.get("/entries/{board_id}")
def get_entries(
    board_id: str,
    start_date: datetime = Query(None),
    end_date: datetime = Query(None),
):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    real_board_id = cur.execute(
        "SELECT id FROM boards WHERE boards.urlname = ?",
        (board_id,),
    ).fetchone()[0]

    if start_date and end_date:
        query = """
        SELECT ur.*
        FROM user_rank ur
        INNER JOIN users u ON ur.name = u.name
        INNER JOIN boards_users bu ON u.id = bu.user_id
        WHERE bu.board_id = ?
        AND ur.whentime BETWEEN ? AND ?
        AND ur.id NOT IN (11, 6, 7)
        ORDER BY ur.whentime ASC
        """
        val = cur.execute(query, (real_board_id, start_date, end_date))
    else:
        val = cur.execute(
            """
        SELECT ur.*
        FROM user_rank ur
        INNER JOIN users u ON ur.name = u.name
        INNER JOIN boards_users bu ON u.id = bu.user_id
        WHERE bu.board_id = ?
        AND ur.id NOT IN (11, 6, 7)
        ORDER BY ur.whentime ASC
        """,
            (real_board_id,),
        )

    return val.fetchall()


@app.get("/boards/{board_id}")
def get_board(
    board_id: str,
    start_date: datetime = Query(None),
    end_date: datetime = Query(None),
):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    val = None
    use_date_range = True

    all_rows = []

    real_board_id = cur.execute(
        "SELECT id FROM boards WHERE boards.urlname = ?",
        (board_id,),
    ).fetchone()[0]

    if use_date_range:
        query = """
        SELECT ur.*
        FROM user_rank ur
        INNER JOIN users u ON ur.name = u.name
        INNER JOIN boards_users bu ON u.id = bu.user_id
        WHERE bu.board_id = ?
        AND ur.whentime BETWEEN ? AND ?
        AND ur.id NOT IN (11, 6, 7)
        ORDER BY ur.whentime ASC
        """
        vals = cur.execute(query, (real_board_id, start_date, end_date))

        # [(729, 'jakeroggenbuck', 151747, 303, 86, 12, '2024-05-21 10:48:05.716504')]

        scores = {}

        for val in vals.fetchall():
            name = val[1]
            if name not in scores:
                scores[name] = {"id": val[0]}

            scores[name]["easy_max"] = max(scores[name].get("easy_max", val[3]), val[3])
            scores[name]["easy_min"] = min(scores[name].get("easy_min", val[3]), val[3])

            scores[name]["med_max"] = max(scores[name].get("med_max", val[4]), val[4])
            scores[name]["med_min"] = min(scores[name].get("med_min", val[4]), val[4])

            scores[name]["hard_max"] = max(scores[name].get("hard_max", val[5]), val[5])
            scores[name]["hard_min"] = min(scores[name].get("hard_min", val[5]), val[5])

            scores[name]["score_max"] = max(
                scores[name].get("score_max", val[2]), val[2]
            )
            scores[name]["score_min"] = min(
                scores[name].get("score_min", val[2]), val[2]
            )

        for name, data in scores.items():
            easy = data["easy_max"] - data["easy_min"]
            med = data["med_max"] - data["med_min"]
            hard = data["hard_max"] - data["hard_min"]

            all_rows.append(
                {
                    "id": data["id"],
                    "solved": {"easy": easy, "medium": med, "hard": hard},
                    "name": name,
                    "score": linear_weight(easy, med, hard),
                }
            )

    else:
        val = cur.execute(
            """
        SELECT users.*
        FROM users
        JOIN boards_users ON users.id = boards_users.user_id
        JOIN boards ON boards_users.board_id = boards.id
        WHERE users.id NOT IN (11, 6, 7)
        AND boards.urlname = ?;""",
            (board_id,),
        )

        for row in val.fetchall():
            all_rows.append(
                {
                    "id": row[0],
                    "solved": {"easy": row[3], "medium": row[4], "hard": row[5]},
                    "name": row[1],
                    "score": row[2],
                }
            )

    all_rows = sorted(all_rows, key=lambda x: x["score"], reverse=True)

    # df = pd.json_normalize(all_rows, sep="_")
    # summary_statistics = df.describe().to_dict()

    summary_statistics = {}

    return {
        "participants": all_rows,
        "stats": summary_statistics,
        "counts": count_problems(board_id),
    }


def print_startup():
    print(
        r"""      _ _____   ___
     | |  __ \ / _ \
     | | |__) | | | | ___  _ __ __ _
 _   | |  _  /| | | |/ _ \| '__/ _` |
| |__| | | \ \| |_| | (_) | | | (_| |
 \____/|_|  \_\\___(_)___/|_|  \__, |
                                __/ |
LeaterBoard Backend CLI        |___/
=====================================
         """
    )

    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    user_ranks = cur.execute(
        "SELECT count(*) FROM user_rank",
    ).fetchone()[0]
    boards = cur.execute("SELECT count(*) FROM boards").fetchone()[0]

    count = count_problems("everyone")
    lw_count = count_problems("leaterworks")

    print("Solved: ", calculate_total_solved_on_board())

    print(f"Boards: {boards}")
    print(f"Entries: {user_ranks}\n")
    print(f"Problems Solved:\n\t{count}\n")
    print(f"Problems Solved (Just LeaterWorks):\n\t{lw_count}")
    print("\nLast pulled:", get_last_entry_time())
    print()


def parser():
    parse = argparse.ArgumentParser(description="LeaterBoard Backend CLI")
    parse.add_argument(
        "-p",
        "--pull",
        help="Pull new data",
        action="store_true",
    )
    parse.add_argument(
        "-c",
        "--create",
        help="Add new user",
    )
    parse.add_argument(
        "-a",
        "--assign",
        help="Add user to board [user:board]",
    )
    parse.add_argument(
        "-b",
        "--board",
        help="Create a new board",
    )
    parse.add_argument(
        "-u",
        "--update_participant_counts",
        help="Update participant counts",
        action="store_true",
    )
    parse.add_argument(
        "-s",
        "--setup",
        help="Setup the database (can be run anytime)",
        action="store_true",
    )

    return parse


if __name__ == "__main__":
    parse = parser()
    args = parse.parse_args()

    if args.setup:
        setup_database()

    elif args.pull:
        repull_replace_data()

    elif args.create:
        add_user(args.create, verbose=True)

    elif args.update_participant_counts:
        update_board_participant_counts(verbose=True)

    elif args.assign:
        user, board = args.assign.split(":")
        add_user_to_board(user, board, verbose=True)

    elif args.board:
        add_board(args.board)

    else:
        parse.print_help()

    print_startup()

    # add_starting_data()
