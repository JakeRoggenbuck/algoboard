defmodule Backend2.Repo.Migrations.CreateBoardsAndBoardsUsers do
  use Ecto.Migration

  def change do
    create table(:boards) do
      add :name, :string, null: false
      add :url, :string, null: false
      add :participant_num, :integer, null: false
      add :active, :boolean, default: true, null: false

      timestamps()
    end

    create table(:boards_users, primary_key: false) do
      add :board_id, references(:boards, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
    end

    create unique_index(:boards_users, [:board_id, :user_id])
  end
end
