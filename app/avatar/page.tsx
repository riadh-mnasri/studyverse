"use client";
import { motion } from "framer-motion";
import { useGameState, updateGameState } from "@/lib/storage";
import { purchaseCosmetic } from "@/lib/gameState";
import { COSMETICS } from "@/lib/avatars";
import { sounds } from "@/lib/sounds";
import AvatarPreview from "@/components/AvatarPreview";
import NavBar from "@/components/NavBar";
import type { CosmeticItem } from "@/lib/types";

const SLOT_LABELS: Record<CosmeticItem["slot"], string> = {
  base: "Personnage",
  hat: "Chapeau",
  outfit: "Tenue",
  accessory: "Accessoire",
};

export default function AvatarPage() {
  const [gameState] = useGameState();

  function handleBuyOrEquip(item: CosmeticItem) {
    const owned = gameState.unlockedCosmetics.includes(item.id);
    if (!owned) {
      if (gameState.gems < item.cost) return;
      sounds.coin();
      updateGameState((s) => purchaseCosmetic(s, item.id, item.cost));
    }
    updateGameState((s) => ({ ...s, equippedAvatar: { ...s.equippedAvatar, [item.slot]: item.id } }));
  }

  const slots: CosmeticItem["slot"][] = ["base", "hat", "outfit", "accessory"];

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 pt-6 pb-24">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-5">
        <h1 className="text-3xl font-black text-white text-center drop-shadow">🧑 Mon avatar</h1>

        <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-3 card-shadow">
          <AvatarPreview loadout={gameState.equippedAvatar} />
          <div className="bg-emerald-100 text-emerald-700 font-black px-4 py-1.5 rounded-full text-sm">
            💎 {gameState.gems} gemmes
          </div>
        </div>

        {slots.map((slot) => (
          <div key={slot} className="bg-white/95 rounded-3xl p-4 card-shadow">
            <h2 className="font-black text-gray-700 mb-3">{SLOT_LABELS[slot]}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {COSMETICS.filter((c) => c.slot === slot).map((item) => {
                const owned = gameState.unlockedCosmetics.includes(item.id);
                const equipped = gameState.equippedAvatar[slot] === item.id;
                const affordable = gameState.gems >= item.cost;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleBuyOrEquip(item)}
                    disabled={!owned && !affordable}
                    className={`rounded-2xl p-3 flex flex-col items-center gap-1 border-2 transition-colors ${
                      equipped
                        ? "border-indigo-500 bg-indigo-50"
                        : owned
                          ? "border-gray-200 bg-gray-50 hover:border-indigo-300"
                          : affordable
                            ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
                            : "border-gray-100 bg-gray-50 opacity-40"
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                    {!owned && <span className="text-xs font-black text-emerald-600">💎{item.cost}</span>}
                    {equipped && <span className="text-xs font-black text-indigo-600">Équipé</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <NavBar />
    </main>
  );
}
