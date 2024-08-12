import requests

URL = "https://leetcode-stats-api.herokuapp.com/"


def get_url(username: str):
    return URL + username


def pull_data(username: str):
    res = requests.get(get_url(username))
    return res.json()
