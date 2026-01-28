import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const SERVER_TZ =
  process.env.NEXT_PUBLIC_SERVER_TZ || "Asia/Kolkata";

/**
 * Current time in SERVER timezone
 */
export function serverNow() {
  return dayjs().tz(SERVER_TZ);
}

/**
 * Create a date-time in SERVER timezone
 */
export function serverDateTime(
  date: string,
  time?: string
) {
  if (time) {
    return dayjs.tz(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm",
      SERVER_TZ
    );
  }
  return dayjs.tz(date, "YYYY-MM-DD", SERVER_TZ);
}

/**
 * Get weekday key (sunday, monday...)
 */
export function serverWeekday(date: string) {
  return serverDateTime(date).format("dddd").toLowerCase();
}
