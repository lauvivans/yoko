import { type WeekDayEnum } from '@/enum/DayEnum';

export function getSafeDate(date: Date) {
  const validDate = new Date(date);

  const isUTCMidnight =
    validDate.getUTCHours() === 0 &&
    validDate.getUTCMinutes() === 0 &&
    validDate.getUTCSeconds() === 0;

  // If the date is UTC midnight, build a new local Date using UTC parts
  // to avoid the timezone shift (e.g. day 30 showing as day 29)
  const safeDate = isUTCMidnight
    ? new Date(
        validDate.getUTCFullYear(),
        validDate.getUTCMonth(),
        validDate.getUTCDate()
      )
    : validDate;

  return safeDate;
}

const getPart = (parts: Intl.DateTimeFormatPart[], type: string) =>
  parts.find((p) => p.type === type)?.value;

export function formatDate(date: Date): string {
  const safeDate = getSafeDate(date);

  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(safeDate);

  return `${getPart(parts, 'weekday')}, ${getPart(parts, 'day')} ${getPart(parts, 'month')} ${getPart(parts, 'year')}`;
}

export function formatDateForInput(date: Date): string {
  const validDate = new Date(date);
  const isUTCMidnight =
    validDate.getUTCHours() === 0 &&
    validDate.getUTCMinutes() === 0 &&
    validDate.getUTCSeconds() === 0;

  const year = isUTCMidnight
    ? validDate.getUTCFullYear()
    : validDate.getFullYear();
  const month = isUTCMidnight
    ? validDate.getUTCMonth() + 1
    : validDate.getMonth() + 1;
  const day = isUTCMidnight ? validDate.getUTCDate() : validDate.getDate();

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatHour(
  date: Date,
  time: string,
  is24Hour: boolean
): string {
  const safeDate = getSafeDate(date);
  const hour = time.slice(0, 2);
  const minute = time.slice(3, 5);

  safeDate.setHours(parseInt(hour), parseInt(minute));

  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: is24Hour,
  }).formatToParts(safeDate);

  let formatted = `${getPart(parts, 'hour')}:${getPart(parts, 'minute')}`;

  if (is24Hour) formatted += ` ${getPart(parts, 'dayPeriod')}`;

  return formatted;
}

export function getDateWeekDay(date: Date) {
  const safeDate = getSafeDate(date);

  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).formatToParts(safeDate);

  const part = getPart(parts, 'weekday');

  return part as WeekDayEnum;
}
