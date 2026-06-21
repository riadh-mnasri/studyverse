"use client";
import { useEffect } from "react";
import { useGameState, updateGameState } from "@/lib/storage";
import { ensureTodayQuests } from "@/lib/gameState";
import { getChapter, getSubject } from "@/lib/content";
import RankBanner from "@/components/RankBanner";
import StreakBadge from "@/components/StreakBadge";
import SubjectCard from "@/components/SubjectCard";
import NavBar from "@/components/NavBar";

export default function Home() {
  const [gameState] = useGameState();

  useEffect(() => {
    updateGameState((s) => ensureTodayQuests(s));
  }, []);

  const todayQuests = gameState.todayQuests;
  const allCompleted = todayQuests.length > 0 && todayQuests.every((q) => q.completedISO);

  const todayLog = gameState.history.find((d) => d.dateISO === gameState.todayDateISO);

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-5">
        <div className="text-center text-white">
          <h1 className="text-3xl font-black drop-shadow">🚀 Studyverse</h1>
          <p className="text-white/80 font-semibold text-sm">Tes missions du jour</p>
        </div>

        <div className="flex gap-3">
          <RankBanner totalXp={gameState.totalXp} />
          <StreakBadge streak={gameState.streak} />
        </div>

        {todayQuests.length === 0 && (
          <div className="bg-white/90 rounded-3xl p-6 text-center font-bold text-gray-500">Chargement...</div>
        )}

        {!allCompleted &&
          todayQuests.map((quest) => {
            const subject = getSubject(quest.subjectId);
            const chapter = getChapter(quest.subjectId, quest.chapterId);
            if (!subject || !chapter) return null;
            return (
              <SubjectCard
                key={quest.subjectId}
                subject={subject}
                chapterTitle={chapter.title}
                completed={Boolean(quest.completedISO)}
                score={quest.score}
                href={`/quiz/${subject.id}/${chapter.id}`}
              />
            );
          })}

        {allCompleted && (
          <div className="bg-white/95 rounded-3xl p-8 text-center shadow-xl">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-black text-gray-800 mb-1">Bravo ! Mission du jour accomplie.</h2>
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
            <a href="/matieres" className="text-indigo-600 font-bold text-sm underline">
              Réviser un chapitre en plus (optionnel)
            </a>
          </div>
        )}
      </div>
      <NavBar />
    </main>
  );
}
