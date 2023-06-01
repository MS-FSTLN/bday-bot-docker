import env from './env.js';

const config = {
  ...env,
  TWITCH_CHANNELS: process.env.TWITCH_CHANNELS.split(','),
  COMMAND_PREFIX: env.PREFIX,
  LANGUAGE: env.LANG
};

export default config;