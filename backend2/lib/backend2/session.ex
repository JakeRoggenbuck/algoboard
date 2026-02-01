defmodule Backend2.Session do
  use Ecto.Schema
  import Ecto.Changeset

  schema "sessions" do
    belongs_to :user, Backend2.User

    timestamps()
  end

  def changeset(activity, attrs) do
    activity
    |> cast(
      attrs,
      [:user_id]
    )
    |> validate_required([:user_id])
  end
end
