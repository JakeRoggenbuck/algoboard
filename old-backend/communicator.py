# Implement the communicator and caching
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import json
import datetime


URL = "https://leetcode.com/"


def pull_full_page(username: str) -> str:
    file_path = Path("users_cache") / Path(username)

    if file_path.exists():
        # Get times for time delta
        time = datetime.datetime.fromtimestamp(
            file_path.stat().st_mtime, tz=datetime.timezone.utc
        )
        now = datetime.datetime.now(tz=datetime.timezone.utc)

        # Check if file is older than 100 minutes
        if now - time < datetime.timedelta(minutes=100):
            with open(file_path, "r") as file:
                return file.read()

    # Pull data from URL
    res = requests.get(URL + username)

    with open(file_path, "w") as file:
        file.write(res.text)

    return res.text


def get_json_data(page: str) -> dict:
    html_id = "__NEXT_DATA__"

    soup = BeautifulSoup(page, "html.parser")

    found_data = soup.find(id=html_id)

    data = json.loads(found_data.text)

    with open("output_full.json", "w") as file:
        json.dump(data, file, indent=4)

    return data


def get_rank(json_data: dict) -> int:
    """
    {
    "props": {
        "pageProps": {
        "dehydratedState": {
            "mutations": [],
            "queries": [
            {
                "state": {
                "data": {
                    "matchedUser": {
                    "contestBadge": null,
                    "username": "jakeroggenbuck",
                    "githubUrl": null,
                    "twitterUrl": null,
                    "linkedinUrl": null,
                    "profile": {
                        "ranking": 2975231,
    """

    try:
        ranking = json_data["props"]["pageProps"]["dehydratedState"]["queries"][0][
            "state"
        ]["data"]["matchedUser"]["profile"]["ranking"]
    except KeyError:
        ranking = -1

    return ranking


def get_solved(json_data: dict) -> int:
    """
    {
    "props": {
        "pageProps": {
        "dehydratedState": {
            "mutations": [],
            "queries": [
            {
                "state": {
                "data": {
                    "matchedUser": {
                    "contestBadge": null,
                    "username": "jakeroggenbuck",
                    "githubUrl": null,
                    "twitterUrl": null,
                    "linkedinUrl": null,
                    "profile": {
                        "ranking": 2975231,
    """

    try:
        solved = json_data["props"]["pageProps"]["dehydratedState"]["queries"]

        print(solved)

        found = False
        for x in solved:
            if "allQuestionsCount" in str(x):
                solved = x
                found = True

        if found:
            solved = solved["state"]["data"]["matchedUser"]
        else:
            solved = solved[-1]["state"]["data"]["matchedUser"]
    except KeyError:
        solved = 0

    return solved


if __name__ == "__main__":
    pulled = pull_full_page("jakeroggenbuck")

    a = get_json_data(pulled)
    print(a)

    # print(get_solved(a))
