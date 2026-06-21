"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Confetti from "@/components/Confetti";
import type { Badge } from "@/lib/types";

interface Props {
  name: string;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  gemsEarned: number;
  maxCombo: number;
  leveledUp: boolean;
  newBadges: Badge[];
  onReplay: () => void;
}

export default function ResultScreen({
  name,
  correctCount,
  totalCount,
  xpEarned,
  gemsEarned,
  maxCombo,
  leveledUp,
  newBadges,
  onReplay,
}: Props) {
  const pct = Math.round((correctCount / totalCount) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  const messages = [
    "Continue, tu peux le faire ! 💪",
    "Pas mal du tout ! 😊",
    "Super travail ! 🌟",
    `PARFAIT ${name} ! 🏆🎉`,
  ];

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <Confetti trigger type="win" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
      >
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={i < stars ? { scale: 1, rotate: 0 } : { scale: 0.4, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.2, type: "spring", bounce: 0.6 }}
              className={`text-5xl ${i < stars ? "" : "opacity-20"}`}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-6xl mb-3"
        >
          {stars === 3 ? "🏆" : stars === 2 ? "🥈" : stars === 1 ? "💪" : "😅"}
        </motion.div>

        <h2 className="text-3xl font-black text-gray-800 mb-1">{messages[stars]}</h2>
        <p className="text-gray-400 font-semibold mb-6">
          {correctCount}/{totalCount} bonnes réponses
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-indigo-50 rounded-2xl p-3">
            <div className="text-2xl font-black text-indigo-600">{pct}%</div>
            <div className="text-xs text-gray-400 font-semibold">Score</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-3">
            <div className="text-2xl font-black text-yellow-600">+{xpEarned}</div>
            <div className="text-xs text-gray-400 font-semibold">XP gagnés</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3">
            <div className="text-2xl font-black text-orange-600">🔥{maxCombo}</div>
            <div className="text-xs text-gray-400 font-semibold">Combo max</div>
          </div>
        </div>

        {gemsEarned > 0 && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 mb-4 text-emerald-700 font-black">
            💎 +{gemsEarned} gemmes
          </div>
        )}

        {leveledUp && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-3 mb-4 text-yellow-800 font-black text-lg"
          >
            🎉 Niveau supérieur débloqué !
          </motion.div>
        )}

        {newBadges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-purple-100 border-2 border-purple-300 rounded-2xl p-3 mb-4 text-purple-800 font-black"
          >
            {badge.icon} Badge débloqué : {badge.name}
          </motion.div>
        ))}

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onReplay}
            className="flex-1 py-3.5 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
          >
            🔄 Rejouer
          </motion.button>
          <Link href="/" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-3.5 rounded-2xl font-black text-gray-600 bg-gray-100 text-lg"
            >
              🏠 Accueil
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
