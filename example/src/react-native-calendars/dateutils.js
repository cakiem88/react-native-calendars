const XDate = require('xdate');

function sameMonth(a, b) {
  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();
}

function sameDate(a, b) {
  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isGTE(a, b) {
  return b.diffDays(a) > -1;
}

function isLTE(a, b) {
  return a.diffDays(b) > -1;
}

function fromTo(a, b) {
  const days = [];
  let from = +a, to = +b;
  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

function month(xd) {
  const year = xd.getFullYear(), month = xd.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function page(xd, firstDayOfWeek) {
  const days = month(xd);
  let before = [], after = [];

  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7);
  }

  const to = days[days.length - 1].clone();
  const day = to.getDay();
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7);
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}
function INT(d) {
  return Math.floor(d);
}

function toLunarDay(dd, mm, yy) {
  return jdToDate(jdFromDate(dd, mm, yy));
}

function jdFromDate(dd, mm, yy) {
  var a, y, m, jd;
  a = INT((14 - mm) / 12);
  y = yy+4800-a;
  m = mm+12*a-3;
  jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - 32083;
  }
  return jd;
}

/* Convert a Julian day number to day/month/year. Parameter jd is an integer */
function jdToDate(jd) {
  var a, b, c, d, e, m, day, month, year;
  if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
    a = jd + 32044;
    b = INT((4*a+3)/146097);
    c = a - INT((b*146097)/4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = INT((4*c+3)/1461);
  e = c - INT((1461*d)/4);
  m = INT((5*e+2)/153);
  day = e - INT((153*m+2)/5) + 1;
  month = m + 3 - 12*INT(m/10);
  year = b*100 + d - 4800 + INT(m/10);
  return {day, month, year};
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  page,
  fromTo,
  isLTE,
  isGTE,
  toLunarDay
};
