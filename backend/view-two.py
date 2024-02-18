import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
import json

data = []

with open("aggieworks-swe-2-18-2024.json") as file1:
    data1 = json.load(file1)
    data += data1

with open("aggieworks-swe-2-12-2024.3.json") as file2:
    data2 = json.load(file2)
    data += data2

# Convert input data to DataFrame for easier manipulation
df = pd.DataFrame(data)

# Extract and format date
df['date'] = pd.to_datetime(df['date'])

# Initialize a dictionary to hold the data for plotting
plot_data = {'Easy': {}, 'Medium': {}, 'Hard': {}}

# Populate plot_data with counts for each difficulty level for each user
for index, row in df.iterrows():
    name = row['name']
    date = row['date']
    for difficulty in ['Easy', 'Medium', 'Hard']:
        count = next(
            (
                item['count']
                for item in row['solved']['submitStatsGlobal']['acSubmissionNum']
                if item['difficulty'] == difficulty
            ),
            None,
        )
        if count is not None:  # Check if count exists to avoid NoneType errors
            if name not in plot_data[difficulty]:
                plot_data[difficulty][name] = []
            plot_data[difficulty][name].append((date, count))

colors = {'Easy': 'green', 'Medium': 'blue', 'Hard': 'red'}

# Plotting with actual values displayed on each dot
plt.figure(figsize=(15, 10))

for difficulty, users in plot_data.items():
    if difficulty == "Hard":
        for user, data_points in users.items():
            dates, counts = zip(*sorted(data_points))
            plt.plot(
                dates, counts, label=f'{user} - {difficulty}', marker='o'
            )
            for i, txt in enumerate(counts):
                plt.annotate(
                    txt, (dates[i], counts[i]), textcoords="offset points", xytext=(0, 5), ha='center'
                )

plt.xlabel('Date')
plt.ylabel('Problems Solved')
plt.title('Problems Solved Over Time by Difficulty with Values')
plt.xticks(rotation=45)
plt.legend(loc='upper left', bbox_to_anchor=(1, 1))
plt.tight_layout()

plt.show()
