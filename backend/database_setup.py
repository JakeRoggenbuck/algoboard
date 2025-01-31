import sqlite3
from pathlib import Path
import json
from datetime import datetime
from tqdm import tqdm
import pull


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
        ranking = pull.pull_rank(user[1])

        data = {
            "ranking": ranking["ranking"],
            "easySolved": data["easySolved"],
            "hardSolved": data["hardSolved"],
            "mediumSolved": data["mediumSolved"]
        }

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

