import { maths4eme } from "./maths-4eme";
import { physiqueChimie } from "./physique-chimie";
import { francais4eme } from "./francais-4eme";
import { codeIntro } from "./code-intro";
import { svt } from "./svt";
import { techno } from "./techno";
import { anglais } from "./anglais";
import { chinois } from "./chinois";
import { allemand } from "./allemand";
import type { Subject, Chapter } from "../types";

export const SUBJECTS: Subject[] = [
  maths4eme,
  physiqueChimie,
  francais4eme,
  codeIntro,
  svt,
  techno,
  anglais,
  chinois,
  allemand,
];

// Always present in the daily loop — the steady habit anchors.
export const CORE_DAILY_SUBJECT_IDS = ["maths-4eme", "francais-4eme"];

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getChapter(subjectId: string, chapterId: string): Chapter | undefined {
  return getSubject(subjectId)?.chapters.find((c) => c.id === chapterId);
}
