# Backend2

This is an Elixir rewrite of the AlgoBoard backend.

I created this with the following command:

```sh
mix phx.new --no-html --no-assets --no-dashboard --no-live --no-mailer --database sqlite3 backend2
```

This removes the majority of the extra features and makes the database use sqlite3.

## Important Files

Like any Elixir project, you need a `mix.exs` file.

Phoenix has a config directory 'config' that contains a bunch of configuration files. This is similar to how Django has a directory with similar settings. It's likely I won't need to edit or add to these files.

It looks like the config sets up a prod, test, and dev database. The test and dev database have the config hard-coded, but the prod database uses the runtime.exs file to get all the info from the environment vars.

The `lib` directory contains `backend2` and `backend2_web` directories as well as two `.ex` files with the same names. The `.ex` files describe themselves as `backend2.ex` for business logic and `backend2_web.ex` for defining the web interface. That's all reasonable, and usually how I end up structuring a FastAPI project anyway. This is rather similar to Django.

Inside the `backend2` there is a file called `application.ex` and it's rather confusing. There is something about a DNSCluster and a supervisor, etc.

The `backend2_web` directory is no more simple. It includes a `controllers` folder, an `endpoint.ex`, which defines a `signing_salt`, which seems a little extra, or at least in the wrong place. The `router.ex` is what you'd expect. There is also a `telemetry.ex`, which does metrics, and a `gettext.ex` which does internationalization, which seems pretty extra for a basic API.

There is a `test` folder that contains tests and utils to connect to the database.

It seems like some of learning how to use Phoenix will be learning how this structure is meant to work together. I'll likely have to do some reading about what goes where, and why certain design decisions were made. Seems very reasonable though, and similar to Django or Rails.

## Running

To start the Phoenix server:

  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.
