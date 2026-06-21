"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/lib/storage";
import { SUBJECTS } from "@/lib/content";
import XpBar from "@/components/XpBar";
import NavBar from "@/components/NavBar";
import FloatingBackground from "@/components/FloatingBackground";

const FLOATING = ["📐", "📖", "🧬", "🔧", "🌍", "⚗️", "💻", "🀄", "🇩🇪"];

export default function MatieresPage() {
  const [gameState] = useGameState();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <FloatingBackground emojis={FLOATING} />

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-white text-center drop-shadow mb-2"
        >
          📚 Mes matières
        </motion.h1>

        {SUBJECTS.map((subject, i) => {
          const progress = gameState.subjects[subject.id];
          const masteredCount = subject.chapters.filter(
            (c) => progress?.chapterProgress[c.id]?.mastered,
          ).length;
          const isOpen = Boolean(expanded[subject.id]);

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-5 card-shadow"
            >
              <motion.button
                whileTap={{ scale: 0.99 }}
                onClick={() => setExpanded((e) => ({ ...e, [subject.id]: !isOpen }))}
                className="w-full flex items-center gap-3 mb-1 text-left"
              >
                <span className="text-3xl">{subject.icon}</span>
                <div className="flex-1">
                  <div className="font-black text-gray-800 text-lg">{subject.name}</div>
                  <div className="text-xs text-gray-400 font-semibold">
                    {masteredCount}/{subject.chapters.length} chapitres maîtrisés
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="text-gray-400 text-lg"
                >
                  ⌄
                </motion.span>
              </motion.button>
              <XpBar xp={progress?.xp ?? 0} colorFrom={subject.colorFrom} colorTo={subject.colorTo} />

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
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
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <NavBar />
    </main>
  );
}
