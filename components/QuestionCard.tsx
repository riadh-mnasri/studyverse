"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/lib/types";
import { sounds } from "@/lib/sounds";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

// Kahoot-inspired distinct colors for each QCM option
const OPTION_STYLES = [
  { base: "from-[#1368CE] to-[#0e52a8]", hover: "hover:from-[#1a7de8] hover:to-[#1368CE]", letter: "A" },
  { base: "from-[#D89E00] to-[#b07f00]", hover: "hover:from-[#f0b000] hover:to-[#D89E00]", letter: "B" },
  { base: "from-[#D43B47] to-[#b02d38]", hover: "hover:from-[#e8444f] hover:to-[#D43B47]", letter: "C" },
  { base: "from-[#26890C] to-[#1e6e0a]", hover: "hover:from-[#2ea00f] hover:to-[#26890C]", letter: "D" },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function QuestionCard({ exercise, onAnswer }: Props) {
  const isCode = exercise.prompt.includes("\n");

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full bg-white rounded-3xl p-6 text-center card-shadow"
      >
        <p
          className={
            isCode
              ? "text-base font-mono text-gray-800 leading-relaxed whitespace-pre-wrap text-left bg-gray-50 rounded-xl p-3"
              : "text-2xl font-extrabold text-gray-800 leading-relaxed"
          }
        >
          {exercise.prompt}
        </p>
      </motion.div>

      <AnswerArea exercise={exercise} onAnswer={onAnswer} />
    </div>
  );
}

function AnswerArea({ exercise, onAnswer }: Props) {
  switch (exercise.type) {
    case "qcm":
      return <QcmAnswer exercise={exercise} onAnswer={onAnswer} />;
    case "true-false":
      return <TrueFalseAnswer exercise={exercise} onAnswer={onAnswer} />;
    case "fill-blank":
      return <FillBlankAnswer exercise={exercise} onAnswer={onAnswer} />;
    case "matching":
      return <MatchingAnswer exercise={exercise} onAnswer={onAnswer} />;
  }
}

function QcmAnswer({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "qcm" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleClick(idx: number) {
    if (selected !== null) return;
    sounds.click();
    setSelected(idx);
    const correct = idx === exercise.correctIndex;
    setTimeout(() => onAnswer(correct), 0);
  }

  return (
    <div className="w-full grid grid-cols-1 gap-3">
      {exercise.options.map((option, idx) => {
        const style = OPTION_STYLES[idx % OPTION_STYLES.length];
        let override = "";
        if (selected !== null) {
          if (idx === exercise.correctIndex) override = "from-green-500 to-green-600 animate-pulse-green";
          else if (idx === selected) override = "from-red-500 to-red-600 animate-shake";
          else override = "opacity-40 from-gray-500 to-gray-600";
        }

        return (
          <motion.button
            key={idx}
            whileHover={selected === null ? { scale: 1.02, x: 4 } : {}}
            whileTap={selected === null ? { scale: 0.97 } : {}}
            onClick={() => handleClick(idx)}
            disabled={selected !== null}
            className={`w-full p-4 rounded-2xl text-white font-black text-lg text-left flex items-center gap-4 bg-gradient-to-r transition-all duration-150 ${
              override || `${style.base} ${style.hover}`
            } disabled:cursor-default shadow-lg`}
          >
            <span className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center text-sm font-black shrink-0">
              {style.letter}
            </span>
            <span className="flex-1">{option}</span>
            {selected !== null && idx === exercise.correctIndex && <span className="text-2xl">✅</span>}
            {selected !== null && idx === selected && idx !== exercise.correctIndex && (
              <span className="text-2xl">❌</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function TrueFalseAnswer({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "true-false" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);

  function handleClick(value: boolean) {
    if (selected !== null) return;
    sounds.click();
    setSelected(value);
    setTimeout(() => onAnswer(value === exercise.correct), 0);
  }

  return (
    <div className="w-full grid grid-cols-2 gap-3">
      {[true, false].map((value) => {
        const label = value ? "✅ Vrai" : "❌ Faux";
        let override = "from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500";
        if (selected !== null) {
          if (value === exercise.correct) override = "from-green-500 to-green-600 animate-pulse-green";
          else if (value === selected) override = "from-red-500 to-red-600 animate-shake";
          else override = "opacity-40 from-gray-500 to-gray-600";
        }
        return (
          <motion.button
            key={String(value)}
            whileHover={selected === null ? { scale: 1.03 } : {}}
            whileTap={selected === null ? { scale: 0.96 } : {}}
            onClick={() => handleClick(value)}
            disabled={selected !== null}
            className={`p-5 rounded-2xl text-white font-black text-xl bg-gradient-to-r ${override} disabled:cursor-default shadow-lg`}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

function FillBlankAnswer({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "fill-blank" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const accepted = useMemo(
    () => exercise.acceptedAnswers.map(normalize),
    [exercise.acceptedAnswers],
  );

  function handleSubmit() {
    if (submitted || value.trim() === "") return;
    setSubmitted(true);
    const correct = accepted.includes(normalize(value));
    setTimeout(() => onAnswer(correct), 0);
  }

  const isCorrect = submitted && accepted.includes(normalize(value));

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={submitted}
        placeholder="Ta réponse..."
        autoFocus
        className={`w-full p-4 rounded-2xl border-2 text-lg font-bold text-center outline-none ${
          submitted
            ? isCorrect
              ? "border-green-500 bg-green-50 text-green-700 animate-pulse-green"
              : "border-red-500 bg-red-50 text-red-700 animate-shake"
            : "border-gray-300 focus:border-indigo-500"
        }`}
      />
      {submitted && !isCorrect && (
        <p className="text-sm font-bold text-gray-500">
          Réponse attendue : {exercise.acceptedAnswers[0]}
        </p>
      )}
      {!submitted && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-lg"
        >
          Valider
        </motion.button>
      )}
    </div>
  );
}

function MatchingAnswer({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "matching" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const rightOptions = useMemo(() => shuffle(exercise.pairs.map((p) => p.right)), [exercise]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const matchedRights = new Set(Object.values(matches));

  function pickLeft(left: string) {
    if (submitted || matches[left]) return;
    setSelectedLeft(left);
  }

  function pickRight(right: string) {
    if (submitted || !selectedLeft || matchedRights.has(right)) return;
    sounds.click();
    setMatches((m) => ({ ...m, [selectedLeft]: right }));
    setSelectedLeft(null);
  }

  function handleSubmit() {
    if (submitted || Object.keys(matches).length < exercise.pairs.length) return;
    setSubmitted(true);
    const allCorrect = exercise.pairs.every((p) => matches[p.left] === p.right);
    setTimeout(() => onAnswer(allCorrect), 0);
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {exercise.pairs.map((p) => (
            <button
              key={p.left}
              onClick={() => pickLeft(p.left)}
              disabled={submitted}
              className={`p-3 rounded-xl font-bold text-sm text-left transition-all ${
                matches[p.left]
                  ? submitted
                    ? matches[p.left] === p.right
                      ? "bg-green-100 border-2 border-green-500 text-green-700"
                      : "bg-red-100 border-2 border-red-500 text-red-700"
                    : "bg-indigo-100 border-2 border-indigo-400 text-indigo-700"
                  : selectedLeft === p.left
                    ? "bg-indigo-500 text-white border-2 border-indigo-600"
                    : "bg-gray-100 border-2 border-gray-200 text-gray-700"
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rightOptions.map((right) => (
            <button
              key={right}
              onClick={() => pickRight(right)}
              disabled={submitted || matchedRights.has(right)}
              className={`p-3 rounded-xl font-bold text-sm text-left transition-all ${
                matchedRights.has(right)
                  ? "bg-indigo-50 border-2 border-indigo-200 text-indigo-400 opacity-60"
                  : "bg-gray-100 border-2 border-gray-200 text-gray-700 hover:border-indigo-400"
              }`}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
      {!submitted && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          disabled={Object.keys(matches).length < exercise.pairs.length}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-lg disabled:opacity-40"
        >
          Valider
        </motion.button>
      )}
    </div>
  );
}
