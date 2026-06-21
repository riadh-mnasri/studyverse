"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="sticky bottom-7 mx-auto mb-2 mt-6 w-fit max-w-full px-2">
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-2xl shadow-xl px-2 py-1.5">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                active ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
