import json
from datetime import datetime

with open("output_full.json") as file:
    data = json.load(file)


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

# Print the list of solved problems per day
for date, count in solved_problems_per_day:
    print(f"Date: {date}, Problems Solved: {count}")
