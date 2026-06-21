"use client";
import { useGameState } from "@/lib/storage";
import { BADGES } from "@/lib/badges";
import BadgeIcon from "@/components/BadgeIcon";
import NavBar from "@/components/NavBar";

export default function BadgesPage() {
  const [gameState] = useGameState();

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">
        <h1 className="text-3xl font-black text-white text-center drop-shadow mb-1">🏅 Mes badges</h1>
        <p className="text-white/80 font-semibold text-center text-sm mb-2">
          {gameState.badges.length}/{BADGES.length} débloqués
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((badge) => (
            <BadgeIcon key={badge.id} badge={badge} unlocked={gameState.badges.includes(badge.id)} />
          ))}
        </div>
      </div>
      <NavBar />
    </main>
  );
}
