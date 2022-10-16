import tmi from 'tmi.js';
import axios from 'axios';
import ical from 'ical';

import config from './config.js';
import { getLang } from './lang.js';

// Init new tmi.js Client
const client = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: config.BOT_USERNAME,
    password: config.TWITCH_OAUTH_TOKEN,
  },
  channels: [],
});

/**
 * Display the error in the console
 * @param {*} error Error message
 */
function onError(error) {
  console.error("Error:", error);
}

/**
 * Get todays google events from calendar
 * @returns Object with calendar entries
 */
async function todayEvents() {
  const { data } = await axios.get(`https://calendar.google.com/calendar/ical/${config.GOOGLE_CALENDAR_ID}/public/basic.ics`);
  const events = ical.parseICS(data);
  var rightNow = new Date();
  config.SUMMER_TIME ? rightNow.setHours(0,0,0,0) : rightNow.setHours(1,0,0,0);
  return Object.values(events)
    .filter((event) => {
      var date = event.start.toLocaleString('de-DE').split('T')[0];
      var month = date.split('.')[0];
      var day = date.split('.')[1];
      var dateNow = rightNow.toLocaleString('de-DE').split('T')[0];
      var monthNow = dateNow.split('.')[0];
      var dayNow = dateNow.split('.')[1];
      return month == monthNow && dayNow == day;
    });;
}

/**
 * Get all google events from calendar
 * @returns Object with calendar entries
 */
async function allEvents() {
  const { data } = await axios.get(`https://calendar.google.com/calendar/ical/${config.GOOGLE_CALENDAR_ID}/public/basic.ics`);
  const events = ical.parseICS(data);
  return Object.values(events);
}

/**
 * Convert input date to bday date
 * @param {*} eventDate Input date
 * @returns Converted bday date
 */
function getBdayDate(eventDate) {
  var rightNow = new Date();

  var date = eventDate.toLocaleString('de-DE').split(', ')[0];
  var day = Number(date.split('.')[0]);
  var month = Number(date.split('.')[1]);
  var year = Number(date.split('.')[2]);

  var dateNow = rightNow.toLocaleString('de-DE').split(', ')[0];
  var dayNow = Number(dateNow.split('.')[0]);
  var monthNow = Number(dateNow.split('.')[1]);
  var yearNow = Number(dateNow.split('.')[2]);

  if(monthNow > month) {
    year = yearNow + 1;
  }
  else if(dayNow > day && monthNow == month) {
    year = yearNow + 1;
  } else {
    year = yearNow;
  }

  if(day < 10) day = `0${day}`;
  if(month < 10) month = `0${month}`;
  return `${day}.${month}.${year}`;
}

/**
 * Convert input date to seconds
 * @param {*} eventDate Input date
 * @returns Converted date to seconds
 */
function getSecRemain(eventDate) {
  var rightNow = new Date();

  var date = eventDate.toLocaleString('de-DE').split(', ')[0];
  var day = Number(date.split('.')[0]);
  var month = Number(date.split('.')[1]);
  var year = Number(date.split('.')[2]);

  var dateNow = rightNow.toLocaleString('de-DE').split(', ')[0];
  var dayNow = Number(dateNow.split('.')[0]);
  var monthNow = Number(dateNow.split('.')[1]);
  var yearNow = Number(dateNow.split('.')[2]);

  if(monthNow > month) {
    year = yearNow + 1;
  }
  else if(dayNow > day && monthNow == month) {
    year = yearNow + 1;
  } else {
    year = yearNow;
  }
  
  var seconds1 = new Date(year, month, day).getTime() / 1000;
  var seconds2 = new Date(yearNow, monthNow, dayNow).getTime() / 1000;
  var seconds = seconds1 - seconds2;
  return seconds;
}

/**
 * Get time from now to date entered
 * @param {*} dasecondste Input seconds
 */
 async function secondsToDhms(seconds) {
  var result = "";
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? ` ${await getLang('de', 'day')}, ` : ` ${await getLang('de', 'days')}, `) : "";
  var hDisplay = h > 0 ? h + (h == 1 ? ` ${await getLang('de', 'hour')}, ` : ` ${await getLang('de', 'hours')}, `) : "";
  var mDisplay = m > 0 ? m + (m == 1 ? ` ${await getLang('de', 'minute')}, ` : ` ${await getLang('de', 'minutes')}, `) : "";
  var sDisplay = s > 0 ? s + (s == 1 ? ` ${await getLang('de', 'second')}` : ` ${await getLang('de', 'seconds')}`) : "";
  result = d > 7 ? dDisplay.replace(', ', '') : (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "");
  return result;
}

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
      handleCommands(user, commandName, msg, flags, extra);
    } catch (error) {
      onError(error);
    }
  });
}

initBot();