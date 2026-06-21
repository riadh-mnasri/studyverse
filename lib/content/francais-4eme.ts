import type { Subject } from "../types";

export const francais4eme: Subject = {
  id: "francais-4eme",
  name: "Français",
  icon: "📖",
  colorFrom: "from-purple-500",
  colorTo: "to-pink-500",
  chapters: [
    {
      id: "subjonctif-present",
      title: "Le subjonctif présent",
      description: "Conjugaison et emploi du subjonctif",
      icon: "✍️",
      exercises: [
        {
          id: "fr-subj-q01",
          type: "fill-blank",
          prompt: "Il faut que tu ___ (finir) tes devoirs.",
          acceptedAnswers: ["finisses"],
        },
        {
          id: "fr-subj-q02",
          type: "fill-blank",
          prompt: "Je voudrais qu'elle ___ (venir) avec nous.",
          acceptedAnswers: ["vienne"],
        },
        {
          id: "fr-subj-q03",
          type: "qcm",
          prompt: "Quel mode utilise-t-on après « il faut que » ?",
          options: ["L'indicatif", "Le subjonctif", "Le conditionnel", "L'impératif"],
          correctIndex: 1,
        },
        {
          id: "fr-subj-q04",
          type: "fill-blank",
          prompt: "Il faut que nous ___ (être) à l'heure.",
          acceptedAnswers: ["soyons"],
        },
        {
          id: "fr-subj-q05",
          type: "fill-blank",
          prompt: "Il faut que vous ___ (avoir) de la patience.",
          acceptedAnswers: ["ayez"],
        },
        {
          id: "fr-subj-q06",
          type: "fill-blank",
          prompt: "Il faut qu'il ___ (faire) ses devoirs.",
          acceptedAnswers: ["fasse"],
        },
        {
          id: "fr-subj-q07",
          type: "qcm",
          prompt: "Quelle terminaison retrouve-t-on à la 1ère personne du singulier du subjonctif présent pour la plupart des verbes ?",
          options: ["-e", "-es", "-ons", "-ez"],
          correctIndex: 0,
        },
        {
          id: "fr-subj-q08",
          type: "fill-blank",
          prompt: "Bien qu'il ___ (pleuvoir), nous sortirons.",
          acceptedAnswers: ["pleuve"],
        },
        {
          id: "fr-subj-q09",
          type: "true-false",
          prompt: "Le subjonctif présent du verbe « aller » à la 3e personne du singulier est « aille ».",
          correct: true,
        },
        {
          id: "fr-subj-q10",
          type: "fill-blank",
          prompt: "Je souhaite que tu ___ (réussir) ton examen.",
          acceptedAnswers: ["réussisses"],
        },
        {
          id: "fr-subj-q11",
          type: "qcm",
          prompt: "Laquelle de ces expressions n'introduit PAS le subjonctif ?",
          options: ["il faut que", "je pense que", "je veux que", "bien que"],
          correctIndex: 1,
          explanation: "« Je pense que » est suivi de l'indicatif, contrairement aux autres expressions de volonté, de but ou de concession.",
        },
        {
          id: "fr-subj-q12",
          type: "fill-blank",
          prompt: "Il faut que je ___ (savoir) la réponse.",
          acceptedAnswers: ["sache"],
        },
        {
          id: "fr-subj-q13",
          type: "true-false",
          prompt: "Après « avant que », on utilise le subjonctif.",
          correct: true,
        },
        {
          id: "fr-subj-q14",
          type: "fill-blank",
          prompt: "Il faut qu'ils ___ (pouvoir) participer.",
          acceptedAnswers: ["puissent"],
        },
        {
          id: "fr-subj-q15",
          type: "qcm",
          prompt: "Quel est le radical du subjonctif présent du verbe « prendre » pour je/tu/il/ils ?",
          options: ["prend-", "prenn-", "prena-", "pren-"],
          correctIndex: 1,
        },
      ],
    },
  ],
};
