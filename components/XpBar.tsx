import { xpProgress } from "@/lib/xp";

interface Props {
  xp: number;
  colorFrom: string;
  colorTo: string;
}

export default function XpBar({ xp, colorFrom, colorTo }: Props) {
  const { level, xpIntoLevel, xpForNextLevel, percent } = xpProgress(xp);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1 text-xs font-bold text-gray-500">
        <span>Niveau {level}</span>
        <span>
          {xpIntoLevel}/{xpForNextLevel} XP
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-2.5 rounded-full bg-gradient-to-r ${colorFrom} ${colorTo}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
