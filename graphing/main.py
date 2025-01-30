import json
import pandas as pd
import matplotlib.pyplot as plt

data = {
    "Name": [],
    "Date": [],
    "Score": [],
    "Easy": [],
    "Medium": [],
    "Hard": [],
}

with open("./all_data.json") as file:
    RES = json.load(file)

for entry in RES:
    if entry[2] < 5_000_000:
        data["Name"].append(entry[1])
        data["Date"].append(entry[-1])
        data["Score"].append(entry[2])
        data["Easy"].append(entry[3])
        data["Medium"].append(entry[4])
        data["Hard"].append(entry[5])


df = pd.DataFrame(data)
df.set_index("Date", inplace=True)
df.groupby("Name")["Easy"].plot(legend=True, xlabel="Date", ylabel="Easy")
plt.show()
