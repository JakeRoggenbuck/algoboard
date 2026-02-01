defmodule Backend2.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false

      add :gh_username, :string
      add :lc_username, :string

      add :active, :boolean, default: true, null: false

      add :lc_rank, :integer
      add :easy_solved, :integer
      add :med_solved, :integer
      add :hard_solved, :integer

      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:gh_username])
    create unique_index(:users, [:lc_username])
  end
end
