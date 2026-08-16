// Simple local streak tracker. Records one entry per calendar day the
// learner finishes a lesson, then counts how many consecutive days
// (ending today or yesterday) are unbroken. Deliberately local/lightweight —
// no backend table for this yet.

const STORAGE_KEY = 'andalusi_activity_days';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function readDays(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordActivityToday(): void {
  const days = new Set(readDays());
  days.add(todayKey());
  // Keep it bounded — only the last 400 days matter for a streak count.
  const trimmed = Array.from(days).sort().slice(-400);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage failures (private browsing, quota, etc.)
  }
}

export function getCurrentStreak(): number {
  const days = new Set(readDays());
  if (days.size === 0) return 0;

  const cursor = new Date();
  // If nothing logged today yet, the streak can still be "alive" through
  // yesterday — start counting from there instead.
  if (!days.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
