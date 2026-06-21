"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGameState } from "@/lib/storage";
import { SUBJECTS } from "@/lib/content";
import XpBar from "@/components/XpBar";
import NavBar from "@/components/NavBar";

export default function MatieresPage() {
  const [gameState] = useGameState();

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">
        <h1 className="text-3xl font-black text-white text-center drop-shadow mb-2">📚 Mes matières</h1>

        {SUBJECTS.map((subject) => {
          const progress = gameState.subjects[subject.id];
          const masteredCount = subject.chapters.filter(
            (c) => progress?.chapterProgress[c.id]?.mastered,
          ).length;

          return (
            <motion.div
              key={subject.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-3xl p-5 card-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{subject.icon}</span>
                <div className="flex-1">
                  <div className="font-black text-gray-800 text-lg">{subject.name}</div>
                  <div className="text-xs text-gray-400 font-semibold">
                    {masteredCount}/{subject.chapters.length} chapitres maîtrisés
                  </div>
                </div>
              </div>
              <XpBar xp={progress?.xp ?? 0} colorFrom={subject.colorFrom} colorTo={subject.colorTo} />

              <div className="mt-4 flex flex-col gap-2">
                {subject.chapters.map((chapter) => {
                  const cp = progress?.chapterProgress[chapter.id];
                  return (
                    <Link key={chapter.id} href={`/quiz/${subject.id}/${chapter.id}`}>
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 active:bg-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-xl">{cp?.mastered ? "⭐" : chapter.icon}</span>
                        <div className="flex-1">
                          <div className="font-bold text-gray-700 text-sm">{chapter.title}</div>
                          <div className="text-xs text-gray-400">{chapter.description}</div>
                        </div>
                        {cp && <span className="text-xs font-black text-gray-400">{cp.bestScore}%</span>}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
      <NavBar />
    </main>
  );
}
