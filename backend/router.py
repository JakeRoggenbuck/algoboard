from fastapi import FastAPI
from communicator import pull_full_page, get_json_data, get_rank

app = FastAPI()


@app.get("/leaterboard/{board_id}")
def get_leaterboard(board_id: str):
    # TODO: database call for who is in this board - given the board_id
    users_in_board = [{"name": "jakeroggenbuck"}]

    for user in users_in_board:
        page = pull_full_page(user["name"])
        json_data = get_json_data(page)

        rank = get_rank(json_data)

        user["rank"] = rank

    return users_in_board
