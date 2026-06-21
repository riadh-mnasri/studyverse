import { SUBJECTS } from "./content";
import { checkNewlyUnlockedBadges } from "./badges";
import { GEMS_PER_BADGE_UNLOCK, GEMS_PER_COMPLETED_QUIZ, GEMS_PER_PERFECT_QUIZ } from "./avatars";
import { createDefaultStreak, localDateISO, registerActiveDay } from "./streak";
import { PERFECT_QUIZ_BONUS_XP } from "./xp";
import type { ChapterProgress, DailyQuestEntry, DayLog, GameState, SubjectProgress } from "./types";

const MASTERY_THRESHOLD = 90; // percent — not 100, to avoid an anxiety-inducing perfection bar
const HISTORY_DAYS_KEPT = 90;
const MINUTES_PER_QUIZ_ESTIMATE = 5;

export function createDefaultGameState(): GameState {
  return {
    version: 1,
    profile: { name: "", createdISO: localDateISO() },
    totalXp: 0,
    gems: 0,
    perfectQuizCount: 0,
    subjects: {},
    streak: createDefaultStreak(),
    badges: [],
    equippedAvatar: { base: "base-default" },
    unlockedCosmetics: ["base-default"],
    todayQuests: [],
    todayDateISO: "",
    history: [],
  };
}

function ensureSubjectProgress(state: GameState, subjectId: string): SubjectProgress {
  return state.subjects[subjectId] ?? { xp: 0, chapterProgress: {} };
}

function ensureChapterProgress(progress: SubjectProgress, chapterId: string): ChapterProgress {
  return (
    progress.chapterProgress[chapterId] ?? {
      bestScore: 0,
      attempts: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      mastered: false,
    }
  );
}

/** Picks one chapter per subject for today's quests, favoring chapters not yet mastered. */
function pickChapterForSubject(state: GameState, subjectId: string): string {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  if (!subject || subject.chapters.length === 0) return "";
  const progress = state.subjects[subjectId];
  const unmastered = subject.chapters.filter(
    (c) => !progress?.chapterProgress[c.id]?.mastered,
  );
  const pool = unmastered.length > 0 ? unmastered : subject.chapters;
  // round-robin-ish: pick the one played least recently (or never)
  const sorted = [...pool].sort((a, b) => {
    const aLast = progress?.chapterProgress[a.id]?.lastPlayedISO ?? "";
    const bLast = progress?.chapterProgress[b.id]?.lastPlayedISO ?? "";
    return aLast.localeCompare(bLast);
  });
  return sorted[0].id;
}

/** Regenerates today's quests if the stored date doesn't match today. Idempotent otherwise. */
export function ensureTodayQuests(state: GameState): GameState {
  const today = localDateISO();
  if (state.todayDateISO === today) return state;

  const todayQuests: DailyQuestEntry[] = SUBJECTS.filter((s) => s.chapters.length > 0).map(
    (subject) => ({
      subjectId: subject.id,
      chapterId: pickChapterForSubject(state, subject.id),
    }),
  );

  return { ...state, todayDateISO: today, todayQuests };
}

interface QuizResultInput {
  subjectId: string;
  chapterId: string;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
}

interface QuizResultOutput {
  state: GameState;
  newlyUnlockedBadgeIds: string[];
  gemsEarned: number;
}

/** Single entrypoint for recording a finished quiz: updates progress, XP, gems, streak, badges, history. */
export function recordQuizCompletion(state: GameState, input: QuizResultInput): QuizResultOutput {
  const today = localDateISO();
  const scorePercent = Math.round((input.correctCount / input.totalCount) * 100);
  const isPerfect = input.correctCount === input.totalCount;

  const subjectProgress = ensureSubjectProgress(state, input.subjectId);
  const chapterProgress = ensureChapterProgress(subjectProgress, input.chapterId);

  const updatedChapterProgress: ChapterProgress = {
    bestScore: Math.max(chapterProgress.bestScore, scorePercent),
    attempts: chapterProgress.attempts + 1,
    totalCorrect: chapterProgress.totalCorrect + input.correctCount,
    totalAnswered: chapterProgress.totalAnswered + input.totalCount,
    mastered: chapterProgress.mastered || scorePercent >= MASTERY_THRESHOLD,
    lastPlayedISO: today,
  };

  const totalXpEarned = input.xpEarned + (isPerfect ? PERFECT_QUIZ_BONUS_XP : 0);
  const gemsEarned = GEMS_PER_COMPLETED_QUIZ + (isPerfect ? GEMS_PER_PERFECT_QUIZ : 0);

  const updatedSubjects: GameState["subjects"] = {
    ...state.subjects,
    [input.subjectId]: {
      xp: subjectProgress.xp + totalXpEarned,
      chapterProgress: {
        ...subjectProgress.chapterProgress,
        [input.chapterId]: updatedChapterProgress,
      },
    },
  };

  const updatedTodayQuests = state.todayQuests.map((q) =>
    q.subjectId === input.subjectId && q.chapterId === input.chapterId
      ? { ...q, completedISO: today, score: scorePercent }
      : q,
  );

  const updatedHistory = appendToHistory(state.history, today, {
    questionsAnswered: input.totalCount,
    xpEarned: totalXpEarned,
    subjectId: input.subjectId,
  });

  let nextState: GameState = {
    ...state,
    subjects: updatedSubjects,
    totalXp: state.totalXp + totalXpEarned,
    gems: state.gems + gemsEarned,
    perfectQuizCount: state.perfectQuizCount + (isPerfect ? 1 : 0),
    streak: registerActiveDay(state.streak, today),
    todayQuests: updatedTodayQuests,
    history: updatedHistory,
  };

  const newlyUnlockedBadgeIds = checkNewlyUnlockedBadges(nextState);
  if (newlyUnlockedBadgeIds.length > 0) {
    nextState = {
      ...nextState,
      badges: [...nextState.badges, ...newlyUnlockedBadgeIds],
      gems: nextState.gems + newlyUnlockedBadgeIds.length * GEMS_PER_BADGE_UNLOCK,
    };
  }

  return { state: nextState, newlyUnlockedBadgeIds, gemsEarned };
}

function appendToHistory(
  history: DayLog[],
  today: string,
  delta: { questionsAnswered: number; xpEarned: number; subjectId: string },
): DayLog[] {
  const existingIndex = history.findIndex((d) => d.dateISO === today);
  if (existingIndex === -1) {
    const entry: DayLog = {
      dateISO: today,
      questionsAnswered: delta.questionsAnswered,
      xpEarned: delta.xpEarned,
      minutesActive: MINUTES_PER_QUIZ_ESTIMATE,
      subjectsTouched: [delta.subjectId],
    };
    return [...history, entry].slice(-HISTORY_DAYS_KEPT);
  }

  const existing = history[existingIndex];
  const updated: DayLog = {
    ...existing,
    questionsAnswered: existing.questionsAnswered + delta.questionsAnswered,
    xpEarned: existing.xpEarned + delta.xpEarned,
    minutesActive: existing.minutesActive + MINUTES_PER_QUIZ_ESTIMATE,
    subjectsTouched: existing.subjectsTouched.includes(delta.subjectId)
      ? existing.subjectsTouched
      : [...existing.subjectsTouched, delta.subjectId],
  };
  const next = [...history];
  next[existingIndex] = updated;
  return next;
}

export function purchaseCosmetic(state: GameState, cosmeticId: string, cost: number): GameState {
  if (state.unlockedCosmetics.includes(cosmeticId) || state.gems < cost) return state;
  return {
    ...state,
    gems: state.gems - cost,
    unlockedCosmetics: [...state.unlockedCosmetics, cosmeticId],
  };
}
