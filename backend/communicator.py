# Implement the communicator and caching
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import json
import datetime


URL = "https://leetcode.com/"


def pull_full_page(username: str) -> str:

    file_path = Path(username)

    if file_path.exists():

        # Get times for time delta
        time = datetime.datetime.fromtimestamp(file_path.stat().st_mtime, tz=datetime.timezone.utc)
        now = datetime.datetime.now(tz=datetime.timezone.utc)

        # Check if file is older than 5 minutes
        if now - time < datetime.timedelta(minutes=5):

            with open(username, "r") as file:
                return file.read()

    # Pull data from URL
    res = requests.get(URL + username)

    with open(username, "w") as file:
        file.write(res.text)

    return res.text


def get_json_data(page: str) -> dict:

    html_id = "__NEXT_DATA__"

    soup = BeautifulSoup(page, 'html.parser')

    found_data = soup.find(id=html_id)

    data = json.loads(found_data.text)

    return data


def get_rank(json_data: dict) -> int:
    '''
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
    '''

    ranking = json_data["props"]["pageProps"]["dehydratedState"]["queries"][0]["state"]["data"]["matchedUser"]["profile"]["ranking"]

    return ranking


if __name__ == "__main__":
    pulled = pull_full_page("jakeroggenbuck")

    a = get_json_data(pulled)

    print(get_rank(a))
