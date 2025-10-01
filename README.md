# AlgoBoard - [algoboard.org](https://algoboard.org)

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
