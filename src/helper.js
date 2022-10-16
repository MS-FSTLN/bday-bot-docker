import axios from 'axios';
import ical from 'ical';

import config from './config.js';
import { getLang } from './lang.js';

// User and global timestamp store
var timestamps = {
  global: {},
  users: {},
}

/**
 * Display the error in the console
 * @param {*} error Error message
 */
export function onError(error) {
  console.error("Error:", error);
}

/**
 * Returns an object containing the time period since last user interaction, and last interaction from any user in `ms`.
 * @param {*} command Command that is on cooldown
 * @param {*} userId User Id that triggered the command
 * @returns cooldown time
 */
export function getCooldown(command, userId) {
  if (!command) {
    return {
      any: null,
      user: null,
    }
  }
  
  var now = new Date();
  var res = {};

  if (timestamps.global[command]) {
    res["any"] = now - timestamps.global[command];
  }

  // store and update global since-last timestamp
  if (userId) {
    if (!timestamps.users[userId]) {
      timestamps.users[userId] = {};
    }

    if (timestamps.users[userId][command]) {
      res["user"] = now - timestamps.users[userId][command];
    }
  } else {
    res["user"] = null;
  }

  return res
}


/**
 * Sets time period since last user interaction, and last interaction from any user in `ms` and returns an object containing the time
 * @param {*} command Command that is on cooldown
 * @param {*} userId User Id that triggered the command
 * @returns cooldown time
 */
export function setCooldown(command, userId) {
  if (!command) return;

  var now = new Date();

  // update the global since-last timestamp
  timestamps.global[command] = now;

  // store and update users since-last timestamp
  if (userId) {
    if (!timestamps.users[userId]) {
      timestamps.users[userId] = {};
    }

    timestamps.users[userId][command] = now
  }
}

/**
 * Get todays google events from calendar
 * @returns Object with calendar entries
 */
export async function todayEvents() {
  const {
    data
  } = await axios.get(`https://calendar.google.com/calendar/ical/${config.GOOGLE_CALENDAR_ID}/public/basic.ics`);
  const events = ical.parseICS(data);
  var rightNow = new Date();
  return Object.values(events)
    .filter((event) => {
      var date = event.start.toLocaleString('de-DE').split(', ')[0];
      var month = date.split('.')[0];
      var day = date.split('.')[1];
      var dateNow = rightNow.toLocaleString('de-DE').split(', ')[0];
      var monthNow = dateNow.split('.')[0];
      var dayNow = dateNow.split('.')[1];
      return month == monthNow && dayNow == day;
    });;
}

/**
 * Get all google events from calendar
 * @returns Object with calendar entries
 */
export async function allEvents() {
  const {
    data
  } = await axios.get(`https://calendar.google.com/calendar/ical/${config.GOOGLE_CALENDAR_ID}/public/basic.ics`);
  const events = ical.parseICS(data);
  return Object.values(events);
}

/**
 * Convert input date to bday date
 * @param {*} eventDate Input date
 * @returns Converted bday date
 */
export function getBdayDate(eventDate) {
  var rightNow = new Date();

  var date = eventDate.toLocaleString('de-DE').split(', ')[0];
  var day = Number(date.split('.')[0]);
  var month = Number(date.split('.')[1]);
  var year = Number(date.split('.')[2]);

  var dateNow = rightNow.toLocaleString('de-DE').split(', ')[0];
  var dayNow = Number(dateNow.split('.')[0]);
  var monthNow = Number(dateNow.split('.')[1]);
  var yearNow = Number(dateNow.split('.')[2]);

  if (monthNow > month) {
    year = yearNow + 1;
  } else if (dayNow > day && monthNow == month) {
    year = yearNow + 1;
  } else {
    year = yearNow;
  }

  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;
  return `${day}.${month}.${year}`;
}

/**
 * Convert input date to seconds
 * @param {*} eventDate Input date
 * @returns Converted date to seconds
 */
export function getSecRemain(eventDate) {
  var rightNow = new Date();

  var date = eventDate.toLocaleString('de-DE').split(', ');
  var day = Number(date[0].split('.')[0]);
  var month = Number(date[0].split('.')[1]);
  var year = Number(date[0].split('.')[2]);

  var dateNow = rightNow.toLocaleString('de-DE').split(', ');
  var dayNow = Number(dateNow[0].split('.')[0]);
  var monthNow = Number(dateNow[0].split('.')[1]);
  var yearNow = Number(dateNow[0].split('.')[2]);
  var hoursNow = Number(dateNow[1].split(':')[0]);
  var minNow = Number(dateNow[1].split(':')[1]);
  var secNow = Number(dateNow[1].split(':')[2]);

  if (monthNow > month) {
    year = yearNow + 1;
  } else if (dayNow > day && monthNow == month) {
    year = yearNow + 1;
  } else {
    year = yearNow;
  }

  var seconds1 = new Date(year, month, day).getTime() / 1000;
  var seconds2 = new Date(yearNow, monthNow, dayNow, hoursNow, minNow, secNow).getTime() / 1000;
  var seconds = seconds1 - seconds2;
  return seconds;
}

/**
 * Get time from now to date entered
 * @param {*} dasecondste Input seconds
 */
export async function secondsToDhms(seconds) {
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
  result = d > 1 ? dDisplay.replace(', ', '') : (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "");
  return result;
}