import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import requests

res = requests.get("http://127.0.0.1:8000/entries")

data = res.json()


columns = [
    "id",
    "name",
    "rank",
    "easy_problems",
    "medium_problems",
    "hard_problems",
    "date",
]

df = pd.DataFrame(data, columns=columns)

df["total_problems"] = df["easy_problems"] + df["medium_problems"] + df["hard_problems"])
cumulative_df = df.groupby(["name", "date"]).agg({"total_problems": "sum"}).reset_index()

df["date"] = pd.to_datetime(df["date"])

df.sort_values(by=["name", "date"], inplace=True)

plt.figure(figsize=(14, 8))
sns.lineplot(data=df, x="date", y="total_problems", hue="name", marker="o", linewidth=2.5)

for i, point in df.iterrows():
    plt.text(
        point["date"],
        point["total_problems"] + 0.5,
        str(point["total_problems"]),
        horizontalalignment="center",
    )

plt.title("Cumulative Problems Solved Over Time Per Person")
plt.xlabel("Date")
plt.ylabel("Total Problems Solved")
plt.legend(title="Person")
plt.grid(True)
plt.tight_layout()
plt.show()
