from os import getenv
from fastapi import HTTPException, Request
from authlib.integrations.starlette_client import OAuth
from datetime import datetime, timedelta
from jose import jwt, ExpiredSignatureError, JWTError
import uuid
import traceback
from starlette.config import Config
from typing import Union


config = Config(".env")


oauth = OAuth()
oauth.register(
    name="AlgoBoard",
    client_id=config("GOOGLE_CLIENT_ID"),
    client_secret=config("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    refresh_token_url=None,
    authorize_state=config("SECRET_KEY"),
    redirect_uri="http://127.0.0.1:3000/auth/callback",
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={"scope": "openid profile email"},
)

SECRET_KEY = getenv("JWT_SECRET_KEY")

if SECRET_KEY is None:
    raise Exception("JWT_SECRET_KEY not found!")

ALGORITHM = "HS256"


def jwt_create_access_token(data: dict, expires: Union[timedelta, None] = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def jwt_get_current_user(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user_id": payload.get("sub"), "email": payload.get("email")}
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")


@app.get("/login")
async def login(request: Request):
    request.session.clear()
    referer = request.headers.get("refer")
    frontend_url = getenv("FRONTEND_URL")
    redirect_url = getenv("REDIRECT_URL")
    request.session["login_redirect"] = frontend_url

    return await oauth.AlgoBoard.authorize_redirect(
        request,
        redirect_url,
        prompt="consent",
    )


@app.route("/auth")
async def auth(request: Request):
    try:
        token = await oauth.AlgoBoard.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google auth failed.")

    try:
        user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {token['access_token']}"}
        google_response = requests.get(user_info_endpoint, headers=headers)
        user_info = google_response.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    user = token.get("userinfo")
    expires_in = token.get("expires_in")
    user_id = user.get("sub")
    iss = user.get("iss")
    user_email = user.get("email")
    first_logged_in = datetime.now()
    last_accessed = datetime.now()

    user_name = user_info.get("name")
    user_pic = user_info.get("picture")

    if iss not in ["https://accounts.google.com", "accounts.google.com"]:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    access_token_expires = timedelta(seconds=expires_in)
    access_token = jwt_create_access_token(
        data={"sub": user_id, "email": user_email}, expires=access_token_expires
    )

    session_id = str(uuid.uuid4())

    # Internal Logging that is not implemented
    # log_user(user_id, user_email, user_name, user_pic, first_logged_in, last_accessed)
    # log_token(access_token, user_email, session_id)

    redirect_url = request.session.pop("login_redirect", "")
    response = RedirectResponse(redirect_url)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return response


def get_current_user(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: str = payload.get("sub")
        user_email: str = payload.get("email")

        if user_id is None or user_email is None:
            raise credentials_exception

        return {"user_id": user_id, "user_email": user_email}

    except ExpiredSignatureError:
        # Specifically handle expired tokens
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please login again.",
        )
    except JWTError:
        # Handle other JWT-related errors
        traceback.print_exc()
        raise credentials_exception
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=401, detail="Not Authenticated")


def validate_user_request(token: str = Cookie(None)):
    session_details = get_current_user(token)

    return session_details
