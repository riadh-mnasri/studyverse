// ─── Content model: Subject → Chapter → Exercise ──────────────────────────

export type ExerciseType = "qcm" | "fill-blank" | "true-false" | "matching";

export interface BaseExercise {
  id: string; // unique within the whole app, e.g. "maths-nb-relatifs-q07"
  type: ExerciseType;
  prompt: string; // the question text
  explanation?: string; // shown after answering, especially for wrong answers
}

export interface QcmExercise extends BaseExercise {
  type: "qcm";
  options: string[];
  correctIndex: number;
}

export interface FillBlankExercise extends BaseExercise {
  type: "fill-blank";
  // prompt contains "___" as the blank placeholder
  acceptedAnswers: string[]; // normalized (lowercase, trimmed) accepted strings
}

export interface TrueFalseExercise extends BaseExercise {
  type: "true-false";
  correct: boolean;
}

export interface MatchingExercise extends BaseExercise {
  type: "matching";
  pairs: { left: string; right: string }[];
}

export type Exercise =
  | QcmExercise
  | FillBlankExercise
  | TrueFalseExercise
  | MatchingExercise;

export interface Chapter {
  id: string; // e.g. "nombres-relatifs"
  title: string; // "Nombres relatifs"
  description: string; // one-line, shown on chapter list
  icon: string; // emoji
  exercises: Exercise[];
}

export interface Subject {
  id: string; // "maths-4eme" | "francais-4eme" | "code-intro"
  name: string; // "Maths"
  icon: string; // emoji
  colorFrom: string; // tailwind gradient stop, e.g. "from-blue-500"
  colorTo: string; // "to-indigo-600"
  chapters: Chapter[];
}

// ─── Progress / game state ─────────────────────────────────────────────────

export interface ChapterProgress {
  bestScore: number; // 0-100, best % across attempts
  attempts: number;
  totalCorrect: number;
  totalAnswered: number;
  mastered: boolean; // true once bestScore >= MASTERY_THRESHOLD
  lastPlayedISO?: string;
}

export interface SubjectProgress {
  xp: number;
  chapterProgress: Record<string, ChapterProgress>; // keyed by Chapter.id
}

export interface DailyQuestEntry {
  subjectId: string;
  chapterId: string; // which chapter today's quiz pulls from
  completedISO?: string; // set once done today
  score?: number; // 0-100 once completed
}

export interface DayLog {
  dateISO: string; // "2026-06-21" (local date, not timestamp)
  questionsAnswered: number;
  xpEarned: number;
  minutesActive: number; // coarse estimate
  subjectsTouched: string[];
}

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDateISO?: string;
  freeSkipsUsedThisWeek: number;
  weekStartISO?: string;
}

export interface AvatarLoadout {
  base: string;
  hat?: string;
  outfit?: string;
  accessory?: string;
}

export interface GameState {
  version: 1; // for future migrations
  profile: {
    name: string;
    createdISO: string;
  };
  totalXp: number;
  gems: number;
  perfectQuizCount: number;
  subjects: Record<string, SubjectProgress>; // keyed by Subject.id
  streak: StreakState;
  badges: string[]; // unlocked badge ids
  equippedAvatar: AvatarLoadout;
  unlockedCosmetics: string[]; // cosmetic item ids owned
  todayQuests: DailyQuestEntry[];
  todayDateISO: string; // the date todayQuests was generated for
  history: DayLog[]; // capped, e.g. last 90 days
}

export interface CosmeticItem {
  id: string;
  slot: "base" | "hat" | "outfit" | "accessory";
  name: string;
  emoji: string; // MVP renders avatars as emoji/icon compositions
  cost: number; // in gems
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: GameState) => boolean;
}

export interface Rank {
  title: string;
  minTotalXp: number;
  icon: string;
}
