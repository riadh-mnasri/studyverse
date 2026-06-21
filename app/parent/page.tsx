"use client";
import { motion } from "framer-motion";
import { useGameState } from "@/lib/storage";
import { SUBJECTS } from "@/lib/content";
import { RANKS, rankForTotalXp } from "@/lib/xp";
import { BADGES } from "@/lib/badges";
import { localDateISO } from "@/lib/streak";
import NavBar from "@/components/NavBar";

function AccuracyRing({ percent, color }: { percent: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width="72" height="72" className="rotate-[-90deg]">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <motion.circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <text
        x="36"
        y="36"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="800"
        fill={color}
        style={{ transform: "rotate(90deg)", transformOrigin: "36px 36px" }}
      >
        {percent}%
      </text>
    </svg>
  );
}

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(localDateISO(d));
  }
  return days;
}

export default function ParentPage() {
  const [gameState] = useGameState();
  const rank = rankForTotalXp(gameState.totalXp);
  const days = last7Days();
  const maxQuestions = Math.max(
    1,
    ...days.map((d) => gameState.history.find((h) => h.dateISO === d)?.questionsAnswered ?? 0),
  );

  return (
    <main className="flex-1 flex flex-col bg-gray-50 px-4 pt-6 pb-24">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-black text-gray-800">👀 Suivi de la progression</h1>
          <p className="text-gray-400 font-semibold text-sm">
            Pour t&apos;aider à encourager, pas pour contrôler.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 card-shadow grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Rang</div>
            <div className="text-xl font-black text-gray-800">
              {rank.icon} {rank.title}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">XP total</div>
            <div className="text-xl font-black text-gray-800">{gameState.totalXp}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Série actuelle</div>
            <div className="text-xl font-black text-gray-800">🔥 {gameState.streak.current} j</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Meilleure série</div>
            <div className="text-xl font-black text-gray-800">{gameState.streak.longest} j</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Badges</div>
            <div className="text-xl font-black text-gray-800">
              {gameState.badges.length}/{BADGES.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Gemmes gagnées</div>
            <div className="text-xl font-black text-gray-800">💎 {gameState.gems}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 card-shadow">
          <h2 className="font-black text-gray-700 mb-3">Activité des 7 derniers jours</h2>
          <div className="flex items-end justify-between gap-2 h-24">
            {days.map((d) => {
              const log = gameState.history.find((h) => h.dateISO === d);
              const count = log?.questionsAnswered ?? 0;
              const height = count > 0 ? Math.max(10, (count / maxQuestions) * 100) : 4;
              const label = new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short" });
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end h-20">
                    <div
                      className={`w-full rounded-t-lg ${count > 0 ? "bg-indigo-400" : "bg-gray-200"}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-bold capitalize">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 card-shadow flex flex-col gap-4">
          <h2 className="font-black text-gray-700">Par matière</h2>
          {SUBJECTS.map((subject) => {
            const progress = gameState.subjects[subject.id];
            const totalAnswered = Object.values(progress?.chapterProgress ?? {}).reduce(
              (a, c) => a + c.totalAnswered,
              0,
            );
            const totalCorrect = Object.values(progress?.chapterProgress ?? {}).reduce(
              (a, c) => a + c.totalCorrect,
              0,
            );
            const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
            const masteredCount = subject.chapters.filter(
              (c) => progress?.chapterProgress[c.id]?.mastered,
            ).length;

            return (
              <div key={subject.id} className="flex items-center gap-4">
                <AccuracyRing percent={accuracy} color="#6366f1" />
                <div className="flex-1">
                  <div className="font-bold text-gray-700">
                    {subject.icon} {subject.name}
                  </div>
                  <div className="text-xs text-gray-400 font-semibold">
                    {masteredCount}/{subject.chapters.length} chapitres maîtrisés · {totalAnswered} questions
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 text-center">
          Prochain rang : {RANKS.find((r) => r.minTotalXp > gameState.totalXp)?.title ?? "rang maximum atteint"}
        </p>
      </div>
      <NavBar />
    </main>
  );
}
