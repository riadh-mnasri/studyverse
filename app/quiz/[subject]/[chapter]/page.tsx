"use client";
import { use, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getChapter, getSubject } from "@/lib/content";
import { useGameState, updateGameState } from "@/lib/storage";
import { recordQuizCompletion } from "@/lib/gameState";
import { xpForAnswer, levelForXp, COMBO_THRESHOLD } from "@/lib/xp";
import { BADGES } from "@/lib/badges";
import type { Exercise, Badge, Subject, Chapter } from "@/lib/types";
import QuestionCard from "@/components/QuestionCard";
import ResultScreen from "@/components/ResultScreen";
import Confetti from "@/components/Confetti";
import { sounds } from "@/lib/sounds";

const TOTAL_QUESTIONS = 10;

const MASCOT_REACTIONS = {
  idle: "😊",
  correct: "🥳",
  wrong: "😬",
  streak: "🔥",
};

type Phase = "playing" | "result";

interface FloatingXp {
  id: number;
  amount: number;
  x: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickExercises(chapter: Chapter): Exercise[] {
  return shuffle(chapter.exercises).slice(0, Math.min(TOTAL_QUESTIONS, chapter.exercises.length));
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>;
}) {
  const { subject: subjectId, chapter: chapterId } = use(params);
  const subject = getSubject(subjectId);
  const chapter = getChapter(subjectId, chapterId);

  if (!subject || !chapter) return notFound();

  // Remounting on chapter change resets all local quiz state without an init effect.
  return (
    <QuizSession
      key={`${subjectId}-${chapterId}`}
      subjectId={subjectId}
      chapterId={chapterId}
      subject={subject}
      chapter={chapter}
    />
  );
}

function QuizSession({
  subjectId,
  chapterId,
  subject,
  chapter,
}: {
  subjectId: string;
  chapterId: string;
  subject: Subject;
  chapter: Chapter;
}) {
  const [gameState] = useGameState();

  const [exercises, setExercises] = useState<Exercise[]>(() => pickExercises(chapter));
  const [current, setCurrent] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [mascot, setMascot] = useState<keyof typeof MASCOT_REACTIONS>("idle");
  const [floatingXps, setFloatingXps] = useState<FloatingXp[]>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [confettiType, setConfettiType] = useState<"correct" | "levelup">("correct");
  const [result, setResult] = useState<{
    gemsEarned: number;
    leveledUp: boolean;
    newBadges: Badge[];
    sessionXp: number;
  } | null>(null);
  const floatingIdRef = useRef(0);
  const answeringRef = useRef(false);

  const restart = useCallback(() => {
    setExercises(pickExercises(chapter));
    setCurrent(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setXpEarned(0);
    setPhase("playing");
    setMascot("idle");
    setFloatingXps([]);
    setResult(null);
  }, [chapter]);

  const exercise = exercises[current];
  const progressPercent = exercises.length > 0 ? (current / exercises.length) * 100 : 0;
  const totalQuestions = exercises.length;

  function finishQuiz(finalCorrectCount: number, finalXpEarned: number) {
    const subjectXpBefore = gameState.subjects[subjectId]?.xp ?? 0;
    let resultMeta = { newlyUnlockedBadgeIds: [] as string[], gemsEarned: 0, updatedSubjectXp: subjectXpBefore };

    updateGameState((state) => {
      const { state: next, newlyUnlockedBadgeIds, gemsEarned } = recordQuizCompletion(state, {
        subjectId,
        chapterId,
        correctCount: finalCorrectCount,
        totalCount: totalQuestions,
        xpEarned: finalXpEarned,
      });
      resultMeta = {
        newlyUnlockedBadgeIds,
        gemsEarned,
        updatedSubjectXp: next.subjects[subjectId]?.xp ?? subjectXpBefore,
      };
      return next;
    });

    const leveledUp = levelForXp(resultMeta.updatedSubjectXp) > levelForXp(subjectXpBefore);
    const newBadges = BADGES.filter((b) => resultMeta.newlyUnlockedBadgeIds.includes(b.id));

    sounds.win();
    setResult({
      gemsEarned: resultMeta.gemsEarned,
      leveledUp,
      newBadges,
      sessionXp: resultMeta.updatedSubjectXp - subjectXpBefore,
    });
    setPhase("result");
    if (leveledUp) setTimeout(() => { setConfettiType("levelup"); setConfettiTrigger(true); }, 200);
  }

  function handleAnswer(correct: boolean) {
    if (answeringRef.current) return;
    answeringRef.current = true;

    const gained = xpForAnswer(correct, combo);
    const newCombo = correct ? combo + 1 : 0;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    if (correct) {
      sounds.correct();
      setCorrectCount((c) => c + 1);
      setXpEarned((x) => x + gained);
      setMascot(newCombo >= COMBO_THRESHOLD ? "streak" : "correct");
      setConfettiTrigger(false);
      setTimeout(() => {
        setConfettiType("correct");
        setConfettiTrigger(true);
      }, 10);

      const id = floatingIdRef.current++;
      setFloatingXps((prev) => [...prev, { id, amount: gained, x: 40 + Math.random() * 20 }]);
      setTimeout(() => setFloatingXps((prev) => prev.filter((f) => f.id !== id)), 1200);
    } else {
      sounds.wrong();
      setMascot("wrong");
    }

    setTimeout(() => {
      setMascot("idle");
      answeringRef.current = false;
      const finalCorrectCount = correct ? correctCount + 1 : correctCount;
      const finalXpEarned = correct ? xpEarned + gained : xpEarned;
      if (current + 1 >= exercises.length) {
        finishQuiz(finalCorrectCount, finalXpEarned);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1400);
  }

  if (phase === "result" && result) {
    return (
      <ResultScreen
        name={gameState.profile.name}
        correctCount={correctCount}
        totalCount={totalQuestions}
        xpEarned={result.sessionXp}
        gemsEarned={result.gemsEarned}
        maxCombo={maxCombo}
        leveledUp={result.leveledUp}
        newBadges={result.newBadges}
        onReplay={restart}
      />
    );
  }

  if (!exercise) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <Confetti trigger={confettiTrigger} type={confettiType} />

      {floatingXps.map((f) => (
        <div
          key={f.id}
          className="fixed z-50 pointer-events-none font-black text-3xl text-yellow-300 drop-shadow-lg animate-float-up"
          style={{ left: `${f.x}%`, top: "45%" }}
        >
          +{f.amount} XP ⭐
        </div>
      ))}

      <div className="px-4 pt-4 pb-2">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Quitter le quiz"
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black text-lg hover:bg-white/20"
            >
              ✕
            </motion.button>
          </Link>

          <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-4 rounded-full bg-gradient-to-r ${subject.colorFrom} ${subject.colorTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="text-white/70 font-bold text-sm w-14 text-right">
            {current + 1}/{exercises.length}
          </div>
        </div>

        <div className="max-w-2xl mx-auto flex items-center justify-end mt-2 px-1">
          <div className="flex items-center gap-2">
            {combo >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="glass text-white font-black px-3 py-1 rounded-full text-sm"
              >
                🔥 {combo} combo !
              </motion.div>
            )}
            <div className="glass text-yellow-300 font-black px-3 py-1 rounded-full text-sm">⭐ {xpEarned} XP</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2 text-white/50 text-sm font-bold mb-4">
          <span>{subject.icon}</span>
          <span>
            {subject.name} · {chapter.title}
          </span>
        </div>

        <motion.div key={mascot} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-5xl mb-4">
          {MASCOT_REACTIONS[mascot]}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={exercise.id} exit={{ x: -80, opacity: 0 }} className="w-full">
            <QuestionCard exercise={exercise} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
