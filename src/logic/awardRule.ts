export type AwardCheck =
  | { allowed: true }
  | { allowed: false; reason: "weekend" | "already-today" };

export function canAwardToday(
  now: Date,
  latestAwardAt: string | null,
  timeZone = "Europe/Amsterdam"
): AwardCheck {
  // Check if today is a weekend
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  });
  const weekday = weekdayFormatter.format(now);
  if (weekday === "Sat" || weekday === "Sun") {
    return { allowed: false, reason: "weekend" };
  }

  // Get today's date string in Amsterdam timezone
  const todayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone });
  const todayStr = todayFormatter.format(now);

  // Check if a cookie was already awarded today
  if (latestAwardAt !== null) {
    const latestFormatter = new Intl.DateTimeFormat("en-CA", { timeZone });
    const latestDateStr = latestFormatter.format(new Date(latestAwardAt));
    if (latestDateStr === todayStr) {
      return { allowed: false, reason: "already-today" };
    }
  }

  return { allowed: true };
}
