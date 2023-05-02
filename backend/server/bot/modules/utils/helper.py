import csv
import os
import pathlib
import random
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import pandas as pd
import requests
from bs4 import BeautifulSoup

from .config import config
from .logger import logger


def is_float(num):
    try:
        float(num)
        return True
    except ValueError:
        return False


def make_csv(list_: list[any], output) -> None:
    df = pd.DataFrame.from_records(vars(o) for o in list_)
    df.fillna(value="None", inplace=True)
    df.to_csv(path_or_buf=output, sep=",", index=False, quoting=csv.QUOTE_MINIMAL)
    logger.info("Dumped data to CSV.")


USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; Trident/7.0; AS; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; AS; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/B08C390E",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.888",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Vivaldi/1.8.770.50",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Whale/0.7.14.16",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Sleipnir/6.2.12",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 ArcBrower/42.0.2311.135",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.881",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.898",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.888",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Vivaldi/1.8.770.56",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Whale/0.7.19.6",
]


def make_soup(url: str, timeout: int = 10) -> BeautifulSoup:
    user_agent = random.choice(USER_AGENTS)
    headers = {"User-Agent": user_agent}

    logger.info(f"Made request to {url} with user-agent {user_agent}")

    res = requests.get(url, headers=headers, timeout=timeout)
    if res.status_code != 200:
        raise Exception(f"Failed to get data while making request: {res.status_code}")
    return BeautifulSoup(res.text, "html.parser")


# def send_mail(keywords: list[str]):
#     smtp_server = config.get("MAIL", "SMTP_SERVER")
#     smtp_port = config.getint("MAIL", "SMTP_PORT")

#     sender_email = config.get("MAIL", "SENDER_EMAIL")
#     sender_pwd = config.get("MAIL", "SENDER_PASSWORD")
#     receiver_email = config.get("MAIL", "RECEIVER_EMAIL")

#     subject = f'Update on Price List for keywords {" ".join(keywords)}'
#     body = (
#         "<h1>This is a test email sent from a Python script.</h1>"
#         "<p>It contains <strong>HTML content</strong> and an <em>attachment</em>.</p>"
#     )

#     msg = MIMEMultipart()
#     msg["From"] = sender_email
#     msg["To"] = receiver_email
#     msg["Subject"] = subject

#     msg.attach(MIMEText(body, "html"))

#     attachment_path = "output.csv"
#     attachment_filename = os.path.basename(attachment_path)

#     with open(attachment_path, "rb") as file:
#         attachment = MIMEApplication(file.read(), _subtype="csv")
#         attachment.add_header(
#             "Content-Disposition", "attachment", filename=attachment_filename
#         )
#         msg.attach(attachment)

#     # Send email
#     with smtplib.SMTP(smtp_server, smtp_port) as server:
#         server.starttls()
#         server.login(sender_email, sender_pwd)
#         server.send_message(msg)

#     logger.info("Mail sent with attachment.")
