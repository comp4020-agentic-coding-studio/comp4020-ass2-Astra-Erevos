const longDate = new Intl.DateTimeFormat("en-AU", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** Format a date-only value without letting the viewer's timezone move it. */
export function formatCourseDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return longDate.format(date);
}

// Course due dates are authored with an explicit +10:00 offset (fixed
// AEST, no daylight saving). Rendering must use that same fixed zone —
// formatting in UTC (or the viewer's local zone) silently rolls the wall-clock
// date backwards whenever the local time is earlier than the UTC offset, e.g.
// 2027-03-17T08:30:00+10:00 becomes 2027-03-16T22:30:00Z.
const longDateTime = new Intl.DateTimeFormat("en-AU", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Australia/Brisbane",
});

/** Format a date-and-time value in the course's fixed +10:00 teaching timezone. */
export function formatCourseDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return longDateTime.format(date);
}
