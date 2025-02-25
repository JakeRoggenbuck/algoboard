from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd
from datetime import datetime
import argparse
from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse
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


class User(BaseModel):
    username: str


class UserBoard(BaseModel):
    username: str
    board: str


app = FastAPI()

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
        params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + code

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

        print("GitHub Profile Email: ", data.get("primary_email"), data.get("all_emails"))

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
def get_logins_route(user: User, authorization: str = Header(default=None)):

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
def get_board(board_id: str):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

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

    all_rows = []
    for row in val.fetchall():
        all_rows.append(
            {
                "id": row[0],
                "solved": {"easy": row[3], "medium": row[4], "hard": row[5]},
                "name": row[1],
                "score": row[2],
            }
        )

    all_rows = sorted(all_rows, key=lambda x: x["score"])

    df = pd.json_normalize(all_rows, sep="_")
    summary_statistics = df.describe().to_dict()

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
