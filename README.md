# AlgoBoard - [algoboard.org](https://algoboard.org)

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=typescript)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=python&sort=stargazers)

## About

🏆 Algo Board is a website to promote friendly competition for solving algorithmic coding problems. Algo Board lets you host weekly / monthly competitions for your fiends, clubs, and other organizations. 

## Why

There are a few reasons I work on this project:

1. The primary goal is to help friends and myself improve at programming problems. I've gone from ~10 problems solved to >600 problems solved since I built this website. This website was the main way I encouraged myself to continue learning.
2. The secondary reason is that it's really useful to have a website I can test stuff out with. I've tested different auth methods, different database designs, different deployment setups, and more. Having a website with actual data that is already hosted is a great way for me to put my ideas into practice and have a "sandbox" of sorts that I can modify at any time.

## Preview

### Home Page

![image](https://github.com/user-attachments/assets/0bc4f5f4-9618-4af6-82f6-0f000ea17336)

### Board View

<img width="1904" height="944" alt="image" src="https://github.com/user-attachments/assets/b505e058-831a-4153-93af-e3fb13cf13b3" />

## Development

### Backend

The [backend](https://github.com/JakeRoggenbuck/algoboard/tree/main/backend) is built using [FastAPI](https://fastapi.tiangolo.com/) and [Python](https://docs.python.org/3/).

#### Environment Vars

You will need a [`.env`](https://github.com/JakeRoggenbuck/algoboard/blob/main/backend/example.env) file in the backend directory that at least defines these values. These aren't yet used for Google OAuth.

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SECRET_KEY=
REDIRECT_URL=
JWT_SECRET_KEY=
FASTAPI_SECRET_KEY=
FRONTEND_URL=
```

#### Python Virtual Environment

Create the virtual environment

```py
python3 -m venv .venv
```

Enter the virtual environment

```
source .venv/bin/activate
```

I usually call my virtual environment either `.venv` or more frequently just `venv`

Install dependencies with:

```
pip install -r requirements.txt
```

#### Formatting for Python

Kronicler uses [Ruff](https://github.com/astral-sh/ruff) for formatting.

You can format all Python files with:

```
ruff format *.py
```

You can also check that they have the right format with:

```
ruff check *.py
```

### Frontend

The [frontend](https://github.com/JakeRoggenbuck/algoboard/tree/main/frontend) is built using [React](https://react.dev/learn) and [TypeScript](https://www.typescriptlang.org/).

##### Install

```sh
npm install
```

##### Run

```sh
npm run start
```
