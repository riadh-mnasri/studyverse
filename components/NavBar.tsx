"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const ITEMS = [
  { href: "/", label: "Accueil", emoji: "🏠" },
  { href: "/matieres", label: "Matières", emoji: "📚" },
  { href: "/badges", label: "Badges", emoji: "🏅" },
  { href: "/avatar", label: "Avatar", emoji: "🧑" },
  { href: "/parent", label: "Parent", emoji: "👀" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-8 inset-x-0 z-40 flex justify-center px-2 pointer-events-none">
      <div className="flex items-center gap-1 bg-white/95 backdrop-blur rounded-2xl shadow-xl px-2 py-1.5 pointer-events-auto">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="contents">
              <motion.span
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  active ? "bg-indigo-100 text-indigo-700" : "text-gray-500 active:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
