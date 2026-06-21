"use client";
import { motion } from "framer-motion";
import { useGameState } from "@/lib/storage";
import { BADGES } from "@/lib/badges";
import BadgeIcon from "@/components/BadgeIcon";
import NavBar from "@/components/NavBar";
import FloatingBackground from "@/components/FloatingBackground";

const FLOATING = ["🏅", "🥇", "🏆", "⭐", "🎖️", "✨"];

export default function BadgesPage() {
  const [gameState] = useGameState();

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <FloatingBackground emojis={FLOATING} />

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white text-center drop-shadow mb-1">🏅 Mes badges</h1>
          <p className="text-white/80 font-semibold text-center text-sm mb-2">
            {gameState.badges.length}/{BADGES.length} débloqués
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", bounce: 0.5 }}
            >
              <BadgeIcon badge={badge} unlocked={gameState.badges.includes(badge.id)} />
            </motion.div>
          ))}
        </div>
      </div>
      <NavBar />
    </main>
  );
}
