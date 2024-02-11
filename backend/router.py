from fastapi import FastAPI
from communicator import pull_full_page, get_json_data, get_rank
from pathlib import Path
import sqlite3
from datetime import datetime

app = FastAPI()

con = sqlite3.connect("ranking.db")

cur = con.cursor()

has_created = False
if Path("./ranking.db"):
    has_created = True

if not has_created:
    cur.execute("""CREATE TABLE raking(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        rank INTEGER NOT NULL,
        time timestamp)""")


@app.get("/leaterboard/{board_id}")
def get_leaterboard(board_id: str):

    users_in_board = []

    # Get users
    with open(f"boards/{board_id}", "r") as file:
        for line in file:
            users_in_board.append({"name": line.rstrip()})

    # Add rank for each user
    for user in users_in_board:
        page = pull_full_page(user["name"])
        json_data = get_json_data(page)

        rank = get_rank(json_data)

        user["rank"] = rank
        user["date"] = str(datetime.now())

    # Sort
    users_in_board = sorted(users_in_board, key=lambda x: x["rank"])

    return users_in_board
