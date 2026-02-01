defmodule Backend2Web.Router do
  use Backend2Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Backend2Web do
    pipe_through :api

    get "/sessions", SessionController, :index
    get "/boards", BoardController, :index
  end
end
