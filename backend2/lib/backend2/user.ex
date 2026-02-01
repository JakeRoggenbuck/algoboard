defmodule Backend2.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    many_to_many :boards, Backend2.Board, join_through: "boards_users"
    has_many :activities, Backend2.Activity
    has_many :sessions, Backend2.Session

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

  def linear_weight(%__MODULE__{} = user) do
    (user.easy_solved) + 2 * (user.med_solved) + 3 * (user.hard_solved)
  end

  def create_user(attrs) do
    %__MODULE__{}
    |> __MODULE__.changeset(attrs)
    |> Backend2.Repo.insert()
  end

  def update_user(%__MODULE__{} = user, attrs) do
    user
    |> __MODULE__.changeset(attrs)
    |> Backend2.Repo.update()
  end
end
