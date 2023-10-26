![Docker image build](https://github.com/MS-FSTLN/bday-bot-docker/actions/workflows/docker-image.yml/badge.svg)
# Birthday Bot

A bot that gets the birthday dates from users in a google calendar and sends them into twitch chat.

### Prerequisites

* Docker
  * Docker Compose plugin >= 2.11.1

## Pull from Docker Hub

```sh
docker pull msfstln/twitch-bday-bot:0.1.2
```

Proceed with Config

## Manual build

### Setup

Clone this repository

```sh
git clone https://github.com/MS-FSTLN/bday-bot-docker.git
```

Build the docker container image locally (example)
```sh
docker build -t your-user/twitch-bday-bot:0.0.5
```

### Config
Create docker-compose file
```sh
cp docker-compose.template.yml docker-compose.yml
```

Adjust the environment variables in the docker-compose file

Variable | Description
--- | ---
GOOGLE_CALENDAR_ID | Google calendar ID. It will look like this: vru0ugbqpqi0hhtrfo6bru5d28@group.calendar.google.com
BOT_USERNAME | The twitch username of the bot that will be used to send the messages.
TWITCH_OAUTH_TOKEN | Twitch OAuth token for the given BOT_USERNAME - can be obtained here: https://twitchapps.com/tmi/
TWITCH_CLIENT_ID | Twitch Client ID can be generated here: https://dev.twitch.tv/console/apps
TWITCH_CHANNELS | Comma separated list of channels to join. List must not contain spaces and has to be quoted in double quotes
LANG | Two-letter country code for messages. Must be defined in lang.js. Defaults to "de"
PREFIX | Prefix of trigger command. Defaults to "!", trigger commands are then "!geburtstag" and "!bday"
COOLDOWN | Cooldown of trigger commands in ms. Defaults to 30000 ms / 30 sec
TZ | Timezone to interpret dates. Default: UTC

If you want to customize the bot messages, edit them in lang.js and mount this file into the container /app/src/lang.js

### Running
After adjusting the settings in docker-compose.yml run your birthday bot
```sh
docker compose up -d
```
