# Geburtstags Bot

A bot that gets the birthday dates from users in a google calendar.

### Prerequisites

* Node.js version 16.0.0 or higher is required. This bot was tested against Node.js version 16.14.0
  * [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) can be used to install / manage Node.js versions

### Setup

Install dependencies:

```sh
npm i
```

### Environment Config

Copy the `.env.sample` file into a file named `.env` and update the variables accordingly.

```sh
cp .env.sample .env
```

Variable | Description
--- | ---
GOOGLE_CALENDAR_ID | Google calendar ID. It will look like this: vru0ugbqpqi0hhtrfo6bru5d28@group.calendar.google.com
BOT_USERNAME | The twitch username of the bot that will be used to send the messages.
TWITCH_OAUTH_TOKEN | Twitch OAuth token for the given BOT_USERNAME - can be obtained here: https://twitchapps.com/tmi/

### Config

The `src/config.js` file contains the language string, the command prefix used inside the twitch chat and a list of channels the bot will join. 

### Running

After installing dependencies, creating the `.env` file and updating the `src/config.js` file, run the bot:

```sh
npm start
```

### Development

```sh
npm run dev
```