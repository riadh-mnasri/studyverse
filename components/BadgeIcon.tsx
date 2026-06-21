import type { Badge } from "@/lib/types";

interface Props {
  badge: Badge;
  unlocked: boolean;
}

export default function BadgeIcon({ badge, unlocked }: Props) {
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col items-center text-center gap-1 ${
        unlocked ? "bg-white card-shadow" : "bg-white/40"
      }`}
    >
      <span className={`text-4xl ${unlocked ? "" : "opacity-25 grayscale"}`}>{badge.icon}</span>
      <div className={`font-black text-sm ${unlocked ? "text-gray-800" : "text-white/50"}`}>{badge.name}</div>
      <div className={`text-xs ${unlocked ? "text-gray-400" : "text-white/40"}`}>{badge.description}</div>
    </div>
  );
}
