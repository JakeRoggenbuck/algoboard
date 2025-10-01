import sqlite3
from datetime import datetime
from typing import Dict, List, Tuple
from alg import linear_weight

"""Naming for database.py file

Anything that start with `_ab` is an internal function only for this file.

`_fetch` prefix -> fetches data and returns it
`_calc` prefix -> calculate on data given (no DB operation)
"""


def _fetch_problems(board: str) -> List[Tuple]:
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

    return problems


def _calc_count_problems(problems) -> Dict[str, int]:
    counts = {"all": 0, "easy": 0, "medium": 0, "hard": 0}

    for p in problems:
        counts["all"] += p[0] + p[1] + p[2]
        counts["easy"] += p[0]
        counts["medium"] += p[1]
        counts["hard"] += p[2]

    return counts


def total_problems(board: str) -> Dict[str, int]:
    problems = _fetch_problems(board)
    return _calc_count_problems(problems)


def log_email(email: str, username: str) -> None:
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    cur.execute(
        "INSERT into emails (email, username, timestamp) VALUES(?, ?, ?)",
        (email, username, datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
    )

    con.commit()


def get_logins() -> List[str]:
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    logins = cur.execute("SELECT * from emails;").fetchall()

    return list(logins)


def add_user(username: str, verbose: bool = False) -> None:
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    cur.execute(
        "INSERT into users VALUES(NULL, ?, ?, ?, ?, ?)",
        (username, 10_000, 0, 0, 0),
    )

    if verbose:
        print(f"Added {username}")

    con.commit()
    con.close()


def add_board(board: str, verbose: bool = False) -> None:
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    urlname = board.lower()
    urlname = urlname.replace(" ", "-")

    cur.execute(
        "INSERT into boards VALUES(NULL, ?, ?, ?)",
        (board, urlname, 0),
    )

    if verbose:
        print(f"Added {board} as {urlname}")

    con.commit()
    con.close()


def add_user_to_board(username: str, board: str, verbose: bool = False) -> None:
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


def _fetch_total_solved_on_board() -> Tuple[List[Tuple], List[Tuple]]:
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    recent = cur.execute(
        """
        WITH RankedEntries AS (
            SELECT name, easy_solved, med_solved, hard_solved, whentime,
                    ROW_NUMBER() OVER (PARTITION BY name ORDER BY whentime DESC) AS rn
            FROM user_rank
        )
        SELECT name, easy_solved, med_solved, hard_solved, whentime
        FROM RankedEntries
        WHERE rn = 1;
        """
    ).fetchall()

    first = cur.execute(
        """
        WITH RankedEntries AS (
            SELECT name, easy_solved, med_solved, hard_solved, whentime,
                    ROW_NUMBER() OVER (PARTITION BY name ORDER BY whentime ASC) AS rn
            FROM user_rank
        )
        SELECT name, easy_solved, med_solved, hard_solved, whentime
        FROM RankedEntries
        WHERE rn = 1;
        """
    ).fetchall()

    con.close()

    return recent, first


def _calc_total_solved_on_board(recent, first) -> Dict[str, int]:
    found = {}

    for row in recent:
        found[row[0]] = [(row[1], row[2], row[3])]

    for row in first:
        found[row[0]].append((row[1], row[2], row[3]))

    sums = {"easy": 0, "med": 0, "hard": 0}

    for _, v in found.items():
        a = v[0]
        b = v[1]

        sums["easy"] += a[0] - b[0]
        sums["med"] += a[1] - b[1]
        sums["hard"] += a[2] - b[2]

    return sums


def total_solved_on_board() -> Dict[str, int]:
    recent, first = _fetch_total_solved_on_board()
    return _calc_total_solved_on_board(recent, first)


def update_board_participant_counts(verbose=True) -> None:
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


# TODO: Split up creation and usage here - issue #131
def get_board_data(board_id: str, start_date: datetime, end_date: datetime) -> List:
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

    return all_rows
