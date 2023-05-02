# Configuration

## Bot

```
path to config: ./backend/bot/config.ini
```

```
MAX_SLEEP_BETWEEN_PAGES=2 -> the delay between retrieving between multiple pages, time in seconds

MAX_PAGES=20 -> maximum number of pages to search for, add sufficient max_pages, so that we don't get outliers, max is 167, this parameter increases the scraping time proportionally
```

## Server

```
path to config: ./backend/server/.env
```

```
PORT=3000 -> port to run the server
SLEEP_TIME_SECONDS=1800 -> max delay between subsequent scrapes
SENDER_EMAIL=sender@gmail.com -> sender mail
SENDER_PASSWORD=SENDER_APP_PASSWORD -> sender's google app password
RECEIVER_EMAILS=receiver1@email.com,receiver2@email.com -> multiple receivers separated with commas
```

Get the password for the sender from [https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiOpPWO4s_-AhXFk1YBHdU0B0MQFnoECA4QAQ&url=https%3A%2F%2Fmyaccount.google.com%2Fapppasswords&usg=AOvVaw1rVibBR6kQTiUjqa0l_f8W].

Select the app as Mail, and click generate. Copy the password to the sender password

# Running

## Server

```
cd backend/server && yarn run start
```

## Web

```
cd ./web && yarn run start
```
