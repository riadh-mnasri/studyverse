import { getCosmetic } from "@/lib/avatars";
import type { AvatarLoadout } from "@/lib/types";

interface Props {
  loadout: AvatarLoadout;
  size?: "sm" | "lg";
}

export default function AvatarPreview({ loadout, size = "lg" }: Props) {
  const base = getCosmetic(loadout.base);
  const hat = loadout.hat ? getCosmetic(loadout.hat) : undefined;
  const outfit = loadout.outfit ? getCosmetic(loadout.outfit) : undefined;
  const accessory = loadout.accessory ? getCosmetic(loadout.accessory) : undefined;

  const dim = size === "lg" ? "w-32 h-32 text-6xl" : "w-16 h-16 text-3xl";

  return (
    <div
      className={`relative ${dim} rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner shrink-0`}
    >
      <span>{base?.emoji ?? "🧑"}</span>
      {outfit && <span className="absolute bottom-0 right-0 text-2xl">{outfit.emoji}</span>}
      {hat && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">{hat.emoji}</span>}
      {accessory && <span className="absolute bottom-0 left-0 text-xl">{accessory.emoji}</span>}
    </div>
  );
}
