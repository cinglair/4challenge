"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gerarDesafioPorNivelAsync, limparCache } from "@/lib/generator";
import { validarExpressao } from "@/lib/validator";
import type { Desafio } from "@/lib/desafios-db";
import BackgroundSVG from "./BackgroundSVG";
import Navbar from "./Navbar";
import MathInputField, { type MathInputHandle } from "./MathInputField";
import MathDisplay from "./MathDisplay";

export type Dificuldade = "facil" | "medio" | "dificil";

const NIVEL_FALLBACK: Record<Dificuldade, number> = {
  facil: 2,
  medio: 5,
  dificil: 8,
};

const PROXIMA_ROTA: Record<Dificuldade, string | null> = {
  facil: "/medio",
  medio: "/dificil",
  dificil: null,
};

const LABEL: Record<Dificuldade, string> = {
  facil: "⭐ Fácil",
  medio: "⭐⭐ Médio",
  dificil: "⭐⭐⭐ Difícil",
};

interface Tema {
  cardBg: string;
  cardBorder: string;
  titleColor: string;
  titleEmoji: string;
  subtitleColor: string;
  infoBg: string;
  infoText: string;
  digitBtn: string;
  operatorBtn: string;
  advancedBtn: string;
  parenBtn: string;
  deleteBtn: string;
  clearBtn: string;
  validateBtn: string;
  displayBg: string;
  displayBorder: string;
  displayText: string;
  footerText: string;
  fontFamily: string;
}

const TEMAS: Record<Dificuldade, Tema> = {
  facil: {
    cardBg: "bg-white/80 backdrop-blur-sm",
    cardBorder: "border-2 border-emerald-200",
    titleColor: "text-emerald-700",
    titleEmoji: "🌿",
    subtitleColor: "text-emerald-500",
    infoBg: "bg-emerald-50",
    infoText: "text-emerald-700",
    digitBtn: "bg-emerald-400 hover:bg-emerald-500",
    operatorBtn: "bg-sky-400 hover:bg-sky-500",
    advancedBtn: "bg-teal-300 hover:bg-teal-400",
    parenBtn: "bg-emerald-300 hover:bg-emerald-400",
    deleteBtn: "bg-rose-300 hover:bg-rose-400",
    clearBtn: "bg-red-300 hover:bg-red-400",
    validateBtn: "bg-emerald-500 hover:bg-emerald-600",
    displayBg: "bg-emerald-50/60",
    displayBorder: "border-emerald-200",
    displayText: "text-emerald-900",
    footerText: "text-emerald-400",
    fontFamily: "font-sans",
  },
  medio: {
    cardBg: "bg-white/80 backdrop-blur-sm",
    cardBorder: "border-2 border-sky-200",
    titleColor: "text-sky-700",
    titleEmoji: "⛵",
    subtitleColor: "text-sky-500",
    infoBg: "bg-sky-50",
    infoText: "text-sky-700",
    digitBtn: "bg-sky-400 hover:bg-sky-500",
    operatorBtn: "bg-blue-400 hover:bg-blue-500",
    advancedBtn: "bg-cyan-300 hover:bg-cyan-400",
    parenBtn: "bg-sky-300 hover:bg-sky-400",
    deleteBtn: "bg-rose-300 hover:bg-rose-400",
    clearBtn: "bg-red-300 hover:bg-red-400",
    validateBtn: "bg-sky-600 hover:bg-sky-700",
    displayBg: "bg-sky-50/60",
    displayBorder: "border-sky-200",
    displayText: "text-sky-900",
    footerText: "text-sky-400",
    fontFamily: "font-sans",
  },
  dificil: {
    cardBg: "bg-white/80 backdrop-blur-sm",
    cardBorder: "border-2 border-violet-200",
    titleColor: "text-violet-700",
    titleEmoji: "🌄",
    subtitleColor: "text-violet-500",
    infoBg: "bg-violet-50",
    infoText: "text-violet-700",
    digitBtn: "bg-violet-400 hover:bg-violet-500",
    operatorBtn: "bg-purple-400 hover:bg-purple-500",
    advancedBtn: "bg-indigo-300 hover:bg-indigo-400",
    parenBtn: "bg-violet-300 hover:bg-violet-400",
    deleteBtn: "bg-rose-300 hover:bg-rose-400",
    clearBtn: "bg-red-300 hover:bg-red-400",
    validateBtn: "bg-violet-600 hover:bg-violet-700",
    displayBg: "bg-violet-50/60",
    displayBorder: "border-violet-200",
    displayText: "text-violet-900",
    footerText: "text-violet-400",
    fontFamily: "font-sans",
  },
};

function InfoPopover({ desafio, tema }: { desafio: Desafio; tema: Tema }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-9 h-9 rounded-full ${tema.advancedBtn} text-white flex items-center justify-center text-base font-bold shadow`}
        title="Como jogar"
      >
        i
      </button>
      {open && (
        <div
          className={`absolute right-0 top-11 z-50 w-72 p-4 rounded-xl shadow-2xl border-2 ${tema.displayBorder} ${tema.displayBg}`}
        >
          <p className={`text-sm leading-relaxed ${tema.displayText}`}>
            Use o dígito <strong>{desafio.digito}</strong> exatamente{" "}
            <strong>{desafio.quantidade}×</strong> com os operadores{" "}
            <strong>+ − × ÷ ^ ! √</strong> e parênteses <strong>()</strong>{" "}
            para formar o número <strong>{desafio.alvo}</strong>.
          </p>
          <p className={`text-xs mt-2 ${tema.footerText}`}>
            Pressione <strong>ENTER</strong> para validar.
          </p>
        </div>
      )}
    </div>
  );
}

export interface GameProps {
  dificuldade: Dificuldade;
}

export default function Game({ dificuldade }: GameProps) {
  const router = useRouter();
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro" | null;
    mensagem: string;
  }>({ tipo: null, mensagem: "" });
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [montado, setMontado] = useState(false);
  const mathInputRef = useRef<MathInputHandle | null>(null);
  const validarRef = useRef<() => void>(() => {});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        validarRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  const gerarFallback = useCallback(async (): Promise<Desafio> => {
    const nivel = NIVEL_FALLBACK[dificuldade];
    const gerado = await gerarDesafioPorNivelAsync(nivel);
    return { ...gerado, nivel, dificuldade };
  }, [dificuldade]);

  useEffect(() => {
    const inicializar = async () => {
      setMontado(true);
      limparCache();
      try {
        const res = await fetch(`/api/desafios/${dificuldade}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.digito) {
            setDesafio(data as Desafio);
            setCarregando(false);
            return;
          }
        }
      } catch {}
      setDesafio(await gerarFallback());
      setCarregando(false);
    };
    inicializar();
  }, [dificuldade, gerarFallback]);

  const inserirLatex = useCallback((latex: string) => {
    mathInputRef.current?.insert(latex);
    setFeedback({ tipo: null, mensagem: "" });
  }, []);

  const apagar = useCallback(() => {
    mathInputRef.current?.deleteBackward();
    setFeedback({ tipo: null, mensagem: "" });
  }, []);

  const limpar = useCallback(() => {
    mathInputRef.current?.clear();
    setFeedback({ tipo: null, mensagem: "" });
  }, []);

  const moverEsquerda = useCallback(() => mathInputRef.current?.moveLeft(), []);
  const moverDireita = useCallback(() => mathInputRef.current?.moveRight(), []);

  const handleMathInput = useCallback(() => {
    setFeedback({ tipo: null, mensagem: "" });
  }, []);

  const validar = useCallback(() => {
    if (!desafio) return;
    const ascii = mathInputRef.current?.getAscii() ?? "";
    if (!ascii.trim()) {
      setFeedback({ tipo: "erro", mensagem: "Por favor, construa uma expressão." });
      return;
    }
    const resultado = validarExpressao(ascii, desafio.digito, desafio.quantidade, desafio.alvo);
    setFeedback({
      tipo: resultado.valido ? "sucesso" : "erro",
      mensagem: resultado.mensagem,
    });
  }, [desafio]);

  useEffect(() => {
    validarRef.current = validar;
  }, [validar]);

  const tema = TEMAS[dificuldade] ?? TEMAS.facil;
  const proximaRota = PROXIMA_ROTA[dificuldade] ?? null;

  if (!montado || !desafio) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-500 to-purple-600">
        <div className="text-xl text-white">Carregando desafio...</div>
      </div>
    );
  }

  const btn = (extra: string) =>
    `${extra} text-white font-bold py-4 rounded-xl transition disabled:opacity-50 text-xl`;

  return (
    <>
      <BackgroundSVG dificuldade={dificuldade} />
      <Navbar dificuldade={dificuldade} />
      <div className={`min-h-screen flex items-center justify-center p-4 ${tema.fontFamily} relative z-10`}>
        <div className={`${tema.cardBg} ${tema.cardBorder} rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative`}>

          {carregando && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4" />
                <p className="text-white text-xl font-bold">Gerando desafio...</p>
              </div>
            </div>
          )}

          {/* Cabeçalho */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-bold ${tema.titleColor} mb-1`}>
                {tema.titleEmoji} Desafio Matemático
              </h1>
              <span className={`text-sm font-bold ${tema.subtitleColor}`}>
                {LABEL[dificuldade]}
              </span>
            </div>
            <InfoPopover desafio={desafio} tema={tema} />
          </div>

          {/* Info do desafio */}
          <div className={`${tema.infoBg} rounded-xl p-6 mb-6 border-2 ${tema.displayBorder}`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-sm ${tema.subtitleColor} mb-1`}>Dígito</p>
                <p className={`text-4xl font-bold ${tema.infoText}`}>{desafio.digito}</p>
              </div>
              <div>
                <p className={`text-sm ${tema.subtitleColor} mb-1`}>Usar</p>
                <p className={`text-4xl font-bold ${tema.infoText}`}>{desafio.quantidade}×</p>
              </div>
              <div>
                <p className={`text-sm ${tema.subtitleColor} mb-1`}>Alvo</p>
                <p className={`text-4xl font-bold ${tema.infoText}`}>{desafio.alvo}</p>
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="mb-6">
            <label className={`block text-sm font-medium ${tema.infoText} mb-2`}>
              Sua Expressão:
            </label>
            <div className={`w-full px-4 py-3 border-2 ${tema.displayBorder} rounded-lg ${tema.displayBg} ${tema.displayText} min-h-14 flex items-center overflow-x-auto`}>
              <MathInputField
                ref={mathInputRef}
                onInput={handleMathInput}
                digito={desafio.digito}
              />
            </div>
          </div>

          {/* Teclado */}
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2">
              <button tabIndex={-1} onClick={() => inserirLatex("(")} disabled={carregando} className={btn(tema.parenBtn)}>( </button>
              <button tabIndex={-1} onClick={() => inserirLatex(")")} disabled={carregando} className={btn(tema.parenBtn)}>)</button>
              <button tabIndex={-1} onClick={() => inserirLatex("\\sqrt{#?}")} disabled={carregando} className={btn(tema.advancedBtn)}>√</button>
              <button tabIndex={-1} onClick={() => inserirLatex("^{#?}")} disabled={carregando} className={`${tema.advancedBtn} text-white font-bold py-4 rounded-xl transition disabled:opacity-50 text-lg`}>x<sup>y</sup></button>

              <button tabIndex={-1} onClick={() => inserirLatex("!")} disabled={carregando} className={btn(tema.advancedBtn)}>!</button>
              <button tabIndex={-1} onClick={() => inserirLatex(".")} disabled={carregando} className={btn(tema.advancedBtn)}>.</button>
              <button tabIndex={-1} onClick={() => inserirLatex("\\div")} disabled={carregando} className={btn(tema.operatorBtn)}>÷</button>
              <button tabIndex={-1} onClick={() => inserirLatex("\\times")} disabled={carregando} className={btn(tema.operatorBtn)}>×</button>

              <button tabIndex={-1} onClick={() => inserirLatex(desafio.digito.toString())} disabled={carregando} className={`${tema.digitBtn} text-white font-extrabold py-4 rounded-xl transition disabled:opacity-50 text-3xl`}>{desafio.digito}</button>
              <button tabIndex={-1} onClick={() => inserirLatex("+")} disabled={carregando} className={`${tema.operatorBtn} text-white font-bold py-4 rounded-xl transition disabled:opacity-50 text-2xl`}>+</button>
              <button tabIndex={-1} onClick={() => inserirLatex("-")} disabled={carregando} className={`${tema.operatorBtn} text-white font-bold py-4 rounded-xl transition disabled:opacity-50 text-2xl`}>−</button>
              <button tabIndex={-1} onClick={apagar} disabled={carregando} className={btn(tema.deleteBtn)}>⌫</button>

              <button tabIndex={-1} onClick={moverEsquerda} disabled={carregando} className={btn(tema.advancedBtn)}>←</button>
              <button tabIndex={-1} onClick={moverDireita} disabled={carregando} className={btn(tema.advancedBtn)}>→</button>
              <button tabIndex={-1} onClick={limpar} disabled={carregando} className={`${tema.clearBtn} text-white font-bold py-4 rounded-xl transition disabled:opacity-50 text-lg`}>C</button>
              <button tabIndex={-1} onClick={validar} disabled={carregando} className={`${tema.validateBtn} text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide`}>ENTER</button>
            </div>
          </div>

          {/* Feedback */}
          {feedback.tipo && (
            <div className={`p-4 rounded-lg mb-4 border ${feedback.tipo === "sucesso" ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-700"}`}>
              <p className="font-medium">{feedback.mensagem}</p>
              {feedback.tipo === "sucesso" && proximaRota && (
                <button
                  onClick={() => router.push(proximaRota)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition"
                >
                  Próximo Desafio →
                </button>
              )}
              {feedback.tipo === "sucesso" && !proximaRota && (
                <p className="mt-2 font-bold text-yellow-300 text-center">🏆 Você completou todos os desafios!</p>
              )}
            </div>
          )}

          {/* Solução */}
          <div className="text-center">
            <button
              onClick={() => setMostrarSolucao((v) => !v)}
              className={`text-sm ${tema.footerText} underline font-semibold`}
            >
              {mostrarSolucao ? "🙈 Esconder" : "💡 Mostrar"} solução
            </button>
            {mostrarSolucao && (
              <div className={`mt-3 p-3 border-2 ${tema.displayBorder} rounded-lg ${tema.displayBg}`}>
                <p className={`text-sm ${tema.displayText} mb-1`}>Uma solução possível:</p>
                <span className={tema.infoText}>
                  <MathDisplay expressao={desafio.solucao} textColor={tema.infoText} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
