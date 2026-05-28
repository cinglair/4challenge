"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import { parse } from "mathjs";

interface MathDisplayProps {
  expressao: string;
  textColor?: string;
  placeholderColor?: string;
}

function toLatex(expr: string): string | null {
  try {
    return parse(expr).toTex();
  } catch {
    return null;
  }
}

function textoFallback(expr: string): string {
  return expr
    .replace(/sqrt\(/g, "√(")
    .replace(/ \* /g, " × ")
    .replace(/ \/ /g, " ÷ ");
}

export default function MathDisplay({
  expressao,
  textColor = "",
  placeholderColor = "",
}: MathDisplayProps) {
  if (!expressao.trim()) {
    return (
      <span className={placeholderColor}>Clique nos botões abaixo...</span>
    );
  }

  const latex = toLatex(expressao);

  if (latex) {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
      output: "html",
    });
    return (
      <span
        className={textColor}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Expressão incompleta (ainda digitando) — mostra texto melhorado
  return (
    <span className={`font-mono ${textColor}`}>
      {textoFallback(expressao)}
    </span>
  );
}
