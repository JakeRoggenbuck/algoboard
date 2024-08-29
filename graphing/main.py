import json
import pandas as pd
import matplotlib.pyplot as plt

data = {
    "Name": [],
    "Date": [],
    "Score": [],
}

with open("./entries-backup.json") as file:
    RES = json.load(file)

for entry in RES:
    if entry[2] < 1_000_000:
        data["Name"].append(entry[1])
        data["Date"].append(entry[-1])
        data["Score"].append(entry[2])


df = pd.DataFrame(data)
df.set_index("Date", inplace=True)
df.groupby("Name")["Score"].plot(legend=True, xlabel="Date", ylabel="Score")
plt.show()
