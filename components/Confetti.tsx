"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface Props {
  trigger: boolean;
  type?: "correct" | "levelup" | "win";
}

export default function Confetti({ trigger, type = "correct" }: Props) {
  useEffect(() => {
    if (!trigger) return;

    if (type === "win") {
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#f472b6", "#fb923c", "#60a5fa"] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#a78bfa", "#34d399", "#fbbf24"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else if (type === "levelup") {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ["#fbbf24", "#f59e0b", "#fcd34d", "#ffffff"] });
    } else {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.65 }, colors: ["#f472b6", "#fb923c", "#60a5fa", "#a78bfa", "#34d399"] });
    }
  }, [trigger, type]);

  return null;
}
