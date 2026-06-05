import type {
  FusionEvent,
  FusionEventStatus,
  FusionEventType,
  FusionTracker
} from "@/types/fusion";
import { parseDateSafe } from "./date-utils";

export interface TrackerProgress {
  totalFragments: number;
  earnedFragments: number;
  skippedFragments: number;
  pendingFragments: number;
  requiredFragments: number;
  remainingNeeded: number;
  possibleFinalFragments: number;
  percentComplete: number;
  status: "completed" | "on-track" | "at-risk" | "needs-review";
}

export function createEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function calculateTotalFragments(events: FusionEvent[]): number {
  return events.reduce((sum, event) => sum + Math.max(0, event.fragments ?? 0), 0);
}

export function calculateProgress(tracker: FusionTracker): TrackerProgress {
  const totalFragments = tracker.totalFragments || calculateTotalFragments(tracker.events);
  const earnedFragments = sumByStatus(tracker.events, "earned");
  const skippedFragments = sumByStatus(tracker.events, "skipped");
  const pendingFragments = sumByStatus(tracker.events, "pending");
  const remainingNeeded = Math.max(0, tracker.requiredFragments - earnedFragments);
  const possibleFinalFragments = earnedFragments + pendingFragments;
  const percentComplete = Math.min(100, Math.round((earnedFragments / tracker.requiredFragments) * 100));
  const hasReviewItems =
    tracker.events.some((event) => event.needsReview) ||
    !tracker.dateRange.start ||
    !tracker.dateRange.end;

  let status: TrackerProgress["status"] = "on-track";
  if (earnedFragments >= tracker.requiredFragments) {
    status = "completed";
  } else if (hasReviewItems) {
    status = "needs-review";
  } else if (possibleFinalFragments < tracker.requiredFragments) {
    status = "at-risk";
  }

  return {
    totalFragments,
    earnedFragments,
    skippedFragments,
    pendingFragments,
    requiredFragments: tracker.requiredFragments,
    remainingNeeded,
    possibleFinalFragments,
    percentComplete,
    status
  };
}

export function getTrackerStatus(tracker: FusionTracker): TrackerProgress["status"] {
  return calculateProgress(tracker).status;
}

export function sortEventsByDate(events: FusionEvent[]): FusionEvent[] {
  return [...events].sort((a, b) => {
    const aTime = parseDateSafe(a.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = parseDateSafe(b.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return aTime - bTime || a.name.localeCompare(b.name);
  });
}

export function groupEventsByType(events: FusionEvent[]): Record<FusionEventType, FusionEvent[]> {
  return {
    Tournament: sortEventsByDate(events.filter((event) => event.type === "Tournament")),
    Event: sortEventsByDate(events.filter((event) => event.type === "Event"))
  };
}

export function normalizeTracker(raw: unknown): FusionTracker {
  if (!isRecord(raw)) {
    throw new Error("Tracker data must be an object.");
  }

  const now = new Date().toISOString();
  const rawEvents = Array.isArray(raw.events) ? raw.events : [];
  const events = rawEvents.map(normalizeEvent);
  const explicitTotal = toNonNegativeNumber(raw.totalFragments);

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : createEventId(),
    fusionName: typeof raw.fusionName === "string" && raw.fusionName.trim() ? raw.fusionName.trim() : null,
    dateRange: normalizeDateRange(raw.dateRange),
    requiredFragments: toNonNegativeNumber(raw.requiredFragments) ?? 100,
    totalFragments: explicitTotal ?? calculateTotalFragments(events),
    events: sortEventsByDate(events),
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
    updatedAt: now,
    source: normalizeSource(raw.source)
  };
}

function normalizeEvent(raw: unknown): FusionEvent {
  if (!isRecord(raw)) {
    throw new Error("Each event must be an object.");
  }

  const type = raw.type === "Tournament" ? "Tournament" : "Event";
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "Unnamed event";

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : createEventId(),
    name,
    type,
    startDate: normalizeIsoDate(raw.startDate),
    endDate: normalizeIsoDate(raw.endDate),
    fragments: toNonNegativeNumber(raw.fragments),
    status: normalizeStatus(raw.status),
    needsReview: Boolean(raw.needsReview) || !normalizeIsoDate(raw.startDate) || !normalizeIsoDate(raw.endDate),
    notes: typeof raw.notes === "string" ? raw.notes : undefined
  };
}

function normalizeDateRange(raw: unknown): FusionTracker["dateRange"] {
  if (!isRecord(raw)) {
    return { start: null, end: null };
  }

  return {
    start: normalizeIsoDate(raw.start),
    end: normalizeIsoDate(raw.end)
  };
}

function normalizeStatus(raw: unknown): FusionEventStatus {
  if (raw === "earned" || raw === "skipped" || raw === "pending") {
    return raw;
  }

  return "pending";
}

function normalizeSource(raw: unknown): FusionTracker["source"] {
  if (raw === "ai" || raw === "imported" || raw === "manual") {
    return raw;
  }

  return "ai";
}

function normalizeIsoDate(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const value = raw.trim();
  return parseDateSafe(value) ? value : null;
}

function toNonNegativeNumber(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return null;
  }

  return Math.max(0, Math.round(raw));
}

function sumByStatus(events: FusionEvent[], status: FusionEventStatus): number {
  return events
    .filter((event) => event.status === status)
    .reduce((sum, event) => sum + Math.max(0, event.fragments ?? 0), 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
