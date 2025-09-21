import matplotlib.pyplot as plt
import sys
import json

day_1 = [
    [{"name": "hansonn", "rank": 487992}],
    [{"name": "2003kevinle", "rank": 695473}],
    [{"name": "normando", "rank": 930133}],
    [{"name": "realchef", "rank": 940604}],
    [{"name": "AroopB", "rank": 1023186}],
    [{"name": "jakeroggenbuck", "rank": 1152577}],
    [{"name": "siddharthmmani", "rank": 1780334}],
    [{"name": "AggieWorker", "rank": 5000001}],
    [{"name": "vshl", "rank": 5000001}],
]

day_2 = [
    [{"name": "hansonn", "rank": 483485}],
    [{"name": "2003kevinle", "rank": 698162}],
    [{"name": "normando", "rank": 933785}],
    [{"name": "realchef", "rank": 944315}],
    [{"name": "AroopB", "rank": 1027170}],
    [{"name": "jakeroggenbuck", "rank": 1156965}],
    [{"name": "siddharthmmani", "rank": 1754036}],
    [{"name": "andchen1", "rank": 2409262}],
    [{"name": "AggieWorker", "rank": 5000001}],
    [{"name": "vshl", "rank": 5000001}],
]

day_3 = [
    [{"name": "hansonn", "rank": 483954}],
    [{"name": "2003kevinle", "rank": 698866}],
    [{"name": "feliciafengg", "rank": 780801}],
    [{"name": "normando", "rank": 934713}],
    [{"name": "realchef", "rank": 945230}],
    [{"name": "AroopB", "rank": 1028263}],
    [{"name": "jakeroggenbuck", "rank": 1158145}],
    [{"name": "ahujaanish11", "rank": 1707928}],
    [{"name": "siddharthmmani", "rank": 1723520}],
    [{"name": "andchen1", "rank": 2411943}],
    [{"name": "AggieWorker", "rank": 5000001}],
    [{"name": "vshl", "rank": 5000001}],
    [{"name": "isabellovecandy", "rank": 5000001}],
]

day_4 = [
    [{"name": "hansonn", "rank": 468903}],
    [{"name": "2003kevinle", "rank": 699562}],
    [{"name": "feliciafengg", "rank": 781543}],
    [{"name": "normando", "rank": 935622}],
    [{"name": "realchef", "rank": 946183}],
    [{"name": "AroopB", "rank": 1029284}],
    [{"name": "jakeroggenbuck", "rank": 1159420}],
    [{"name": "siddharthmmani", "rank": 1695172}],
    [{"name": "ahujaanish11", "rank": 1709850}],
    [{"name": "andchen1", "rank": 2414489}],
    [{"name": "atata6", "rank": 3410049}],
    [{"name": "vshl", "rank": 4457967}],
    [{"name": "AggieWorker", "rank": 5000001}],
    [{"name": "isabellovecandy", "rank": 5000001}],
]

day_5 = [
    [{"name": "hansonn", "rank": 470521}],
    [{"name": "2003kevinle", "rank": 702102}],
    [{"name": "feliciafengg", "rank": 784216}],
    [{"name": "realchef", "rank": 890857}],
    [{"name": "normando", "rank": 938925}],
    [{"name": "AroopB", "rank": 1032922}],
    [{"name": "jakeroggenbuck", "rank": 1150301}],
    [{"name": "siddharthmmani", "rank": 1672312}],
    [{"name": "ahujaanish11", "rank": 1716431}],
    [{"name": "andchen1", "rank": 2423360}],
    [{"name": "atata6", "rank": 3111447}],
    [{"name": "vshl", "rank": 4473256}],
    [{"name": "AggieWorker", "rank": 5000001}],
    [{"name": "isabellovecandy", "rank": 5000001}],
]

day_6 = [
    [{"name": "hansonn", "rank": 470919, "date": "2024-02-12 19:19:52.869711"}],
    [{"name": "2003kevinle", "rank": 702659, "date": "2024-02-12 19:19:52.879316"}],
    [{"name": "feliciafengg", "rank": 784868, "date": "2024-02-12 19:19:52.923800"}],
    [{"name": "realchef", "rank": 891656, "date": "2024-02-12 19:19:52.798046"}],
    [{"name": "normando", "rank": 939765, "date": "2024-02-12 19:19:52.896724"}],
    [{"name": "AroopB", "rank": 1033796, "date": "2024-02-12 19:19:52.850945"}],
    [{"name": "jakeroggenbuck", "rank": 1151340, "date": "2024-02-12 19:19:52.807235"}],
    [{"name": "siddharthmmani", "rank": 1673868, "date": "2024-02-12 19:19:52.887658"}],
    [{"name": "ahujaanish11", "rank": 1718014, "date": "2024-02-12 19:19:52.933749"}],
    [{"name": "andchen1", "rank": 2425496, "date": "2024-02-12 19:19:52.914964"}],
    [{"name": "atata6", "rank": 3114099, "date": "2024-02-12 19:19:52.950097"}],
    [{"name": "vshl", "rank": 4476769, "date": "2024-02-12 19:19:52.906337"}],
    [{"name": "AggieWorker", "rank": 5000001, "date": "2024-02-12 19:19:52.859786"}],
    [
        {
            "name": "isabellovecandy",
            "rank": 5000001,
            "date": "2024-02-12 19:19:52.941459",
        }
    ],
]

with open("./aggieworks-swe-2-13-2024.json") as file:
    day_7 = [[x] for x in json.load(file)]

with open("./aggieworks-swe-2-21-2024.json") as file:
    day_8 = [[x] for x in json.load(file)]

with open("./aggieworks-swe-2-22-2024.json") as file:
    day_9 = [[x] for x in json.load(file)]


data = [*day_1, *day_2, *day_3, *day_4, *day_5, *day_6, *day_7, *day_8, *day_9]

names = set([item["name"] for sublist in data for item in sublist])
ranks = {name: [] for name in names}

for sublist in data:
    for item in sublist:
        ranks[item["name"]].append(item["rank"])

diffs = {}

for k, v in ranks.items():
    min_val, max_val = sys.maxsize, -1

    for val in v:
        if val < min_val:
            min_val = val
        if val > max_val:
            max_val = val

    diffs[k] = {
        "by_val": {"min": min_val, "max": max_val, "diff": max_val - min_val},
        "by_time": {"min": v[0], "max": v[-1], "diff": v[-1] - v[0]},
    }

for d, val in diffs.items():
    print(d, ",\t", val["by_time"]["diff"], ",\t", val["by_val"]["diff"])

plt.figure(figsize=(10, 6))
for name, rank in ranks.items():
    plt.plot(rank, label=name, marker="o")

plt.xlabel("Time")
plt.ylabel("Rank")
plt.title("Rank change")
plt.legend()
plt.show()
