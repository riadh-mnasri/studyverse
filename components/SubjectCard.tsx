"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Subject } from "@/lib/types";

interface Props {
  subject: Subject;
  chapterTitle: string;
  completed: boolean;
  score?: number;
  href: string;
}

export default function SubjectCard({ subject, chapterTitle, completed, score, href }: Props) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full rounded-3xl p-5 flex items-center gap-4 bg-gradient-to-r ${subject.colorFrom} ${subject.colorTo} text-white shadow-lg card-shadow relative overflow-hidden`}
      >
        <span className="text-4xl">{subject.icon}</span>
        <div className="flex-1">
          <div className="font-black text-lg">{subject.name}</div>
          <div className="text-sm text-white/80 font-semibold">{chapterTitle}</div>
          <div className="text-xs text-white/60 font-bold mt-0.5">10 questions · ~5 min</div>
        </div>
        {completed ? (
          <div className="flex flex-col items-center">
            <span className="text-3xl">✅</span>
            {typeof score === "number" && <span className="text-xs font-black">{score}%</span>}
          </div>
        ) : (
          <span className="text-2xl">▶️</span>
        )}
      </motion.div>
    </Link>
  );
}
