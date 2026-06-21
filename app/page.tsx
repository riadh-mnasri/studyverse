"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGameState, updateGameState } from "@/lib/storage";
import { ensureTodayQuests } from "@/lib/gameState";
import { getChapter, getSubject } from "@/lib/content";
import RankBanner from "@/components/RankBanner";
import StreakBadge from "@/components/StreakBadge";
import SubjectCard from "@/components/SubjectCard";
import NavBar from "@/components/NavBar";
import FloatingBackground from "@/components/FloatingBackground";
import AvatarPreview from "@/components/AvatarPreview";

const FLOATING = ["⭐", "🌟", "✨", "💫", "🎯", "🏆", "🎮", "📚", "🎉", "🌈"];

export default function Home() {
  const [gameState] = useGameState();

  useEffect(() => {
    updateGameState((s) => ensureTodayQuests(s));
  }, []);

  const todayQuests = gameState.todayQuests;
  const allCompleted = todayQuests.length > 0 && todayQuests.every((q) => q.completedISO);

  const todayLog = gameState.history.find((d) => d.dateISO === gameState.todayDateISO);

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <FloatingBackground emojis={FLOATING} />

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center text-white flex flex-col items-center gap-2"
        >
          <AvatarPreview loadout={gameState.equippedAvatar} size="sm" />
          <h1 className="text-3xl font-black drop-shadow">🚀 Salut {gameState.profile.name} !</h1>
          <p className="text-white/80 font-semibold text-sm">Tes missions du jour t&apos;attendent</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <RankBanner totalXp={gameState.totalXp} />
          <StreakBadge streak={gameState.streak} />
        </motion.div>

        {todayQuests.length === 0 && (
          <div className="bg-white/90 rounded-3xl p-6 text-center font-bold text-gray-500">Chargement...</div>
        )}

        {!allCompleted &&
          todayQuests.map((quest, i) => {
            const subject = getSubject(quest.subjectId);
            const chapter = getChapter(quest.subjectId, quest.chapterId);
            if (!subject || !chapter) return null;
            return (
              <motion.div
                key={quest.subjectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, type: "spring", bounce: 0.4 }}
              >
                <SubjectCard
                  subject={subject}
                  chapterTitle={chapter.title}
                  completed={Boolean(quest.completedISO)}
                  score={quest.score}
                  href={`/quiz/${subject.id}/${chapter.id}`}
                />
              </motion.div>
            );
          })}

        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white/95 rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="text-5xl mb-2" style={{ animation: "float 3s ease-in-out infinite" }}>
              🎉
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-1">
              Bravo {gameState.profile.name} ! Mission du jour accomplie.
            </h2>
            <p className="text-gray-500 font-semibold mb-4">À demain pour de nouveaux défis !</p>
            {todayLog && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-yellow-50 rounded-2xl p-3">
                  <div className="text-xl font-black text-yellow-600">+{todayLog.xpEarned}</div>
                  <div className="text-xs text-gray-400 font-semibold">XP aujourd&apos;hui</div>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-3">
                  <div className="text-xl font-black text-indigo-600">{todayLog.questionsAnswered}</div>
                  <div className="text-xs text-gray-400 font-semibold">Questions répondues</div>
                </div>
              </div>
            )}
            <Link href="/matieres" className="text-indigo-600 font-bold text-sm underline">
              Réviser un chapitre en plus (optionnel)
            </Link>
          </motion.div>
        )}
      </div>
      <NavBar />
    </main>
  );
}
