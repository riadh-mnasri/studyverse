import type { StreakState } from "./types";

const FREE_SKIPS_PER_WEEK = 1;

export function localDateISO(d = new Date()): string {
  // local calendar date, not UTC — avoids timezone-induced "phantom missed day" bugs
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function isoWeekStart(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00");
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(aISO: string, bISO: string): number {
  return Math.round(
    (new Date(bISO + "T00:00:00").getTime() -
      new Date(aISO + "T00:00:00").getTime()) /
      86400000,
  );
}

/** Call once per day, the first time the player completes any quiz that day. */
export function registerActiveDay(
  streak: StreakState,
  today: string = localDateISO(),
): StreakState {
  if (streak.lastActiveDateISO === today) return streak; // already counted today

  const currentWeekStart = isoWeekStart(today);
  const weekStartISO =
    streak.weekStartISO === currentWeekStart
      ? streak.weekStartISO
      : currentWeekStart;
  const freeSkipsUsedThisWeek =
    weekStartISO === streak.weekStartISO ? streak.freeSkipsUsedThisWeek : 0;

  if (!streak.lastActiveDateISO) {
    return {
      current: 1,
      longest: Math.max(1, streak.longest),
      lastActiveDateISO: today,
      freeSkipsUsedThisWeek,
      weekStartISO,
    };
  }

  const gap = daysBetween(streak.lastActiveDateISO, today);

  if (gap === 1) {
    const current = streak.current + 1;
    return {
      current,
      longest: Math.max(current, streak.longest),
      lastActiveDateISO: today,
      freeSkipsUsedThisWeek,
      weekStartISO,
    };
  }

  if (gap === 2 && freeSkipsUsedThisWeek < FREE_SKIPS_PER_WEEK) {
    // exactly one day was missed, and the weekly free skip hasn't been used yet — streak survives
    const current = streak.current + 1;
    return {
      current,
      longest: Math.max(current, streak.longest),
      lastActiveDateISO: today,
      freeSkipsUsedThisWeek: freeSkipsUsedThisWeek + 1,
      weekStartISO,
    };
  }

  // streak broken — reset gently to 1 (today's session starts a new streak), never to 0
  return {
    current: 1,
    longest: streak.longest,
    lastActiveDateISO: today,
    freeSkipsUsedThisWeek,
    weekStartISO,
  };
}

export function createDefaultStreak(): StreakState {
  return { current: 0, longest: 0, freeSkipsUsedThisWeek: 0 };
}
