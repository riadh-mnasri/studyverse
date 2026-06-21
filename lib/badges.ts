import { SUBJECTS } from "./content";
import type { Badge, GameState } from "./types";

function totalAnswered(state: GameState): number {
  return Object.values(state.subjects).reduce(
    (sum, s) =>
      sum +
      Object.values(s.chapterProgress).reduce(
        (a, c) => a + c.totalAnswered,
        0,
      ),
    0,
  );
}

function anyChapterMastered(state: GameState): boolean {
  return Object.values(state.subjects).some((s) =>
    Object.values(s.chapterProgress).some((c) => c.mastered),
  );
}

function allChaptersMastered(state: GameState, subjectId: string): boolean {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const progress = state.subjects[subjectId];
  if (!subject || !progress) return false;
  return subject.chapters.every((c) => progress.chapterProgress[c.id]?.mastered);
}

export const BADGES: Badge[] = [
  {
    id: "streak-7",
    name: "Une semaine de suite !",
    icon: "🔥",
    description: "7 jours de suite",
    check: (s) => s.streak.longest >= 7,
  },
  {
    id: "streak-30",
    name: "Habitué",
    icon: "🔥🔥",
    description: "30 jours de suite",
    check: (s) => s.streak.longest >= 30,
  },
  {
    id: "questions-100",
    name: "Centurion",
    icon: "💯",
    description: "100 questions répondues",
    check: (s) => totalAnswered(s) >= 100,
  },
  {
    id: "questions-500",
    name: "Marathonien",
    icon: "🏃",
    description: "500 questions répondues",
    check: (s) => totalAnswered(s) >= 500,
  },
  {
    id: "first-chapter-mastered",
    name: "Premier chapitre maîtrisé",
    icon: "⭐",
    description: "Un chapitre maîtrisé",
    check: (s) => anyChapterMastered(s),
  },
  {
    id: "subject-master-maths",
    name: "Maître des Maths",
    icon: "🔢👑",
    description: "Tous les chapitres de Maths maîtrisés",
    check: (s) => allChaptersMastered(s, "maths-4eme"),
  },
  {
    id: "subject-master-francais",
    name: "Maître du Français",
    icon: "📖👑",
    description: "Tous les chapitres de Français maîtrisés",
    check: (s) => allChaptersMastered(s, "francais-4eme"),
  },
  {
    id: "subject-master-code",
    name: "Maître du Code",
    icon: "💻👑",
    description: "Tous les chapitres de Code maîtrisés",
    check: (s) => allChaptersMastered(s, "code-intro"),
  },
  {
    id: "perfect-quiz",
    name: "Sans faute",
    icon: "✨",
    description: "Un quiz sans aucune erreur",
    check: (s) => s.perfectQuizCount >= 1,
  },
  {
    id: "rank-chevalier",
    name: "Chevalier",
    icon: "⚔️",
    description: "Atteint le rang Chevalier",
    check: (s) => s.totalXp >= 900,
  },
  {
    id: "rank-legende",
    name: "Légende",
    icon: "👑",
    description: "Atteint le rang Légende",
    check: (s) => s.totalXp >= 5000,
  },
];

export function checkNewlyUnlockedBadges(state: GameState): string[] {
  return BADGES.filter((b) => !state.badges.includes(b.id) && b.check(state)).map(
    (b) => b.id,
  );
}
