from fastapi import Header
import requests
from fastapi.responses import JSONResponse
from database import log_email
from typing import Union


# GitHub Client stuff
CLIENT_ID = ""
CLIENT_SECRET = ""

with open("config.secret") as file:
    # FORMAT:
    # first line = client id
    # second line = client secret

    CLIENT_ID = file.readline().rstrip()
    CLIENT_SECRET = file.readline().rstrip()


def get_user_info(authorization: str = Header(default=None)):
    headers = {"Authorization": authorization, "Accept": "application/json"}

    res = requests.get(
        "https://api.github.com/user",
        headers=headers,
    )

    data = res.json()

    email_response = requests.get(
        "https://api.github.com/user/emails",
        headers=headers,
    )

    if email_response.status_code == 200:
        email_data = email_response.json()

        primary_email = None
        for email_obj in email_data:
            if email_obj.get("primary"):
                primary_email = email_obj.get("email")
                break

        if not primary_email and email_data:
            primary_email = email_data[0].get("email")

        data["primary_email"] = primary_email
        data["all_emails"] = email_data

        if primary_email:
            log_email(primary_email, data.get("login"))

    # We can safely assume that the user with the username equal to 'login'
    # has access to the account. This means we can use this username and
    # possibly the id (I think they are unique) to store with my internal
    # user data structure to function like a login
    if data.get("login") and data.get("id"):
        if isinstance(data["login"], str) and isinstance(data["id"], int):
            print(data["id"], data["login"])

        print(
            "GitHub Profile Email: ",
            data.get("primary_email"),
            data.get("all_emails"),
        )

    # Check if GitHub responded
    if res.status_code == 200:
        return JSONResponse(content=res.json(), status_code=200)

    return JSONResponse(
        content={
            "message": "Could not load",
            "result": res.json(),
        },
        status_code=400,
    )


def get_access_token(code: Union[str, None] = None):
    if code:
        params = (
            "?client_id="
            + CLIENT_ID
            + "&client_secret="
            + CLIENT_SECRET
            + "&code="
            + code
        )

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        # Ask GitHub for the access token
        res = requests.post(
            "https://github.com/login/oauth/access_token" + params,
            headers=headers,
        )

        return JSONResponse(content=res.json(), status_code=200)

    return JSONResponse(content={"message": "Could not load"}, status_code=400)
