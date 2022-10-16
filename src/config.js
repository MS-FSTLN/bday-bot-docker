import env from './env.js';

const config = {
  ...env,
  // Change channel name here
  TWITCH_CHANNELS: [
    'INPUT-CHANNEL-NAME-HERE'
  ],
  SUMMER_TIME: true,
  COMMAND_PREFIX: '!',
  LANGUAGE: 'de'
};

export default config;