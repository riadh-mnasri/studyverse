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

function allSubjectsMastered(state: GameState): boolean {
  return SUBJECTS.every((subject) => allChaptersMastered(state, subject.id));
}

function chaptersMasteredCount(state: GameState): number {
  return Object.values(state.subjects).reduce(
    (sum, s) => sum + Object.values(s.chapterProgress).filter((c) => c.mastered).length,
    0,
  );
}

function hasDayTouchingAllSubjects(state: GameState): boolean {
  return state.history.some((day) => day.subjectsTouched.length >= SUBJECTS.length);
}

function hasBigDay(state: GameState, minQuestions: number): boolean {
  return state.history.some((day) => day.questionsAnswered >= minQuestions);
}

export const BADGES: Badge[] = [
  {
    id: "streak-3",
    name: "Premier élan",
    icon: "🔥",
    description: "3 jours de suite",
    check: (s) => s.streak.longest >= 3,
  },
  {
    id: "streak-7",
    name: "Une semaine de suite !",
    icon: "🔥",
    description: "7 jours de suite",
    check: (s) => s.streak.longest >= 7,
  },
  {
    id: "streak-14",
    name: "Deux semaines de suite",
    icon: "🔥🔥",
    description: "14 jours de suite",
    check: (s) => s.streak.longest >= 14,
  },
  {
    id: "streak-30",
    name: "Habitué",
    icon: "🔥🔥",
    description: "30 jours de suite",
    check: (s) => s.streak.longest >= 30,
  },
  {
    id: "streak-60",
    name: "Increvable",
    icon: "🔥🔥🔥",
    description: "60 jours de suite",
    check: (s) => s.streak.longest >= 60,
  },
  {
    id: "streak-100",
    name: "Cent jours sans faiblir",
    icon: "🔥💯",
    description: "100 jours de suite",
    check: (s) => s.streak.longest >= 100,
  },
  {
    id: "questions-25",
    name: "Premiers pas",
    icon: "📚",
    description: "25 questions répondues",
    check: (s) => totalAnswered(s) >= 25,
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
    id: "questions-1000",
    name: "Encyclopédie vivante",
    icon: "🧠📚",
    description: "1000 questions répondues",
    check: (s) => totalAnswered(s) >= 1000,
  },
  {
    id: "first-chapter-mastered",
    name: "Premier chapitre maîtrisé",
    icon: "⭐",
    description: "Un chapitre maîtrisé",
    check: (s) => anyChapterMastered(s),
  },
  {
    id: "chapters-mastered-5",
    name: "Collectionneur",
    icon: "🗂️",
    description: "5 chapitres maîtrisés",
    check: (s) => chaptersMasteredCount(s) >= 5,
  },
  {
    id: "chapters-mastered-15",
    name: "Grand collectionneur",
    icon: "🗂️✨",
    description: "15 chapitres maîtrisés",
    check: (s) => chaptersMasteredCount(s) >= 15,
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
    id: "subject-master-svt",
    name: "Maître en SVT",
    icon: "🧬👑",
    description: "Tous les chapitres de SVT maîtrisés",
    check: (s) => allChaptersMastered(s, "svt"),
  },
  {
    id: "subject-master-techno",
    name: "Maître en Techno",
    icon: "🔧👑",
    description: "Tous les chapitres de Techno maîtrisés",
    check: (s) => allChaptersMastered(s, "techno"),
  },
  {
    id: "subject-master-anglais",
    name: "Maître en Anglais",
    icon: "🇬🇧👑",
    description: "Tous les chapitres d'Anglais maîtrisés",
    check: (s) => allChaptersMastered(s, "anglais"),
  },
  {
    id: "subject-master-chinois",
    name: "Maître en Chinois",
    icon: "🀄👑",
    description: "Tous les chapitres de Chinois maîtrisés",
    check: (s) => allChaptersMastered(s, "chinois"),
  },
  {
    id: "subject-master-allemand",
    name: "Maître en Allemand",
    icon: "🇩🇪👑",
    description: "Tous les chapitres d'Allemand maîtrisés",
    check: (s) => allChaptersMastered(s, "allemand"),
  },
  {
    id: "subject-master-physique-chimie",
    name: "Maître en Physique-Chimie",
    icon: "⚗️👑",
    description: "Tous les chapitres de Physique-Chimie maîtrisés",
    check: (s) => allChaptersMastered(s, "physique-chimie"),
  },
  {
    id: "subject-master-all",
    name: "Couronne suprême",
    icon: "👑👑👑",
    description: "Toutes les matières entièrement maîtrisées",
    check: (s) => allSubjectsMastered(s),
  },
  {
    id: "perfect-quiz",
    name: "Sans faute",
    icon: "✨",
    description: "Un quiz sans aucune erreur",
    check: (s) => s.perfectQuizCount >= 1,
  },
  {
    id: "perfect-quiz-5",
    name: "Précision redoutable",
    icon: "🎯",
    description: "5 quiz sans aucune erreur",
    check: (s) => s.perfectQuizCount >= 5,
  },
  {
    id: "perfect-quiz-20",
    name: "Perfectionniste",
    icon: "💎✨",
    description: "20 quiz sans aucune erreur",
    check: (s) => s.perfectQuizCount >= 20,
  },
  {
    id: "rank-eleve",
    name: "Élève",
    icon: "📘",
    description: "Atteint le rang Élève",
    check: (s) => s.totalXp >= 300,
  },
  {
    id: "rank-chevalier",
    name: "Chevalier",
    icon: "⚔️",
    description: "Atteint le rang Chevalier",
    check: (s) => s.totalXp >= 900,
  },
  {
    id: "rank-erudit",
    name: "Érudit",
    icon: "🧠",
    description: "Atteint le rang Érudit",
    check: (s) => s.totalXp >= 1800,
  },
  {
    id: "rank-maitre",
    name: "Maître",
    icon: "🏆",
    description: "Atteint le rang Maître",
    check: (s) => s.totalXp >= 3200,
  },
  {
    id: "rank-legende",
    name: "Légende",
    icon: "👑",
    description: "Atteint le rang Légende",
    check: (s) => s.totalXp >= 5000,
  },
  {
    id: "cosmetics-collector",
    name: "Styliste",
    icon: "👗",
    description: "5 objets cosmétiques débloqués",
    check: (s) => s.unlockedCosmetics.length >= 5,
  },
  {
    id: "polyvalent-day",
    name: "Polyvalent",
    icon: "🌈",
    description: "Toutes les matières pratiquées le même jour",
    check: (s) => hasDayTouchingAllSubjects(s),
  },
  {
    id: "big-day",
    name: "Journée marathon",
    icon: "⚡",
    description: "30 questions répondues en une seule journée",
    check: (s) => hasBigDay(s, 30),
  },
];

export function checkNewlyUnlockedBadges(state: GameState): string[] {
  return BADGES.filter((b) => !state.badges.includes(b.id) && b.check(state)).map(
    (b) => b.id,
  );
}
