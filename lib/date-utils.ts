const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateSafe(date: string | null): Date | null {
  if (!date || !ISO_DATE_PATTERN.test(date)) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDisplayDate(date: string | null): string {
  const parsed = parseDateSafe(date);
  if (!parsed) {
    return "Needs review";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(parsed);
}

export function getDateRange(start: string, end: string): string[] {
  const startDate = parseDateSafe(start);
  const endDate = parseDateSafe(end);
  if (!startDate || !endDate || endDate < startDate) {
    return [];
  }

  const dates: string[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export function getDaysBetween(start: string, end: string): number {
  const startDate = parseDateSafe(start);
  const endDate = parseDateSafe(end);
  if (!startDate || !endDate) {
    return 0;
  }

  return Math.floor((endDate.getTime() - startDate.getTime()) / 86_400_000);
}

export function getEventOffset(rangeStart: string, eventStart: string): number {
  return Math.max(0, getDaysBetween(rangeStart, eventStart));
}

export function getEventDuration(eventStart: string, eventEnd: string): number {
  return Math.max(1, getDaysBetween(eventStart, eventEnd) + 1);
}
