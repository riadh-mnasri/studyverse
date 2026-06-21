import type { StreakState } from "@/lib/types";

interface Props {
  streak: StreakState;
}

export default function StreakBadge({ streak }: Props) {
  return (
    <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2 text-white">
      <span className="text-3xl">🔥</span>
      <div>
        <div className="font-black leading-tight">{streak.current} jour{streak.current === 1 ? "" : "s"}</div>
        <div className="text-xs text-white/70 font-semibold">Record : {streak.longest} jours</div>
      </div>
    </div>
  );
}
