defmodule Backend2.Board do
  use Ecto.Schema
  import Ecto.Changeset

  schema "boards" do
    field :name, :string
    field :url, :string
    field :participant_num, :integer
    field :active, :boolean, default: true

    many_to_many :users, Backend2.User, join_through: "boards_users"

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :name,
      :url,
      :participant_num,
      :active
    ])
    |> validate_required([
      :name,
      :url,
      :participant_num,
      :active
    ])
  end
end
