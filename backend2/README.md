# Backend2

This is an Elixir rewrite of the AlgoBoard backend.

I created this with the following command:

```sh
mix phx.new --no-html --no-assets --no-dashboard --no-live --no-mailer --database sqlite3 backend2
```

This removes the majority of the extra features and makes the database use sqlite3.

## Roadmap

- [x] Create data models for User, Board, Activity (Prev. `user_rank`), and the relations between them

## Important Files

Like any Elixir project, you need a `mix.exs` file.

Phoenix has a config directory 'config' that contains a bunch of configuration files. This is similar to how Django has a directory with similar settings. It's likely I won't need to edit or add to these files.

It looks like the config sets up a prod, test, and dev database. The test and dev database have the config hard-coded, but the prod database uses the runtime.exs file to get all the info from the environment vars.

The `lib` directory contains `backend2` and `backend2_web` directories as well as two `.ex` files with the same names. The `.ex` files describe themselves as `backend2.ex` for business logic and `backend2_web.ex` for defining the web interface. That's all reasonable, and usually how I end up structuring a FastAPI project anyway. This is rather similar to Django.

Inside the `backend2` there is a file called `application.ex` and it's rather confusing. There is something about a DNSCluster and a supervisor, etc.

The `backend2_web` directory is no more simple. It includes a `controllers` folder, an `endpoint.ex`, which defines a `signing_salt`, which seems a little extra, or at least in the wrong place. The `router.ex` is what you'd expect. There is also a `telemetry.ex`, which does metrics, and a `gettext.ex` which does internationalization, which seems pretty extra for a basic API.

There is a `test` folder that contains tests and utils to connect to the database.

It seems like some of learning how to use Phoenix will be learning how this structure is meant to work together. I'll likely have to do some reading about what goes where, and why certain design decisions were made. Seems very reasonable though, and similar to Django or Rails.

## Learnings

Using the bang `!` will throw an error if you return the error atom.

```elixir
Backend2.Repo.get!(board_id)
```

I made a Controller that can be added to the router. The Controller uses the Session model.

```elixir
defmodule Backend2Web.SessionController do
  use Backend2Web, :controller

  def index(conn, _params) do
    sessions = Backend2.Repo.all(Backend2.Session)
    json(conn, sessions)
  end
end
```

This is how I added the Controller to the router.

```elixir
# ...
  scope "/api", Backend2Web do
    pipe_through :api

    get "/sessions", SessionController, :index
  end
# ...
```

This is the modal for Session.

```
defmodule Backend2.Session do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, only: [where: 2]

  @derive {Jason.Encoder, only: [:id, :user_id, :inserted_at, :updated_at]}
  schema "sessions" do
    belongs_to :user, Backend2.User

    timestamps()
  end

  # ...
end
```

This is what is needed to read the Sessions from the API. This is pretty similar to Django and how they do MVC. The data model is the Model, the router that sets the API path is the view, and the controller is obviously the controller.

When I made the model, I needed to manually create a migration file and run it.

```sh
mix ecto.gen.migration create_sessions
```

This makes a file called `priv/repo/migrations/20260201032719_create_sessions.exs` that's basically empty.

At the start, the change function is empty.

```elixir
defmodule Backend2.Repo.Migrations.CreateSessions do
  use Ecto.Migration

  def change do
    create table(:sessions) do
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:sessions, [:user_id])
  end
end
```

We add the line:

```diff
+ add :user_id, references(:users, on_delete: :delete_all), null: false
```

We also make an index:

```diff
+ create index(:sessions, [:user_id])
```

We can then run the migration with:

```sh
mix ecto.migrate
```

It's interesting to make this migration process manual, but it does make me more conscience of how the data is changing.

## Running

To start the Phoenix server:

  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.
