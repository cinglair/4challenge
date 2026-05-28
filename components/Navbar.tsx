"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Dificuldade } from "./Game";

const ROTAS: Record<Dificuldade, string> = {
  facil: "/",
  medio: "/medio",
  dificil: "/dificil",
};

const OPCOES: { key: Dificuldade; emoji: string; label: string }[] = [
  { key: "facil",  emoji: "🌿", label: "Fácil"  },
  { key: "medio",  emoji: "⛵", label: "Médio"  },
  { key: "dificil", emoji: "🌄", label: "Difícil" },
];

export default function Navbar({ dificuldade }: { dificuldade: Dificuldade }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const atual = OPCOES.find((o) => o.key === dificuldade)!;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Pill colapsada — mostra só a dificuldade atual */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-medium text-gray-600 hover:bg-white/90 transition-all"
      >
        <span>{atual.emoji}</span>
        <span>{atual.label}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6" fill="none"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Menu expandido */}
      <div
        className={`mt-2 flex gap-1 px-2 py-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {OPCOES.map(({ key, emoji, label }) => (
          <button
            key={key}
            onClick={() => { router.push(ROTAS[key]); setOpen(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              key === dificuldade
                ? "bg-gray-100 text-gray-800"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
