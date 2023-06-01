const {
  GOOGLE_CALENDAR_ID,
  BOT_USERNAME,
  TWITCH_OAUTH_TOKEN,
  TWITCH_CLIENT_ID,
  TWITCH_CHANNELS,
  PREFIX,
  LANG,
  COOLDOWN,
} = process.env;

const env = {
  GOOGLE_CALENDAR_ID,
  TWITCH_OAUTH_TOKEN,
  TWITCH_CLIENT_ID,
  BOT_USERNAME,
  TWITCH_CHANNELS,
  PREFIX,
  LANG,
  COOLDOWN,
};

Object
  .entries(env)
  .forEach(([name, value]) => {
    if (!value) {
      throw new Error(`${name} is not specified in the environment variables!`);
    }
  });

export default env;