defmodule Backend2Web.BoardController do
  use Backend2Web, :controller

  def index(conn, _params) do
    boards = Backend2.Repo.all(Backend2.Board)
    json(conn, boards)
  end
end
