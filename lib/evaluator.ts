/**
 * Avaliador Seguro de Expressões Matemáticas
 * Usa mathjs para avaliar expressões de forma segura
 */

import { evaluate } from "mathjs";

export interface ResultadoAvaliacao {
  sucesso: boolean;
  valor?: number;
  erro?: string;
}

/**
 * Avalia uma expressão matemática de forma segura
 * Retorna o resultado ou um erro
 */
function mensagemAmigavel(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("value expected") || m.includes("unexpected end"))
    return "Expressão incompleta — adicione o valor que falta.";
  if (m.includes("parenthesis") || m.includes("paren"))
    return "Parêntese não fechado — verifique os ( ).";
  if (m.includes("divide by zero") || m.includes("division by zero"))
    return "Divisão por zero.";
  if (m.includes("undefined symbol") || m.includes("undefined variable"))
    return "Símbolo não reconhecido na expressão.";
  return "Expressão inválida — verifique os operadores e parênteses.";
}

function normalizarExpressao(expr: string): string {
  return expr
    .replace(/×/g, "*")   // unicode × → *
    .replace(/÷/g, "/")   // unicode ÷ → /
    .replace(/−/g, "-");  // unicode minus → ASCII minus
}

export function avaliarExpressao(expressao: string): ResultadoAvaliacao {
  try {
    const expressaoLimpa = normalizarExpressao(expressao.trim());

    if (!expressaoLimpa) {
      return { sucesso: false, erro: "Expressão vazia" };
    }

    // Avalia a expressão usando mathjs (seguro)
    const resultado = evaluate(expressaoLimpa);

    // Verifica se o resultado é um número válido
    if (typeof resultado !== "number") {
      return {
        sucesso: false,
        erro: "Expressão não resulta em um número",
      };
    }

    if (!isFinite(resultado)) {
      return {
        sucesso: false,
        erro: "Resultado é infinito ou inválido",
      };
    }

    return {
      sucesso: true,
      valor: resultado,
    };
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : "";
    return {
      sucesso: false,
      erro: mensagemAmigavel(msg),
    };
  }
}

/**
 * Verifica se dois números são aproximadamente iguais
 * Usa uma tolerância para lidar com imprecisão de ponto flutuante
 */
export function numerosIguais(
  a: number,
  b: number,
  tolerancia: number = 0.0001,
): boolean {
  return Math.abs(a - b) < tolerancia;
}
