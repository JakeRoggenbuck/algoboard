import json
import pandas as pd
import matplotlib.pyplot as plt

data = {
    "Name": [],
    "Date": [],
    "Score": [],
    "Easy": [],
    "Med": [],
    "Hard": [],
}

with open("./backup-everyone.json") as file:
    RES = json.load(file)

for entry in RES:
    if entry[1] == "realchef":
        data["Name"].append(entry[1])
        data["Date"].append(entry[-1])
        data["Score"].append(entry[2])
        data["Easy"].append(entry[3])
        data["Med"].append(entry[4])
        data["Hard"].append(entry[5])


df = pd.DataFrame(data)
df.set_index("Date", inplace=True)

df.index = pd.to_datetime(df.index)
fig, ax1 = plt.subplots(figsize=(10, 6))

ax1.plot(df.index, df["Score"], label="Score", color='blue', marker="o")
ax1.set_xlabel("Date")
ax1.set_ylabel("Score", color='blue')
ax1.tick_params(axis='y', labelcolor='blue')

ax2 = ax1.twinx()
ax2.plot(df.index, df["Easy"], label="Easy", color='green', marker="s")
ax2.set_ylabel("Easy", color='green')
ax2.tick_params(axis='y', labelcolor='green')

ax3 = ax1.twinx()
ax3.spines['right'].set_position(('outward', 60))
ax3.plot(df.index, df["Med"], label="Medium", color='red', marker="^")
ax3.set_ylabel("Medium", color='red')
ax3.tick_params(axis='y', labelcolor='red')

ax4 = ax1.twinx()
ax4.spines['right'].set_position(('outward', 120))
ax4.plot(df.index, df["Hard"], label="Hard", color='purple', marker="x")
ax4.set_ylabel("Hard", color='purple')
ax4.tick_params(axis='y', labelcolor='purple')

plt.title("Score and Difficulty Levels Over Time (Independent Scales)")

fig.tight_layout()
plt.show()
