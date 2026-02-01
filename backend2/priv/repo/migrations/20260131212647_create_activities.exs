defmodule Backend2.Repo.Migrations.CreateActivities do
  use Ecto.Migration

  def change do
    create table(:activities) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :lc_rank, :integer
      add :easy_solved, :integer
      add :med_solved, :integer
      add :hard_solved, :integer

      timestamps()
    end

    create index(:activities, [:user_id])
  end
end
