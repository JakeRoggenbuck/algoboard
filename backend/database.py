import sqlite3


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


def log_email(email: str, username: str):
    con = sqlite3.connect("ranking.db")
    cur = con.cursor()

    cur.execute(
        "INSERT into emails VALUES(NULL, ?, ?)",
        (email, username),
    )


def add_user(username: str, verbose: bool = False):
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


def calculate_total_solved_on_board():
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
