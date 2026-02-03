import requests


def pull_data_gql(username: str):
    url = "https://leetcode.com/graphql"

    payload = {
        "query": """
        query ($username: String!) {

        matchedUser(username: $username) {
            profile {
                ranking
            }
            submitStatsGlobal {
            acSubmissionNum {
                difficulty
                count
            }
            }
        }
        }
        """,
        "variables": {"username": username}
    }

    r = requests.post(url, json=payload)

    data = r.json()["data"]["matchedUser"]
    ranking = data["profile"]["ranking"]
    solved_raw = data["submitStatsGlobal"]["acSubmissionNum"]
    solved = {}

    for x in solved_raw:
        solved[x["difficulty"]] = x["count"]

    solved["Rank"] = ranking

    return solved


if __name__ == "__main__":
    print(pull_data_gql("jakeroggenbuck"))
