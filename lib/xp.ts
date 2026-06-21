import type { Rank } from "./types";

export const BASE_XP_CORRECT = 10;
export const COMBO_BONUS_XP = 5; // awarded once a combo of 3+ correct in a row is active
export const COMBO_THRESHOLD = 3; // consecutive correct answers needed to activate the combo bonus
export const PERFECT_QUIZ_BONUS_XP = 20; // all questions correct in one quiz session

/** No XP loss on wrong answers — wrong answers simply earn 0 and reset the in-quiz combo. */
export function xpForAnswer(correct: boolean, currentCombo: number): number {
  if (!correct) return 0;
  const comboBonus = currentCombo + 1 >= COMBO_THRESHOLD ? COMBO_BONUS_XP : 0;
  return BASE_XP_CORRECT + comboBonus;
}

// Level N requires cumulative XP of (N-1)*N/2 * LEVEL_XP_UNIT — a gently increasing curve:
// early levels come fast, later levels take meaningfully more.
export const LEVEL_XP_UNIT = 50;

export function xpRequiredForLevel(level: number): number {
  return Math.round((level - 1) * level * 0.5 * LEVEL_XP_UNIT);
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= xp) level++;
  return level;
}

export interface XpProgress {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  percent: number;
}

export function xpProgress(xp: number): XpProgress {
  const level = levelForXp(xp);
  const floor = xpRequiredForLevel(level);
  const ceil = xpRequiredForLevel(level + 1);
  const xpIntoLevel = xp - floor;
  const span = ceil - floor;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: span,
    percent: span > 0 ? Math.round((xpIntoLevel / span) * 100) : 100,
  };
}

export const RANKS: Rank[] = [
  { title: "Apprenti", minTotalXp: 0, icon: "🌱" },
  { title: "Élève", minTotalXp: 300, icon: "📘" },
  { title: "Chevalier", minTotalXp: 900, icon: "⚔️" },
  { title: "Érudit", minTotalXp: 1800, icon: "🧠" },
  { title: "Maître", minTotalXp: 3200, icon: "🏆" },
  { title: "Légende", minTotalXp: 5000, icon: "👑" },
];

export function rankForTotalXp(totalXp: number): Rank {
  return (
    [...RANKS].reverse().find((r) => totalXp >= r.minTotalXp) ?? RANKS[0]
  );
}
