import json
import pandas as pd
from datetime import datetime
from os import listdir
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

from communicator import get_json_data


def generate_list(data):
    # Assuming `data` is the Python dictionary containing the JSON data you've posted
    user_calendar_data = data['props']['pageProps']['dehydratedState']['queries']

    # Initialize an empty dictionary for the user calendar
    user_calendar = {}

    # Search through the queries to find the one that contains the userCalendar information
    for query in user_calendar_data:
        if (
            'matchedUser' in query['state']['data']
            and 'userCalendar' in query['state']['data']['matchedUser']
        ):
            user_calendar = query['state']['data']['matchedUser']['userCalendar']
            break

    # Now, assuming the user_calendar['submissionCalendar'] is a JSON string that looks like a dictionary
    # Convert the string to a dictionary
    submission_calendar_dict = json.loads(user_calendar.get('submissionCalendar', '{}'))

    # Prepare a list to hold the date and number of problems solved
    solved_problems_per_day = []

    # Convert timestamps to readable dates and store them in the list
    for timestamp, count in submission_calendar_dict.items():
        # Convert timestamp (string) to integer, then to a date
        date = datetime.utcfromtimestamp(int(timestamp)).strftime('%Y-%m-%d')
        solved_problems_per_day.append((date, count))

    return solved_problems_per_day

    # # Print the list of solved problems per day
    # for date, count in solved_problems_per_day:
    #     print(f"Date: {date}, Problems Solved: {count}")


all_rows_data = []

for datafile in listdir("./users_cache"):
    all_data = []

    with open("./users_cache/" + datafile) as file:

        data = get_json_data(file.read())

        out = generate_list(data)
        all_data.append({"name": datafile, "data": out})

    text = ""

    for x in all_data:
        for y in x["data"]:
            row = [x['name'], y[0], y[1]]
            all_rows_data.append(row)

df = pd.DataFrame(all_rows_data, columns=['User', 'Date', 'ProblemsSolved'])

# Convert 'Date' column to datetime type
df['Date'] = pd.to_datetime(df['Date'])

# Convert 'ProblemsSolved' column to integer type
df['ProblemsSolved'] = df['ProblemsSolved'].astype(int)

df = df[df['Date'] >= pd.Timestamp(year=df['Date'].dt.year.min(), month=10, day=1)]

df = df.groupby('Date')['ProblemsSolved'].sum().reset_index()

df['CumulativeProblemsSolved'] = df['ProblemsSolved'].cumsum()

df['5DayAvgProblemsSolved'] = df['ProblemsSolved'].rolling(window=5).mean()

df['DateNumeric'] = pd.to_datetime(df['Date']).map(pd.Timestamp.toordinal)

df['YearMonth'] = df['Date'].dt.to_period('M')

# Calculate coefficients for the line of best fit for 'ProblemsSolved'
coefficients_ps = np.polyfit(df['DateNumeric'], df['ProblemsSolved'], 1)
polynomial_ps = np.poly1d(coefficients_ps)

# Calculate coefficients for the line of best fit for '5DayAvgProblemsSolved'
coefficients_5d = np.polyfit(df.dropna()['DateNumeric'], df.dropna()['5DayAvgProblemsSolved'], 1)
polynomial_5d = np.poly1d(coefficients_5d)

# Plot the original data and the lines of best fit
plt.figure(figsize=(12, 6))

# Original problems solved line plot
sns.lineplot(data=df, x='Date', y='ProblemsSolved', marker='o', label='Problems Solved')

# 5-day average problems solved line plot
sns.lineplot(data=df, x='Date', y='5DayAvgProblemsSolved', marker='o', label='5-Day Average')

# Add lines of best fit
plt.plot(df['Date'], polynomial_ps(df['DateNumeric']), color='blue', linestyle='--', label='Best Fit: Problems Solved')
plt.plot(df['Date'], polynomial_5d(df['DateNumeric']), color='orange', linestyle='--', label='Best Fit: 5-Day Avg')

plt.figure(figsize=(14, 8))

# Plot the original data
sns.lineplot(data=df, x='Date', y='ProblemsSolved', marker='o', label='Problems Solved')
sns.lineplot(data=df, x='Date', y='5DayAvgProblemsSolved', marker='o', label='5-Day Avg')

def to_bimonthly_period(date):
    year = date.year
    # Define bimonthly periods: Jan-Feb, Mar-Apr, May-Jun, etc.
    bimonth = ((date.month - 1) // 2) * 2 + 1
    return f"{year}-{bimonth:02d}"

# Apply the function to create a 'Bimonthly' column
df['Bimonthly'] = df['Date'].apply(to_bimonthly_period)


# Group by 'YearMonth' and calculate + plot line of best fit for each group
for name, group in df.groupby('YearMonth'):
    # Convert dates to numeric for polyfit
    group['DateNumeric'] = group['Date'].map(pd.Timestamp.toordinal)
    # Calculate line of best fit
    coefficients = np.polyfit(group['DateNumeric'], group['ProblemsSolved'], 1)
    poly = np.poly1d(coefficients)
    # Plot
    plt.plot(group['Date'], poly(group['DateNumeric']), linestyle='--', label=f'Best Fit: {name}')

plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.xticks(rotation=45)
plt.title('Monthly Lines of Best Fit for Problems Solved')
plt.xlabel('Date')
plt.ylabel('Problems Solved')
plt.tight_layout()
plt.show()

plt.figure(figsize=(14, 8))

# Original data plots
sns.lineplot(data=df, x='Date', y='ProblemsSolved', marker='o', label='Problems Solved')
sns.lineplot(data=df, x='Date', y='5DayAvgProblemsSolved', marker='o', label='5-Day Avg')

# Loop through each bimonthly group
for name, group in df.groupby('Bimonthly'):
    # Convert dates to numeric for polyfit
    group['DateNumeric'] = group['Date'].map(pd.Timestamp.toordinal)
    # Calculate line of best fit
    coefficients = np.polyfit(group['DateNumeric'], group['ProblemsSolved'], 1)
    poly = np.poly1d(coefficients)
    # Plot each line
    plt.plot(group['Date'], poly(group['DateNumeric']), linestyle='--', label=f'Best Fit: {name}')

# Adjust legend and plot settings
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', title="Bimonthly Period")
plt.xticks(rotation=45)
plt.title('Bimonthly Lines of Best Fit for Problems Solved')
plt.xlabel('Date')
plt.ylabel('Problems Solved')
plt.tight_layout()
plt.show()

plt.figure(figsize=(14, 8))

# Original data plots
sns.lineplot(data=df, x='Date', y='ProblemsSolved', marker='o', label='Problems Solved')
sns.lineplot(data=df, x='Date', y='5DayAvgProblemsSolved', marker='o', label='5-Day Avg')

# Loop through each bimonthly group
for name, group in df.groupby('Bimonthly'):
    # Convert dates to numeric for polyfit
    group['DateNumeric'] = group['Date'].map(pd.Timestamp.toordinal)
    # Calculate line of best fit
    coefficients = np.polyfit(group['DateNumeric'], group['ProblemsSolved'], 1)
    poly = np.poly1d(coefficients)
    # Plot each line
    line, = plt.plot(group['Date'], poly(group['DateNumeric']), linestyle='--', label=f'Best Fit: {name}')

    # Annotation for the slope
    slope = f"Slope: {coefficients[0]:.2f}"
    # Get the midpoint of the time period for positioning the annotation
    midpoint_index = len(group) // 2
    midpoint_date = group.iloc[midpoint_index]['Date']
    midpoint_value = poly(group.iloc[midpoint_index]['DateNumeric'])
    plt.annotate(slope, xy=(midpoint_date, midpoint_value), xytext=(10, 5),
                 textcoords='offset points', color=line.get_color(), fontsize=9, rotation=45)

# Adjust legend and plot settings
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', title="Bimonthly Period")
plt.xticks(rotation=45)
plt.title('Bimonthly Lines of Best Fit for Problems Solved with Slopes')
plt.xlabel('Date')
plt.ylabel('Problems Solved')
plt.tight_layout()
plt.show()

