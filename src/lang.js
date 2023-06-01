const LANGUAGE = {
  /**
   * {{sender}} - Replaced with user that triggered the message
   * {{bdayUsers}} - Replaced with a list of users who have birthday
   * {{bdayUser}} - Replaced by a user who has a birthday
   * {{bdayDate}} - Replaced with the birthday date
   * {{time}} - Replaced with the remaining time until birthday date
   */
  'de': {
    'bday-single': '@{{sender}}, Heute hat {{bdayUsers}} Geburtstag. Alles Gute! FeelsBirthdayMan',
    'bday-multiple': '@{{sender}}, Heute haben {{bdayUsers}} Geburtstag. Alles Gute! FeelsBirthdayMan',
    'bday-nobody': '@{{sender}}, Heute hat leider niemand Geburtstag! Sadge',
    'bday-no-entry': '@{{sender}}, @{{bdayUser}} ist noch nicht in die Geburtstagsliste eingetragen! D:',
    'bday-user-date': '@{{sender}}, @{{bdayUser}} hat am {{bdayDate}} Geburtstag! Das ist schon in {{time}}! Wowee',
    'day': 'Tag',
    'days': 'Tagen',
    'hour': 'Stunde',
    'hours': 'Stunden',
    'minute': 'Minute',
    'minutes': 'Minuten',
    'second': 'Sekunde',
    'seconds': 'Sekunden',
  }
};

/**
 * Get language file from the specific type
 * @param {*} language Language code
 * @param {*} type Message type
 * @returns The language file requested or '{ LANG_STRING_MISSING }'
 */
export function getLang(language, type) {
  return (typeof LANGUAGE[language][type] != 'undefined') ? LANGUAGE[language][type] : '{ LANG_STRING_MISSING }';
}