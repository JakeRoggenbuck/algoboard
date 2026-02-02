import os
from dotenv import load_dotenv
from agentmail import AgentMail
import re
import kronicler


load_dotenv()
api_key = os.getenv("AGENTMAIL_API_KEY")
admin_email = os.getenv("ADMIN_EMAIL")

client = AgentMail(api_key=api_key)

inbox_id = 'gracefulbird586@agentmail.to'


def is_alnum_dash(s: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9-]+", s))


@kronicler.capture
def send_email_on_github_signup(user: str):
    if not is_alnum_dash(user):
        print("User input not sanitized")

    response = client.inboxes.messages.send(
        inbox_id=inbox_id,
        to=[admin_email],
        subject="New GitHub Sign Up!",
        text=f"The GitHub user '{user}' joined AlgoBoard!"
    )

    print(f"Email sent successfully! Message ID: {response.message_id}")


@kronicler.capture
def send_email_on_leetcode_connected(user: str, leetcode: str):
    if not is_alnum_dash(user):
        print("User input not sanitized")

    if not is_alnum_dash(leetcode):
        print("User input not sanitized")

    response = client.inboxes.messages.send(
        inbox_id=inbox_id,
        to=[admin_email],
        subject="New GitHub Sign Up!",
        text=f"The GitHub user '{user}' joined AlgoBoard with leetcode name '{leetcode}'!"
    )

    print(f"Email sent successfully! Message ID: {response.message_id}")
