import env from './env.js';

const config = {
  ...env,
  // Change channel name here
  TWITCH_CHANNELS: [
    'INPUT-CHANNEL-NAME-HERE'
  ],
  COMMAND_PREFIX: '!',
  LANGUAGE: 'de'
};

export default config;