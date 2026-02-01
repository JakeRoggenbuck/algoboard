defmodule Backend2Web.BoardController do
  use Backend2Web, :controller

  def index(conn, _params) do
    boards = Backend2.Repo.all(Backend2.Board)
    json(conn, boards)
  end

  def users(conn, %{"id" => board_id}) do
    users =
      board_id
      |> Backend2.Board.fetch_users()
      |> Enum.map(&serialize_user/1)

    json(conn, users)
  end

  defp serialize_user(user) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      gh_username: user.gh_username,
      lc_username: user.lc_username,
      active: user.active,
      lc_rank: user.lc_rank,
      easy_solved: user.easy_solved,
      med_solved: user.med_solved,
      hard_solved: user.hard_solved,
      inserted_at: user.inserted_at,
      updated_at: user.updated_at
    }
  end
end
