import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

import matplotlib.pyplot as plt
from kneed import KneeLocator
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

data = {
    "Name": [],
    "Date": [],
    "Easy": [],
    "Medium": [],
    "Hard": [],
}

with open("./entries-backup.json") as file:
    RES = json.load(file)

entered = set()

for entry in RES[::-1]:
    if entry[1] in entered:
        break
    else:
        entered.add(entry[1])

    data["Name"].append(entry[1])
    data["Date"].append(entry[-1])

    data["Easy"].append(entry[3])
    data["Medium"].append(entry[4])
    data["Hard"].append(entry[5])


df = pd.DataFrame(data)
df = df[["Easy", "Medium"]]

sns.scatterplot(data=df, x="Easy", y="Medium")
plt.show()

# scaler = StandardScaler()
# scaled_features = scaler.fit_transform(df)

# kmeans = KMeans(init="random", n_clusters=3, n_init=10, max_iter=300, random_state=42)
# kmeans.fit(scaled_features)
