import type { CosmeticItem } from "./types";

export const GEMS_PER_COMPLETED_QUIZ = 5; // any quiz finished, regardless of score
export const GEMS_PER_PERFECT_QUIZ = 15;
export const GEMS_PER_BADGE_UNLOCK = 20;

// Earned only through play — never purchasable with real money.
export const COSMETICS: CosmeticItem[] = [
  { id: "base-default", slot: "base", name: "Aventurier", emoji: "🧑", cost: 0 },
  { id: "base-robot", slot: "base", name: "Robot", emoji: "🤖", cost: 30 },
  { id: "base-ninja", slot: "base", name: "Ninja", emoji: "🥷", cost: 60 },
  { id: "base-mage", slot: "base", name: "Mage", emoji: "🧙", cost: 90 },

  { id: "hat-cap", slot: "hat", name: "Casquette", emoji: "🧢", cost: 20 },
  { id: "hat-crown", slot: "hat", name: "Couronne", emoji: "👑", cost: 150 },
  { id: "hat-grad", slot: "hat", name: "Toque de diplômé", emoji: "🎓", cost: 70 },
  { id: "hat-party", slot: "hat", name: "Chapeau de fête", emoji: "🎉", cost: 40 },

  { id: "outfit-cape", slot: "outfit", name: "Cape de héros", emoji: "🦸", cost: 80 },
  { id: "outfit-armor", slot: "outfit", name: "Armure", emoji: "🛡️", cost: 110 },
  { id: "outfit-labcoat", slot: "outfit", name: "Blouse de scientifique", emoji: "🥼", cost: 50 },

  { id: "accessory-sword", slot: "accessory", name: "Épée", emoji: "⚔️", cost: 100 },
  { id: "accessory-glasses", slot: "accessory", name: "Lunettes", emoji: "🤓", cost: 25 },
  { id: "accessory-wand", slot: "accessory", name: "Baguette magique", emoji: "🪄", cost: 120 },
];

export function getCosmetic(id: string): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.id === id);
}
