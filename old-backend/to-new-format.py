import json

with open("aggieworks-swe-2-12-2024.2.json") as file:
    json_data = json.loads(file.read())

transformed_data = []
starting_id = 99991  # Starting ID based on the provided manual data example

for user in json_data:
    # Extracting the count of solved problems by difficulty
    count_easy = next(
        (
            item["count"]
            for item in user["solved"]["submitStatsGlobal"]["acSubmissionNum"]
            if item["difficulty"] == "Easy"
        ),
        0,
    )
    count_medium = next(
        (
            item["count"]
            for item in user["solved"]["submitStatsGlobal"]["acSubmissionNum"]
            if item["difficulty"] == "Medium"
        ),
        0,
    )
    count_hard = next(
        (
            item["count"]
            for item in user["solved"]["submitStatsGlobal"]["acSubmissionNum"]
            if item["difficulty"] == "Hard"
        ),
        0,
    )

    # Appending the transformed data
    transformed_data.append(
        [
            starting_id,
            user["name"],
            user["rank"],
            count_easy,
            count_medium,
            count_hard,
            user["date"],
        ]
    )

    starting_id += 1  # Incrementing ID for the next user

print(transformed_data)
