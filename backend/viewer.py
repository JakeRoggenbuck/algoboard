import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import requests

res = requests.get("http://127.0.0.1:8000/entries")

data = res.json()

start_data = [
    [99991, 'hansonn', 470919, 64, 94, 13, '2024-02-12 20:02:36.785595'],
    [99992, '2003kevinle', 702659, 53, 62, 0, '2024-02-12 20:02:36.795578'],
    [99993, 'feliciafengg', 784868, 75, 26, 0, '2024-02-12 20:02:36.842753'],
    [99994, 'realchef', 891656, 63, 28, 0, '2024-02-12 20:02:36.712859'],
    [99995, 'normando', 939765, 43, 35, 3, '2024-02-12 20:02:36.813943'],
    [99996, 'AroopB', 1033796, 31, 39, 0, '2024-02-12 20:02:36.733985'],
    [99997, 'jakeroggenbuck', 1151340, 50, 8, 2, '2024-02-12 20:02:36.722913'],
    [99998, 'siddharthmmani', 1673868, 27, 6, 0, '2024-02-12 20:02:36.804582'],
    [99999, 'ahujaanish11', 1718014, 21, 11, 0, '2024-02-12 20:02:36.852473'],
    [100000, 'andchen1', 2425496, 13, 3, 0, '2024-02-12 20:02:36.833592'],
    [100001, 'atata6', 3114099, 12, 1, 0, '2024-02-12 20:02:36.869488'],
    [100002, 'vshl', 4476769, 3, 0, 0, '2024-02-12 20:02:36.824410'],
    [100003, 'AggieWorker', 5000001, 2, 0, 0, '2024-02-12 20:02:36.775176'],
    [100004, 'isabellovecandy', 5000001, 0, 0, 0, '2024-02-12 20:02:36.860291'],
]

data.extend(start_data)

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

df["total_problems"] = df["easy_problems"] + df["medium_problems"] + df["hard_problems"]
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
