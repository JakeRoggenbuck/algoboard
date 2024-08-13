from fastapi import FastAPI, Query
import pull
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3
import json
import pandas as pd
from datetime import datetime
from tqdm import tqdm
import argparse

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://50.116.10.252:3000"
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

        cur.execute(
            "INSERT into boards VALUES(NULL, 'Everyone', 'everyone', 1)",
        )
        board_id = cur.lastrowid

        cur.execute(
            "INSERT into boards VALUES(NULL, 'LeaterWorks', 'leaterworks', 1)",
        )
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
                    (
                        username,
                        rank,
                        easy["count"],
                        med["count"],
                        hard["count"],
                    ),
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


def repull_replace_data():
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()
    val = cur.execute("SELECT * FROM users")
    users = val.fetchall()

    all_data = {}

    con = sqlite3.connect("ranking.db")

    cur = con.cursor()

    for user in tqdm(users):
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
            """UPDATE users
            SET rank=?, easy_solved=?, med_solved=?, hard_solved=?
            WHERE name=?""",
            *to_update,
        )

        cur.execute(
            "INSERT into user_rank VALUES(NULL, ?, ?, ?, ?, ?, ?)",
            (
                user[1],
                data["ranking"],
                data["easySolved"],
                data["mediumSolved"],
                data["hardSolved"],
                datetime.now(),
            ),
        )

    con.commit()
    con.close()


START_DATA = [
    [99991, 'hansonn', 470919, 64, 94, 13, '2024-02-12 20:02:36.785595'],
    [99992, '2003kevinle', 702659, 53, 62, 0, '2024-02-12 20:02:36.795578'],
    [99993, 'feliciafengg', 784868, 75, 26, 0, '2024-02-12 20:02:36.842753'],
    [99994, 'realchef', 891656, 63, 28, 0, '2024-02-12 20:02:36.712859'],
    [99995, 'normando', 939765, 43, 35, 3, '2024-02-12 20:02:36.813943'],
    [99996, 'AroopB', 1033796, 31, 39, 0, '2024-02-12 20:02:36.733985'],
    [99997, 'jakeroggenbuck', 1151340, 50, 8, 2, '2024-02-12 20:02:36.722913'],
    [99998, 'siddharthmmani', 1673868, 27, 6, 0, '2024-02-12 20:02:36.804582'],
    [99999, 'ahujaanish11', 1718014, 21, 11, 0, '2024-02-12 20:02:36.852473'],
    [100000, 'andchen1', 2425496, 13, 3, 0, '2024-02-12 20:02:36.833592'],
    [100001, 'atata6', 3114099, 12, 1, 0, '2024-02-12 20:02:36.869488'],
    [100002, 'vshl', 4476769, 3, 0, 0, '2024-02-12 20:02:36.824410'],
    [100003, 'AggieWorker', 5000001, 2, 0, 0, '2024-02-12 20:02:36.775176'],
    [
        100004,
        'isabellovecandy',
        5000001,
        0,
        0,
        0,
        '2024-02-12 20:02:36.860291',
    ],
]


def add_starting_data():
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    for user in START_DATA:
        print((*user[1:],))

        should = input(": ")
        if should == "Y":
            cur.execute(
                "INSERT into user_rank VALUES(NULL, ?, ?, ?, ?, ?, ?)",
                (*user[1:],),
            )


def count_problems(board: str):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    problems = cur.execute(
        """SELECT u.easy_solved, u.med_solved, u.hard_solved
        FROM users as u
        JOIN boards_users ON u.id = boards_users.user_id
        JOIN boards ON boards_users.board_id = boards.id
        WHERE boards.urlname = ?;""",
        (board,),
    ).fetchall()

    counts = {"all": 0, "easy": 0, "medium": 0, "hard": 0}

    for p in problems:
        counts["all"] += p[0] + p[1] + p[2]
        counts["easy"] += p[0]
        counts["medium"] += p[1]
        counts["hard"] += p[2]

    return counts


def add_user(username: str, verbose: bool = False):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    cur.execute(
        "INSERT into users VALUES(NULL, ?, ?, ?, ?, ?)",
        (username, 0, 0, 0, 0),
    )

    if verbose:
        print(f"Added {username}")

    con.commit()
    con.close()


def add_board(board: str, verbose: bool = False):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    urlname = board.lower()
    urlname = urlname.replace(" ", "-")

    cur.execute(
        "INSERT into boards VALUES(NULL, ?, ?)",
        (board, urlname, 0),
    )

    if verbose:
        print(f"Added {board} as {urlname}")

    con.commit()
    con.close()


def add_user_to_board(username: str, board: str, verbose: bool = False):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    board_id = cur.execute(
        "SELECT id FROM boards WHERE urlname = ?",
        (board,),
    ).fetchone()
    user_id = cur.execute(
        "SELECT id FROM users WHERE name = ?",
        (username,),
    ).fetchone()

    cur.execute(
        "INSERT into boards_users VALUES(?, ?)",
        (
            board_id[0],
            user_id[0],
        ),
    )

    if verbose:
        print(f"Added {username} to {board}")

    con.commit()
    con.close()


def get_last_entry_time() -> str:
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    timestamp = cur.execute(
        "SELECT whentime FROM user_rank ORDER BY whentime DESC LIMIT 1;",
    ).fetchone()

    con.close()

    return timestamp[0]


def update_board_participant_counts(verbose=True):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    cur.execute(
        """SELECT board_id, COUNT(user_id) as user_count
        FROM boards_users
        GROUP BY board_id"""
    )

    board_user_counts = cur.fetchall()

    for board_id, user_count in board_user_counts:
        if verbose:
            print(board_id, user_count)

        cur.execute(
            """UPDATE boards
            SET participants = ?
            WHERE id = ?""",
            (user_count, board_id),
        )

    con.commit()
    con.close()


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
