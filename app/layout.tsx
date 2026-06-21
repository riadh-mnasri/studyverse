import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studyverse — Apprends, progresse, deviens Légende",
  description:
    "Studyverse est une application ludique pour réviser les maths, le français et le code (Scratch/Python) niveau 4ème, en gagnant XP, badges et récompenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nunito.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-nunito), sans-serif" }}
      >
        {children}
        <footer
          className="fixed bottom-0 left-0 right-0 text-center py-1.5 text-xs font-bold z-50"
          style={{
            background: "rgba(0,0,0,0.45)",
            color: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(6px)",
          }}
        >
          © {new Date().getFullYear()} Riadh MNASRI — Studyverse
        </footer>
      </body>
    </html>
  );
}
