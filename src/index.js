import tmi from 'tmi.js';

import config from './config.js';
import { getLang } from './lang.js';
import { onError, getCooldown, setCooldown, todayEvents, allEvents, getBdayDate, getSecRemain, secondsToDhms } from './helper.js';

// Init new tmi.js Client
const client = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: config.BOT_USERNAME,
    password: config.TWITCH_OAUTH_TOKEN,
  },
});

/**
 * Handle bot commands
 * @param {*} user Username from the user who triggerd the command
 * @param {*} command Command that the user triggered
 * @param {*} msg Message after command that got triggered
 * @param {*} flags Default flags
 * @param {*} extra Some extra flags
 */
async function handleCommands(user, command, msg, flags, extra) {
  var args = msg.toLowerCase().split(' ');
  if (command === "geburtstag" || command === "bday") {
    // Check for cooldown time in 'ms' (See example below)
    // # Examples:
    // extra.cooldown.any - check for the global cooldown time for the given command
    // extra.cooldown.user - check for the user specific cooldown time for the given command
    if(!flags.broadcaster && !flags.mod && extra.cooldown.any < process.env.COOLDOWN) return;
    if(args[0]) {
      var bdayUser = args[0].replace('@','').toLowerCase();
      var eventDate = "";
      var isListed = false;
      var calendarEntries = await allEvents();
      calendarEntries.forEach(gEvent => {
        if(gEvent.summary.toLowerCase() === bdayUser) {
          eventDate = new Date(gEvent.start);
          isListed = true;
        }
      });
      var secRemain = getSecRemain(eventDate);
      var time = await secondsToDhms(secRemain);
      var bdayDate = getBdayDate(eventDate); eventDate.toLocaleString('de-DE').split(', ')[0];
      var message = isListed ? await getLang(config.LANGUAGE, 'bday-user-date').replace('{{sender}}', user).replace('{{bdayUser}}', bdayUser).replace('{{bdayDate}}', bdayDate).replace('{{time}}', time) : await getLang(config.LANGUAGE, 'bday-no-entry').replace('{{sender}}', user).replace('{{bdayUser}}', bdayUser);
      // Update Cooldown
      setCooldown(command, extra.userId);
      return client.say(extra.channel, message);
    } else {
      var bdayUsers = [];
      var calendarEntries = await todayEvents();
      calendarEntries.forEach(gEvent => {
        bdayUsers.push(`@${gEvent.summary}`);
      });
      var message = "";
      if (bdayUsers.length == 0) {
        message = await getLang(config.LANGUAGE, 'bday-nobody').replace('{{sender}}', user);
      } else if (bdayUsers.length == 1) {
        message = await getLang(config.LANGUAGE, 'bday-single').replace('{{sender}}', user).replace('{{bdayUsers}}', bdayUsers.join(', '));
      } else if (bdayUsers.length >= 2) {
        message = await getLang(config.LANGUAGE, 'bday-multiple').replace('{{sender}}', user).replace('{{bdayUsers}}', bdayUsers.join(', '));
      }
      // Update Cooldown
      setCooldown(command, extra.userId);
      return client.say(extra.channel, message);
    }
  }
}

/**
 * Join a specific channel 
 * @param {*} channel Channel name to join
 */
function joinChannel(channel) {
  client.join(channel);
  console.log(`🤖Bot '${config.BOT_USERNAME}' connected to ${channel}`);
}

/**
 * Init twitch bot with default settings
 */
async function initBot() {
  await client.connect().catch((err) => onError(err));
  config.TWITCH_CHANNELS.forEach(async (channel) => {
    await joinChannel(channel);
  })

  client.on("message", async function(channel, userstate, message, self) {
    try {
      // Check if not own message (bot message)
      if (self) return;
      // Check if message is not a whisper
      if (userstate['message-type'] === 'whisper') return;
      // Check if message is a command
      if (!message.startsWith(config.COMMAND_PREFIX)) return;
      // Split message into arguments array
      var commandArgs = message.split(/ (.*)/);
      // Get the command and remove from arguments array
      var commandName = commandArgs[0].slice(1).toLowerCase();

      // Default tmi message flags
      var user = userstate["display-name"] || userstate["username"] || username;
      var isBroadcaster = ("#" + userstate["username"]) === channel;
      var isMod = userstate["mod"];
      var isFounder = (userstate["badges"] && userstate["badges"].founder === "0")
      var isSubscriber = isFounder || (userstate["badges"] && typeof userstate["badges"].subscriber !== "undefined") || userstate["subscriber"];
      var isVIP = (userstate["badges"] && userstate["badges"].vip === "1") || false;
      var isHighlightedMessage = userstate["msg-id"] === "highlighted-message";
      var userId = userstate["user-id"];
      var messageId = userstate["id"];
      var roomId = userstate["room-id"];
      var badges = userstate["badges"];
      var userColor = userstate["color"];
      var emotes = userstate["emotes"];
      var messageFlags = userstate["flags"];
      var messageTimestamp = userstate["tmi-sent-ts"];
      var isEmoteOnly = userstate["emote-only"] || false;
      var messageType = userstate["message-type"];
      var customRewardId = userstate["custom-reward-id"] || null;
      // default flags
      var flags = {
        broadcaster: isBroadcaster,
        mod: isMod,
        founder: isFounder,
        subscriber: isSubscriber || isFounder,
        vip: isVIP,
        highlighted: isHighlightedMessage,
        customReward: !!customRewardId
      };
      // extra flags
      var extra = {
        id: messageId,
        channel: channel.replace('#', ''),
        roomId: roomId,
        messageType: messageType,
        messageEmotes: emotes,
        isEmoteOnly: isEmoteOnly,
        userId: userId,
        username: userstate["username"],
        displayName: userstate["display-name"],
        userColor: userColor,
        userBadges: badges,
        userState: userstate,
        customRewardId: customRewardId,
        flags: messageFlags,
        timestamp: messageTimestamp,
      };
      const msg = commandArgs[1] || "";
      // Get Cooldown for specific command and user
      extra["cooldown"] = getCooldown(commandName, userId);
      handleCommands(user, commandName, msg, flags, extra);
    } catch (error) {
      onError(error);
    }
  });
}

initBot();
