import { RANKS, rankForTotalXp } from "@/lib/xp";

interface Props {
  totalXp: number;
}

export default function RankBanner({ totalXp }: Props) {
  const rank = rankForTotalXp(totalXp);
  const nextRank = RANKS.find((r) => r.minTotalXp > totalXp);

  return (
    <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3 text-white">
      <span className="text-3xl">{rank.icon}</span>
      <div>
        <div className="font-black leading-tight">{rank.title}</div>
        <div className="text-xs text-white/70 font-semibold">
          {nextRank
            ? `${totalXp - rank.minTotalXp}/${nextRank.minTotalXp - rank.minTotalXp} XP vers ${nextRank.title}`
            : "Rang maximum atteint !"}
        </div>
      </div>
    </div>
  );
}
