defmodule Backend2.Activity do
  use Ecto.Schema
  import Ecto.Changeset

  schema "activities" do
    belongs_to :user, Backend2.User

    field :lc_rank, :integer
    field :easy_solved, :integer
    field :med_solved, :integer
    field :hard_solved, :integer
    timestamps()
  end

  def changeset(activity, attrs) do
    activity
    |> cast(
      attrs,
      [:user_id, :lc_rank, :easy_solved, :med_solved, :hard_solved]
    )
    |> validate_required([:user_id])
  end
end
