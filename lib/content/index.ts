import { maths4eme } from "./maths-4eme";
import { francais4eme } from "./francais-4eme";
import { codeIntro } from "./code-intro";
import type { Subject, Chapter } from "../types";

export const SUBJECTS: Subject[] = [maths4eme, francais4eme, codeIntro];

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getChapter(subjectId: string, chapterId: string): Chapter | undefined {
  return getSubject(subjectId)?.chapters.find((c) => c.id === chapterId);
}
