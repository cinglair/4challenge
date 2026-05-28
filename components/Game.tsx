"use client";

import { useState, useEffect } from "react";
import {
  gerarDesafioPorNivel,
  gerarDesafioPorNivelAsync,
  limparCache,
  type Desafio,
} from "@/lib/generator";
import { validarExpressao } from "@/lib/validator";
import BackgroundCanvas from "./BackgroundCanvas";

// Temas por nível
interface Tema {
  cardBg: string;
  cardBorder: string;
  titleColor: string;
  titleEmoji: string;
  subtitleColor: string;
  infoBg: string;
  infoText: string;
  instructionBg: string;
  instructionBorder: string;
  instructionText: string;
  digitBtn: string;
  operatorBtn: string;
  advancedBtn: string;
  parenBtn: string;
  deleteBtn: string;
  clearBtn: string;
  validateBtn: string;
  newBtn: string;
  levelBtnActive: string;
  levelBtnInactive: string;
  displayBg: string;
  displayBorder: string;
  displayText: string;
  footerText: string;
  temaTexto: string;
  fontFamily: string;
}

function obterTema(nivel: number): Tema {
  switch (nivel) {
    case 1:
      return {
        cardBg: "bg-pink-50/90 backdrop-blur-sm",
        cardBorder: "border-4 border-pink-300",
        titleColor: "text-pink-600",
        titleEmoji: "🧸",
        subtitleColor: "text-pink-500",
        infoBg: "bg-gradient-to-r from-pink-100 to-purple-100",
        infoText: "text-pink-600",
        instructionBg: "bg-pink-100",
        instructionBorder: "border-pink-400",
        instructionText: "text-pink-800",
        digitBtn: "bg-pink-400 hover:bg-pink-500",
        operatorBtn: "bg-purple-400 hover:bg-purple-500",
        advancedBtn: "bg-blue-400 hover:bg-blue-500",
        parenBtn: "bg-indigo-400 hover:bg-indigo-500",
        deleteBtn: "bg-orange-400 hover:bg-orange-500",
        clearBtn: "bg-red-400 hover:bg-red-500",
        validateBtn: "bg-pink-500 hover:bg-pink-600",
        newBtn: "bg-purple-500 hover:bg-purple-600",
        levelBtnActive: "bg-pink-500 text-white",
        levelBtnInactive: "bg-pink-200 text-pink-700 hover:bg-pink-300",
        displayBg: "bg-pink-50",
        displayBorder: "border-pink-300",
        displayText: "text-pink-900",
        footerText: "text-pink-600",
        temaTexto: "🌈 Mundo dos Ursinhos",
        fontFamily: "font-comic",
      };
    case 2:
      return {
        cardBg: "bg-yellow-50/90 backdrop-blur-sm",
        cardBorder: "border-4 border-yellow-400",
        titleColor: "text-orange-600",
        titleEmoji: "🌻",
        subtitleColor: "text-orange-500",
        infoBg: "bg-gradient-to-r from-yellow-100 to-orange-100",
        infoText: "text-orange-600",
        instructionBg: "bg-yellow-100",
        instructionBorder: "border-yellow-500",
        instructionText: "text-orange-800",
        digitBtn: "bg-yellow-500 hover:bg-yellow-600",
        operatorBtn: "bg-orange-500 hover:bg-orange-600",
        advancedBtn: "bg-amber-500 hover:bg-amber-600",
        parenBtn: "bg-yellow-600 hover:bg-yellow-700",
        deleteBtn: "bg-orange-600 hover:bg-orange-700",
        clearBtn: "bg-red-500 hover:bg-red-600",
        validateBtn: "bg-orange-600 hover:bg-orange-700",
        newBtn: "bg-yellow-600 hover:bg-yellow-700",
        levelBtnActive: "bg-orange-500 text-white",
        levelBtnInactive: "bg-yellow-200 text-orange-700 hover:bg-yellow-300",
        displayBg: "bg-yellow-50",
        displayBorder: "border-orange-300",
        displayText: "text-orange-900",
        footerText: "text-orange-600",
        temaTexto: "🌸 Jardim Florido",
        fontFamily: "font-sans",
      };
    case 3:
      return {
        cardBg: "bg-green-50/90 backdrop-blur-sm",
        cardBorder: "border-4 border-green-500",
        titleColor: "text-green-700",
        titleEmoji: "🌿",
        subtitleColor: "text-green-600",
        infoBg: "bg-gradient-to-r from-green-100 to-emerald-100",
        infoText: "text-green-700",
        instructionBg: "bg-green-100",
        instructionBorder: "border-green-500",
        instructionText: "text-green-800",
        digitBtn: "bg-green-500 hover:bg-green-600",
        operatorBtn: "bg-emerald-500 hover:bg-emerald-600",
        advancedBtn: "bg-teal-500 hover:bg-teal-600",
        parenBtn: "bg-lime-600 hover:bg-lime-700",
        deleteBtn: "bg-amber-600 hover:bg-amber-700",
        clearBtn: "bg-red-600 hover:bg-red-700",
        validateBtn: "bg-green-600 hover:bg-green-700",
        newBtn: "bg-emerald-600 hover:bg-emerald-700",
        levelBtnActive: "bg-green-600 text-white",
        levelBtnInactive: "bg-green-200 text-green-800 hover:bg-green-300",
        displayBg: "bg-green-50",
        displayBorder: "border-green-400",
        displayText: "text-green-900",
        footerText: "text-green-700",
        temaTexto: "🌳 Floresta Mágica",
        fontFamily: "font-sans",
      };
    case 4:
      return {
        cardBg: "bg-cyan-50/90 backdrop-blur-sm",
        cardBorder: "border-4 border-blue-400",
        titleColor: "text-blue-700",
        titleEmoji: "🌊",
        subtitleColor: "text-blue-600",
        infoBg: "bg-gradient-to-r from-cyan-100 to-blue-100",
        infoText: "text-blue-700",
        instructionBg: "bg-cyan-100",
        instructionBorder: "border-blue-400",
        instructionText: "text-blue-800",
        digitBtn: "bg-cyan-500 hover:bg-cyan-600",
        operatorBtn: "bg-blue-500 hover:bg-blue-600",
        advancedBtn: "bg-indigo-500 hover:bg-indigo-600",
        parenBtn: "bg-sky-600 hover:bg-sky-700",
        deleteBtn: "bg-orange-500 hover:bg-orange-600",
        clearBtn: "bg-red-500 hover:bg-red-600",
        validateBtn: "bg-blue-600 hover:bg-blue-700",
        newBtn: "bg-cyan-600 hover:bg-cyan-700",
        levelBtnActive: "bg-blue-600 text-white",
        levelBtnInactive: "bg-cyan-200 text-blue-800 hover:bg-cyan-300",
        displayBg: "bg-cyan-50",
        displayBorder: "border-blue-300",
        displayText: "text-blue-900",
        footerText: "text-blue-600",
        temaTexto: "🐋 Oceano Profundo",
        fontFamily: "font-sans",
      };
    case 5:
      return {
        cardBg: "bg-purple-50/90 backdrop-blur-sm",
        cardBorder: "border-4 border-purple-500",
        titleColor: "text-purple-700",
        titleEmoji: "🌅",
        subtitleColor: "text-purple-600",
        infoBg: "bg-gradient-to-r from-purple-100 to-pink-100",
        infoText: "text-purple-700",
        instructionBg: "bg-purple-100",
        instructionBorder: "border-purple-500",
        instructionText: "text-purple-800",
        digitBtn: "bg-purple-500 hover:bg-purple-600",
        operatorBtn: "bg-pink-500 hover:bg-pink-600",
        advancedBtn: "bg-fuchsia-500 hover:bg-fuchsia-600",
        parenBtn: "bg-violet-600 hover:bg-violet-700",
        deleteBtn: "bg-orange-600 hover:bg-orange-700",
        clearBtn: "bg-red-600 hover:bg-red-700",
        validateBtn: "bg-purple-600 hover:bg-purple-700",
        newBtn: "bg-pink-600 hover:bg-pink-700",
        levelBtnActive: "bg-purple-600 text-white",
        levelBtnInactive: "bg-purple-200 text-purple-800 hover:bg-purple-300",
        displayBg: "bg-purple-50",
        displayBorder: "border-purple-400",
        displayText: "text-purple-900",
        footerText: "text-purple-600",
        temaTexto: "🌇 Crepúsculo",
        fontFamily: "font-sans",
      };
    case 6:
      return {
        cardBg: "bg-slate-800/90 backdrop-blur-sm",
        cardBorder: "border-4 border-purple-500",
        titleColor: "text-cyan-400",
        titleEmoji: "⚡",
        subtitleColor: "text-purple-400",
        infoBg: "bg-gradient-to-r from-slate-700 to-purple-800",
        infoText: "text-cyan-400",
        instructionBg: "bg-slate-700",
        instructionBorder: "border-cyan-500",
        instructionText: "text-cyan-300",
        digitBtn: "bg-cyan-600 hover:bg-cyan-500",
        operatorBtn: "bg-purple-600 hover:bg-purple-500",
        advancedBtn: "bg-pink-600 hover:bg-pink-500",
        parenBtn: "bg-indigo-600 hover:bg-indigo-500",
        deleteBtn: "bg-orange-600 hover:bg-orange-500",
        clearBtn: "bg-red-600 hover:bg-red-500",
        validateBtn: "bg-cyan-600 hover:bg-cyan-500",
        newBtn: "bg-purple-600 hover:bg-purple-500",
        levelBtnActive: "bg-cyan-500 text-black",
        levelBtnInactive: "bg-slate-700 text-cyan-400 hover:bg-slate-600",
        displayBg: "bg-slate-900",
        displayBorder: "border-cyan-500",
        displayText: "text-cyan-300",
        footerText: "text-purple-400",
        temaTexto: "🔮 Neon Cyberpunk",
        fontFamily: "font-mono",
      };
    case 7:
      return {
        cardBg: "bg-gray-800/90 backdrop-blur-sm",
        cardBorder: "border-4 border-gray-600",
        titleColor: "text-gray-300",
        titleEmoji: "🌫️",
        subtitleColor: "text-gray-400",
        infoBg: "bg-gradient-to-r from-gray-700 to-gray-800",
        infoText: "text-gray-300",
        instructionBg: "bg-gray-700",
        instructionBorder: "border-gray-500",
        instructionText: "text-gray-300",
        digitBtn: "bg-gray-600 hover:bg-gray-500",
        operatorBtn: "bg-gray-700 hover:bg-gray-600",
        advancedBtn: "bg-slate-700 hover:bg-slate-600",
        parenBtn: "bg-zinc-700 hover:bg-zinc-600",
        deleteBtn: "bg-orange-700 hover:bg-orange-600",
        clearBtn: "bg-red-700 hover:bg-red-600",
        validateBtn: "bg-gray-600 hover:bg-gray-500",
        newBtn: "bg-gray-700 hover:bg-gray-600",
        levelBtnActive: "bg-gray-500 text-white",
        levelBtnInactive: "bg-gray-700 text-gray-300 hover:bg-gray-600",
        displayBg: "bg-gray-900",
        displayBorder: "border-gray-600",
        displayText: "text-gray-200",
        footerText: "text-gray-400",
        temaTexto: "☁️ Névoa Sombria",
        fontFamily: "font-serif",
      };
    case 8:
      return {
        cardBg: "bg-black/90 backdrop-blur-sm",
        cardBorder: "border-4 border-red-900",
        titleColor: "text-red-600",
        titleEmoji: "🦇",
        subtitleColor: "text-red-700",
        infoBg: "bg-gradient-to-r from-gray-900 to-red-950",
        infoText: "text-red-500",
        instructionBg: "bg-gray-900",
        instructionBorder: "border-red-800",
        instructionText: "text-red-400",
        digitBtn: "bg-red-900 hover:bg-red-800",
        operatorBtn: "bg-gray-800 hover:bg-gray-700",
        advancedBtn: "bg-red-950 hover:bg-red-900",
        parenBtn: "bg-stone-900 hover:bg-stone-800",
        deleteBtn: "bg-orange-900 hover:bg-orange-800",
        clearBtn: "bg-red-800 hover:bg-red-700",
        validateBtn: "bg-red-800 hover:bg-red-700",
        newBtn: "bg-gray-800 hover:bg-gray-700",
        levelBtnActive: "bg-red-700 text-white",
        levelBtnInactive: "bg-gray-900 text-red-600 hover:bg-gray-800",
        displayBg: "bg-black",
        displayBorder: "border-red-800",
        displayText: "text-red-400",
        footerText: "text-red-700",
        temaTexto: "🕷️ Castelo Gótico",
        fontFamily: "font-serif",
      };
    case 9:
      return {
        cardBg: "bg-red-950/90 backdrop-blur-sm",
        cardBorder: "border-4 border-orange-700",
        titleColor: "text-orange-500",
        titleEmoji: "🔥",
        subtitleColor: "text-red-500",
        infoBg: "bg-gradient-to-r from-red-900 to-orange-900",
        infoText: "text-orange-400",
        instructionBg: "bg-red-950",
        instructionBorder: "border-orange-600",
        instructionText: "text-orange-300",
        digitBtn: "bg-orange-700 hover:bg-orange-600",
        operatorBtn: "bg-red-800 hover:bg-red-700",
        advancedBtn: "bg-amber-800 hover:bg-amber-700",
        parenBtn: "bg-red-900 hover:bg-red-800",
        deleteBtn: "bg-orange-800 hover:bg-orange-700",
        clearBtn: "bg-red-700 hover:bg-red-600",
        validateBtn: "bg-orange-700 hover:bg-orange-600",
        newBtn: "bg-red-800 hover:bg-red-700",
        levelBtnActive: "bg-orange-600 text-black",
        levelBtnInactive: "bg-red-950 text-orange-600 hover:bg-red-900",
        displayBg: "bg-black",
        displayBorder: "border-orange-700",
        displayText: "text-orange-300",
        footerText: "text-red-600",
        temaTexto: "🌋 Inferno Flamejante",
        fontFamily: "font-serif",
      };
    case 10:
      return {
        cardBg: "bg-black/95 backdrop-blur-sm",
        cardBorder: "border-4 border-red-600 shadow-2xl shadow-red-900/50",
        titleColor: "text-red-500",
        titleEmoji: "😈",
        subtitleColor: "text-red-600",
        infoBg: "bg-gradient-to-r from-black to-red-950",
        infoText: "text-red-400",
        instructionBg: "bg-black",
        instructionBorder: "border-red-700",
        instructionText: "text-red-300",
        digitBtn: "bg-red-800 hover:bg-red-700 shadow-lg shadow-red-900",
        operatorBtn: "bg-red-950 hover:bg-red-900 shadow-lg shadow-red-950",
        advancedBtn: "bg-black hover:bg-red-950 shadow-lg shadow-black",
        parenBtn: "bg-red-950 hover:bg-black shadow-lg shadow-red-950",
        deleteBtn: "bg-red-900 hover:bg-red-800 shadow-lg shadow-red-950",
        clearBtn: "bg-red-700 hover:bg-red-600 shadow-lg shadow-red-900",
        validateBtn: "bg-red-700 hover:bg-red-600 shadow-xl shadow-red-900",
        newBtn: "bg-black hover:bg-red-950 shadow-xl shadow-black",
        levelBtnActive: "bg-red-600 text-white shadow-lg shadow-red-900",
        levelBtnInactive:
          "bg-black text-red-600 hover:bg-red-950 border border-red-900",
        displayBg: "bg-black",
        displayBorder: "border-red-700 shadow-inner shadow-red-950",
        displayText: "text-red-400",
        footerText: "text-red-700",
        temaTexto: "👹 Reino das Trevas",
        fontFamily: "font-serif",
      };
    default:
      return obterTema(5);
  }
}

export default function Game() {
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [expressao, setExpressao] = useState("");
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro" | null;
    mensagem: string;
  }>({ tipo: null, mensagem: "" });
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [montado, setMontado] = useState(false);
  const [nivel, setNivel] = useState(1);

  // Gera o primeiro desafio apenas no cliente
  useEffect(() => {
    // Limpa o cache para garantir que novos operadores sejam usados
    limparCache();
    const inicializar = async () => {
      setMontado(true);
      const desafioInicial = await gerarDesafioPorNivelAsync(1);
      setDesafio(desafioInicial);
      setCarregando(false);
    };
    inicializar();
  }, []);

  const gerarNovoDesafio = async () => {
    setCarregando(true);
    setExpressao("");
    setFeedback({ tipo: null, mensagem: "" });
    setMostrarSolucao(false);

    // Usa a versão assíncrona para não bloquear a UI
    const novoDesafio = await gerarDesafioPorNivelAsync(nivel);
    setDesafio(novoDesafio);
    setCarregando(false);
  };

  const mudarNivel = async (novoNivel: number) => {
    setNivel(novoNivel);
    setCarregando(true);
    setExpressao("");
    setFeedback({ tipo: null, mensagem: "" });
    setMostrarSolucao(false);

    // Usa a versão assíncrona para não bloquear a UI
    const novoDesafio = await gerarDesafioPorNivelAsync(novoNivel);
    setDesafio(novoDesafio);
    setCarregando(false);
  };

  const adicionarCaractere = (caractere: string) => {
    setExpressao((prev) => prev + caractere);
    setFeedback({ tipo: null, mensagem: "" });
  };

  const apagar = () => {
    setExpressao((prev) => prev.slice(0, -1));
    setFeedback({ tipo: null, mensagem: "" });
  };

  const limpar = () => {
    setExpressao("");
    setFeedback({ tipo: null, mensagem: "" });
  };

  const validar = () => {
    if (!desafio) return;

    if (!expressao.trim()) {
      setFeedback({
        tipo: "erro",
        mensagem: "Por favor, construa uma expressão.",
      });
      return;
    }

    const resultado = validarExpressao(
      expressao,
      desafio.digito,
      desafio.quantidade,
      desafio.alvo,
    );

    setFeedback({
      tipo: resultado.valido ? "sucesso" : "erro",
      mensagem: resultado.mensagem,
    });
  };

  if (!montado || !desafio) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-500 to-purple-600">
        <div className="text-xl text-white">Carregando desafio...</div>
      </div>
    );
  }

  const tema = obterTema(nivel);

  return (
    <>
      <BackgroundCanvas nivel={nivel} />
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${tema.fontFamily} relative z-10`}
      >
        <div
          className={`${tema.cardBg} ${tema.cardBorder} rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative`}
        >
          {/* Overlay de Loading */}
          {carregando && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                <p className="text-white text-xl font-bold">
                  Gerando desafio...
                </p>
                <p className="text-white/70 text-sm mt-2">Aguarde um momento</p>
              </div>
            </div>
          )}

          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${tema.titleColor} mb-2`}>
              {tema.titleEmoji} Desafio Matemático
            </h1>
            <p className={tema.subtitleColor}>
              Use o dígito especificado para formar o número alvo!
            </p>
            <p className={`text-sm mt-1 ${tema.subtitleColor} font-semibold`}>
              {tema.temaTexto}
            </p>
          </div>

          {/* Seletor de Nível */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-medium ${tema.infoText}`}>
                🎯 Nível de Dificuldade:
              </label>
              <span className={`text-lg font-bold ${tema.titleColor}`}>
                Nível {nivel}
              </span>
            </div>
            <div className="grid grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => mudarNivel(n)}
                  disabled={carregando}
                  className={`py-2 px-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    nivel === n
                      ? tema.levelBtnActive + " shadow-lg scale-105"
                      : tema.levelBtnInactive
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div
              className={`mt-2 text-xs ${tema.footerText} text-center font-semibold`}
            >
              {nivel <= 2 && "⭐ Iniciante"}
              {nivel >= 3 && nivel <= 4 && "⭐⭐ Médio"}
              {nivel >= 5 && nivel <= 6 && "⭐⭐⭐ Difícil"}
              {nivel >= 7 && nivel <= 8 && "⭐⭐⭐⭐ Muito Difícil"}
              {nivel >= 9 && "⭐⭐⭐⭐⭐ Mestre"}
            </div>
          </div>

          {/* Informações do Desafio */}
          <div
            className={`${tema.infoBg} rounded-xl p-6 mb-6 border-2 ${tema.displayBorder}`}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-sm ${tema.subtitleColor} mb-1`}>Dígito</p>
                <p className={`text-4xl font-bold ${tema.infoText}`}>
                  {desafio.digito}
                </p>
              </div>
              <div>
                <p className={`text-sm ${tema.subtitleColor} mb-1`}>Usar</p>
                <p className={`text-4xl font-bold ${tema.infoText}`}>
                  {desafio.quantidade}x
                </p>
              </div>
              <div>
                <p className={`text-sm ${tema.subtitleColor} mb-1`}>Alvo</p>
                <p className={`text-4xl font-bold ${tema.infoText}`}>
                  {desafio.alvo}
                </p>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div
            className={`${tema.instructionBg} border-l-4 ${tema.instructionBorder} p-4 mb-6 rounded`}
          >
            <p className={`text-sm ${tema.instructionText}`}>
              <strong>Como jogar:</strong> Use o dígito{" "}
              <strong>{desafio.digito}</strong> exatamente{" "}
              <strong>{desafio.quantidade} vezes</strong> com os operadores{" "}
              <strong>+, -, *, /, ^, !, √, .</strong> e parênteses{" "}
              <strong>()</strong> para formar <strong>{desafio.alvo}</strong>.
            </p>
          </div>

          {/* Display da Expressão */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${tema.infoText} mb-2`}
            >
              Sua Expressão:
            </label>
            <div
              className={`w-full px-4 py-3 border-2 ${tema.displayBorder} rounded-lg ${tema.displayBg} text-lg ${tema.displayText} min-h-13 flex items-center font-mono`}
            >
              {expressao || (
                <span className={tema.subtitleColor}>
                  Clique nos botões abaixo...
                </span>
              )}
            </div>
          </div>

          {/* Teclado Virtual */}
          <div className="mb-6 space-y-3">
            <p className={`text-sm font-medium ${tema.infoText} mb-2`}>
              🎹 Teclado:
            </p>

            {/* Linha 1: Dígito e Decimal */}
            <div className="grid grid-cols-6 gap-2">
              <button
                onClick={() => adicionarCaractere(desafio.digito.toString())}
                disabled={carregando}
                className={`${tema.digitBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
              >
                {desafio.digito}
              </button>
              <button
                onClick={() => adicionarCaractere(".")}
                disabled={carregando}
                className={`${tema.digitBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
                title="Ponto decimal"
              >
                .
              </button>
              <div className="col-span-4"></div>
            </div>

            {/* Linha 2: Operadores Básicos */}
            <div className="grid grid-cols-6 gap-2">
              {["+", "-", "*", "/"].map((op) => (
                <button
                  key={op}
                  onClick={() => adicionarCaractere(` ${op} `)}
                  disabled={carregando}
                  className={`${tema.operatorBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
                >
                  {op}
                </button>
              ))}
              <div className="col-span-2"></div>
            </div>

            {/* Linha 3: Operadores Avançados */}
            <div className="grid grid-cols-6 gap-2">
              <button
                onClick={() => adicionarCaractere("^")}
                disabled={carregando}
                className={`${tema.advancedBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
                title="Potência"
              >
                x<sup>y</sup>
              </button>
              <button
                onClick={() => adicionarCaractere("!")}
                disabled={carregando}
                className={`${tema.advancedBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
                title="Fatorial"
              >
                !
              </button>
              <button
                onClick={() => adicionarCaractere("sqrt(")}
                disabled={carregando}
                className={`${tema.advancedBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-sm`}
                title="Raiz quadrada"
              >
                √
              </button>
              <div className="col-span-3"></div>
            </div>

            {/* Linha 4: Parênteses e Controles */}
            <div className="grid grid-cols-6 gap-2">
              <button
                onClick={() => adicionarCaractere("(")}
                disabled={carregando}
                className={`${tema.parenBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
              >
                (
              </button>
              <button
                onClick={() => adicionarCaractere(")")}
                disabled={carregando}
                className={`${tema.parenBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-xl`}
              >
                )
              </button>
              <div className="col-span-2"></div>
              <button
                onClick={apagar}
                disabled={carregando}
                className={`${tema.deleteBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-sm`}
              >
                ⌫ Apagar
              </button>
              <button
                onClick={limpar}
                disabled={carregando}
                className={`${tema.clearBtn} text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-sm`}
              >
                🗑️ Limpar
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={validar}
              disabled={carregando}
              className={`flex-1 ${tema.validateBtn} text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ✓ Validar
            </button>
            <button
              onClick={gerarNovoDesafio}
              disabled={carregando}
              className={`flex-1 ${tema.newBtn} text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              🔄 Novo Desafio
            </button>
          </div>

          {/* Feedback */}
          {feedback.tipo && (
            <div
              className={`p-4 rounded-lg mb-4 border-2 ${
                feedback.tipo === "sucesso"
                  ? "bg-green-900/50 border-green-500 text-green-300"
                  : "bg-red-900/50 border-red-500 text-red-300"
              }`}
            >
              <p className="font-medium">{feedback.mensagem}</p>
            </div>
          )}

          {/* Mostrar Solução */}
          <div className="text-center">
            <button
              onClick={() => setMostrarSolucao(!mostrarSolucao)}
              className={`text-sm ${tema.footerText} hover:${tema.titleColor} underline font-semibold`}
            >
              {mostrarSolucao ? "🙈 Esconder" : "💡 Mostrar"} solução
            </button>
            {mostrarSolucao && (
              <div
                className={`mt-3 p-3 ${tema.instructionBg} border-2 ${tema.instructionBorder} rounded-lg`}
              >
                <p className={`text-sm ${tema.instructionText}`}>
                  <strong>Uma solução possível:</strong>
                </p>
                <p
                  className={`text-lg font-mono font-bold ${tema.infoText} mt-1`}
                >
                  {desafio.solucao}
                </p>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div
            className={`mt-8 pt-6 border-t ${tema.displayBorder} text-center text-sm ${tema.footerText}`}
          >
            <p>Divirta-se resolvendo quebra-cabeças matemáticos! 🎯</p>
          </div>
        </div>
      </div>
    </>
  );
}
