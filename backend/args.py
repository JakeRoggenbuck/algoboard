import argparse


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
