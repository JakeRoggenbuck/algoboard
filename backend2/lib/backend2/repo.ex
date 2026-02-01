defmodule Backend2.Repo do
  use Ecto.Repo,
    otp_app: :backend2,
    adapter: Ecto.Adapters.SQLite3
end
