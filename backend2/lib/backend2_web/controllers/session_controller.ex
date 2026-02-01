defmodule Backend2Web.SessionController do
  use Backend2Web, :controller

  def index(conn, _params) do
    sessions = Backend2.Repo.all(Backend2.Session)
    json(conn, sessions)
  end
end
