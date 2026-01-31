defmodule Backend2.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :email, :string
    field :gh_username, :string
    field :lc_username, :string
    field :active, :boolean, default: true

    field :lc_rank, :integer
    field :easy_solved, :integer
    field :med_solved, :integer
    field :hard_solved, :integer

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :name,
      :email,
      :gh_username,
      :lc_username,
      :active,
      :lc_rank,
      :easy_solved,
      :med_solved,
      :hard_solved
    ])
    |> validate_required([
      :name,
      :email,
      :gh_username,
      :lc_username
    ])
  end
end
