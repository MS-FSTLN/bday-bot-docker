import dotenv from 'dotenv';

dotenv.config();

const {
  GOOGLE_CALENDAR_ID,
  BOT_USERNAME,
  TWITCH_OAUTH_TOKEN,
  TWITCH_CLIENT_ID,
} = process.env;

const env = {
  GOOGLE_CALENDAR_ID,
  TWITCH_OAUTH_TOKEN,
  TWITCH_CLIENT_ID,
  BOT_USERNAME,
};

Object
  .entries(env)
  .forEach(([name, value]) => {
    if (!value) {
      throw new Error(`${name} is not specified in the .env file!`);
    }
  });

export default env;