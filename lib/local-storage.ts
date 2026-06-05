import type { FusionEvent, FusionEventStatus, FusionTracker } from "@/types/fusion";
import { calculateTotalFragments, normalizeTracker, sortEventsByDate } from "./tracker-utils";

export const STORAGE_KEY = "rsl-ai-fusion-tracker";

export function saveTracker(tracker: FusionTracker): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touchTracker(tracker)));
}

export function getTracker(): FusionTracker | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return normalizeTracker(JSON.parse(stored));
  } catch {
    clearTracker();
    return null;
  }
}

export function clearTracker(): void {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function updateEventStatus(eventId: string, status: FusionEventStatus): FusionTracker | null {
  return updateEvent(eventId, { status });
}

export function updateEvent(eventId: string, patch: Partial<FusionEvent>): FusionTracker | null {
  const tracker = getTracker();
  if (!tracker) {
    return null;
  }

  const nextTracker = touchTracker({
    ...tracker,
    events: sortEventsByDate(
      tracker.events.map((event) => (event.id === eventId ? { ...event, ...patch } : event))
    )
  });
  saveTracker(nextTracker);
  return nextTracker;
}

export function addEvent(event: FusionEvent): FusionTracker | null {
  const tracker = getTracker();
  if (!tracker) {
    return null;
  }

  const nextTracker = touchTracker({
    ...tracker,
    events: sortEventsByDate([...tracker.events, event])
  });
  saveTracker(nextTracker);
  return nextTracker;
}

export function deleteEvent(eventId: string): FusionTracker | null {
  const tracker = getTracker();
  if (!tracker) {
    return null;
  }

  const nextTracker = touchTracker({
    ...tracker,
    events: tracker.events.filter((event) => event.id !== eventId)
  });
  saveTracker(nextTracker);
  return nextTracker;
}

function touchTracker(tracker: FusionTracker): FusionTracker {
  const events = sortEventsByDate(tracker.events);
  return {
    ...tracker,
    events,
    totalFragments: calculateTotalFragments(events),
    updatedAt: new Date().toISOString()
  };
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
