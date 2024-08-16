export const parseHour = (token) => {
  const hour = parseInt(token, 10);

  if (hour < 0 || hour > 23) {
    throw new Error("Invalid hours");
  }

  return hour;
};

export const parseMinute = (token) => {
  const minute = parseInt(token, 10);

  if (minute < 0 || minute > 59) {
    throw new Error("Invalid minutes");
  }

  return minute;
};

export const parseAmPm = (token) => {
  let ampm = token.toLowerCase();

  if (ampm !== "am" && ampm !== "pm") {
    throw new Error("Invalid am/pm indicator");
  }

  return ampm;
};

export const calculateMinutesAmPm = (hour, minute, ampm) => {
  let currentHour = hour;

  if (hour === 12 && ampm === "am") {
    currentHour = 0;
  } else if (hour !== 12 && ampm === "pm") {
    currentHour += 12;
  }

  return currentHour * 60 + minute;
};

export const calculateMinutes = (hour, minute) => hour * 60 + minute;

export const isValidAmPmDate = (date) =>
  /^([0-9]|1[0-2]):?([0-5]\d)?(?:am|pm)$/i.test(date);

export const isValidDate = (date) => /^(1?[0-9]|2[0-3]):([0-5]\d)$/i.test(date);

const throwDateStructureError = () => {
  throw new Error("Invalid date structure");
};

export const dateAnalyze = (date) => {
  const tokens = date.match(/[a-zA-Z]+|[0-9]+|:/g);
  const hasAmPm = /am|pm/i.test(date);

  let hours = 0;
  let minutes = 0;
  let ampm = null;

  if (hasAmPm) {
    if (!isValidAmPmDate(date)) {
      throwDateStructureError();
    }

    hours = parseHour(tokens[0]);

    if (tokens.length === 2) {
      ampm = parseAmPm(tokens[1]);
    }

    if (tokens.length === 4) {
      minutes = parseMinute(tokens[2]);
      ampm = parseAmPm(tokens[3]);
    }
  } else {
    if (!isValidDate(date)) {
      throwDateStructureError();
    }

    hours = parseHour(tokens[0]);
    minutes = parseMinute(tokens[2]);
  }

  return hasAmPm
    ? calculateMinutesAmPm(hours, minutes, ampm)
    : calculateMinutes(hours, minutes);
};
