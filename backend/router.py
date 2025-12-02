from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime
from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse
from typing import Union, List
from pydantic import BaseModel
import time
from starlette.middleware.sessions import SessionMiddleware
from os import getenv
from dotenv import load_dotenv
import kronicler
import httpx

# Internal Imports
from args import parser
from database_setup import repull_replace_data, setup_database
from database import (
    get_board_data,
    update_board_participant_counts,
    total_solved_on_board,
    get_last_entry_time,
    add_user_to_board,
    add_board,
    add_user,
    total_problems,
    get_logins,
)
from auth import get_access_token, get_user_info, is_github_authenticated


class User(BaseModel):
    username: str

    def valid_usersname(self):
        return all(c.isalnum() or c == "-" for c in self.username)


class UserBoard(BaseModel):
    username: str
    board: str

    def valid_usersname(self):
        return all(c.isalnum() or c == "-" for c in self.username)


load_dotenv(override=True)

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=getenv("FASTAPI_SECRET_KEY"))

DB = kronicler.Database(sync_consume=True)

app.add_middleware(kronicler.KroniclerMiddleware)


@app.get("/logs")
def read_logs():
    return DB.logs()


class SearchQuery(BaseModel):
    query: str
    top_k: int = 5


class SearchResult(BaseModel):
    chunk: str
    similarity: float
    title: str
    url: str
    filename: str
    chunk_index: int


# Used in another project
@app.post("/transcript/search", response_model=List[SearchResult])
async def search_transcripts(query: SearchQuery):
    url = "http://localhost:8005/search"

    try:
        async with httpx.AsyncClient() as client:
            r = await client.post(url, json=query.dict())
            r.raise_for_status()
            return r.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Proxy error: {e}")


@app.middleware("http")
async def log_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Request: {request.url.path} completed in {process_time:.4f} seconds")
    return response


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://50.116.10.252:3000",
    "http://algoboard.org",
    "https://algoboard.org",
    "https://leaterboard.vercel.app",
    "https://kronicler.vercel.app",
    "https://usekronicler.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/access-token")
def get_access_token_route(code: Union[str, None] = None):
    return get_access_token(code)


@app.get("/user-info")
def get_user_info_route(authorization: str = Header(default=None)):
    return get_user_info(authorization)


@app.post("/admin/create-user")
def create_user_router(user: User, authorization: str = Header(default=None)):
    if not user.valid_usersname():
        raise HTTPException(
            status_code=422,
            detail="Invalid username given",
        )

    if is_github_authenticated(authorization):
        add_user(user.username)
        add_user_to_board(user.username, "everyone")
        update_board_participant_counts()

        return JSONResponse(
            content={"created_user": user.username},
            status_code=200,
        )

    return JSONResponse(content={"message": "Could not load"}, status_code=400)


@app.get("/admin/get-logins")
def get_logins_route(authorization: str = Header(default=None)):
    if is_github_authenticated(authorization):
        logins = get_logins()
        return JSONResponse(content=logins, status_code=200)

    return JSONResponse(content={"message": "Could not load"}, status_code=400)


@app.post("/admin/add-user-to-board")
def add_user_to_board_route(
    userboard: UserBoard,
    authorization: str = Header(default=None),
):
    if not userboard.valid_usersname():
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

    if is_github_authenticated(authorization):
        add_user_to_board(userboard.username, userboard.board)
        update_board_participant_counts()

        return JSONResponse(
            content={"user_added": userboard.username},
            status_code=200,
        )

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
    return total_solved_on_board()


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
    all_rows = get_board_data(board_id, start_date, end_date)

    # df = pd.json_normalize(all_rows, sep="_")
    # summary_statistics = df.describe().to_dict()

    # I forget why this is set back to an empty dict
    # TODO: Fix this!
    summary_statistics = {}

    return {
        "participants": all_rows,
        "stats": summary_statistics,
        "counts": total_problems(board_id),
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

    count = total_problems("everyone")
    lw_count = total_problems("leaterworks")

    print("Solved: ", total_solved_on_board())

    print(f"Boards: {boards}")
    print(f"Entries: {user_ranks}\n")
    print(f"Problems Solved:\n\t{count}\n")
    print(f"Problems Solved (Just LeaterWorks):\n\t{lw_count}")
    print("\nLast pulled:", get_last_entry_time())
    print()


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
