defmodule Backend2.Session do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, only: [where: 2]

  @derive {Jason.Encoder, only: [:id, :user_id, :inserted_at, :updated_at]}
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

  def create_session(attrs) do
    %__MODULE__{}
    |> __MODULE__.changeset(attrs)
    |> Backend2.Repo.insert()
  end

  def list_sessions(user_id) do
    __MODULE__
    |> where(user_id: ^user_id)
    |> Backend2.Repo.all()
  end
end
