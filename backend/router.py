from fastapi import FastAPI
import pull
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3
import json
import pandas as pd
from datetime import datetime

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
            name TEXT NOT NULL,
            rank INTEGER NOT NULL,
            easy_solved INTEGER NOT NULL,
            med_solved INTEGER NOT NULL,
            hard_solved INTEGER NOT NULL)"""
        )

        cur.execute(
            """CREATE TABLE user_rank(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rank INTEGER NOT NULL,
            easy_solved INTEGER NOT NULL,
            med_solved INTEGER NOT NULL,
            hard_solved INTEGER NOT NULL,
            whentime timestamp)"""
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

        with open("../old-backend/aggieworks-swe-3-9-2024.json") as file:
            data = json.load(file)

            for row in data:
                username = row["name"]
                rank = row["rank"]
                solved = row["solved"]["submitStatsGlobal"]["acSubmissionNum"]

                easy = solved[1]
                assert easy["difficulty"] == "Easy"

                med = solved[2]
                assert med["difficulty"] == "Medium"

                hard = solved[3]
                assert hard["difficulty"] == "Hard"

                cur.execute(
                    "INSERT into users VALUES(NULL, ?, ?, ?, ?, ?)",
                    (username, rank, easy["count"], med["count"], hard["count"]),
                )

                user_id = cur.lastrowid

                cur.execute(
                    "INSERT into boards_users VALUES(?, ?)",
                    (
                        works_id,
                        user_id,
                    ),
                )

                cur.execute(
                    "INSERT into boards_users VALUES(?, ?)",
                    (
                        board_id,
                        user_id,
                    ),
                )

        con.commit()

        cur.execute(
            """SELECT board_id, COUNT(user_id) as user_count
            FROM boards_users
            GROUP BY board_id"""
        )

        board_user_counts = cur.fetchall()

        for board_id, user_count in board_user_counts:
            cur.execute(
                """UPDATE boards
                SET participants = ?
                WHERE id = ?""",
                (user_count, board_id),
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


def repull_replace_data():
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()
    val = cur.execute("SELECT * FROM users")
    users = val.fetchall()

    all_data = {}

    con = sqlite3.connect("ranking.db")

    cur = con.cursor()

    for user in users:
        data = pull.pull_data(user[1])

        all_data[user[1]] = data

        to_update = (
            (
                data["ranking"],
                data["easySolved"],
                data["mediumSolved"],
                data["hardSolved"],
                user[1],
            ),
        )

        cur.execute(
            "UPDATE users SET rank=?, easy_solved=?, med_solved=?, hard_solved=? WHERE name=?",
            *to_update,
        )

        cur.execute(
            "INSERT into user_rank VALUES(NULL, ?, ?, ?, ?, ?, ?)",
            (user[1], data["ranking"], data["easySolved"], data["mediumSolved"], data["hardSolved"], datetime.now(),),
        )

    con.commit()
    con.close()


setup_database()

# repull_replace_data()


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


@app.get("/entries")
def get_entries():
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()
    val = cur.execute("SELECT * FROM user_rank")

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
    WHERE boards.urlname = ?;""",
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

    df = pd.json_normalize(all_rows, sep='_')
    summary_statistics = df.describe().to_dict()

    return {"participants": all_rows, "stats": summary_statistics}
