from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def setup_database():
    created = Path("./ranking.db").exists()

    con = sqlite3.connect("ranking.db")

    cur = con.cursor()

    if not created:
        cur.execute(
            """CREATE TABLE boards(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            urlname TEXT NOT NULL,
            participants INTEGER NOT NULL)"""
        )

        cur.execute(
            """CREATE TABLE users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL)"""
        )

        cur.execute(
            """CREATE TABLE boards_users(
            board_id INTEGER,
            user_id INTEGER,

            FOREIGN KEY(board_id) REFERENCES boards(id),
            FOREIGN KEY(user_id) REFERENCES users(id))"""
        )

        cur.execute("INSERT into boards VALUES(NULL, 'Everyone', 'everyone', 1)")
        board_id = cur.lastrowid

        cur.execute("INSERT into boards VALUES(NULL, 'LeaterWorks', 'leaterworks', 1)")
        works_id = cur.lastrowid

        cur.execute("INSERT into users VALUES(NULL, 'jakeroggenbuck')")
        user_id = cur.lastrowid

        cur.execute(
            "INSERT into boards_users VALUES(?, ?)",
            (
                board_id,
                user_id,
            ),
        )

        cur.execute(
            "INSERT into boards_users VALUES(?, ?)",
            (
                works_id,
                user_id,
            ),
        )

        usernames = [
            "realchef",
            "AroopB",
            "AggieWorker",
            "hansonn",
            "2003kevinle",
            "siddharthmmani",
            "normando",
            "vshl",
            "andchen1",
            "feliciafengg",
            "ahujaanish11",
            "isabellovecandy",
            "atata6",
        ]

        for username in usernames:
            cur.execute("INSERT into users VALUES(NULL, ?)", (username,))
            user_id = cur.lastrowid

            cur.execute(
                "INSERT into boards_users VALUES(?, ?)",
                (
                    works_id,
                    user_id,
                ),
            )

        con.commit()
        con.close()

        # cur.execute(
        #     """CREATE TABLE ranking(
        #     id INTEGER PRIMARY KEY,
        #     name TEXT NOT NULL,
        #     rank INTEGER NOT NULL,
        #     easy_solved INTEGER NOT NULL,
        #     med_solved INTEGER NOT NULL,
        #     hard_solved INTEGER NOT NULL,
        #     time timestamp)"""
        # )


setup_database()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/boards/")
def get_boards():
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()
    val = cur.execute("SELECT * FROM boards")

    all_rows = []
    for row in val.fetchall():
        all_rows.append({"id": row[2], "name": row[1], "participants": row[3]})

    return all_rows


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
    WHERE boards.urlname = ?;""",
        (board_id,),
    )

    all_rows = []
    for row in val.fetchall():
        all_rows.append(
            {
                "id": row[0],
                "solved": {"easy": 1, "medium": 1, "hard": 1},
                "name": row[1],
                "score": 1,
            }
        )

    return all_rows
