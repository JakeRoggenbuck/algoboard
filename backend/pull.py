import requests

URL = "https://alfa-leetcode-api.onrender.com/"


def get_url(username: str):
    return URL + username


def pull_data(username: str):
    res = requests.get(get_url(username) + "/solved")
    return res.json()


def pull_rank(username: str):
    res = requests.get(get_url(username))
    return res.json()


if __name__ == "__main__":
    print(pull_data("jakeroggenbuck"))
