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
export function avaliarExpressao(expressao: string): ResultadoAvaliacao {
  try {
    // Remove espaços extras
    const expressaoLimpa = expressao.trim();

    // Verifica se a expressão está vazia
    if (!expressaoLimpa) {
      return {
        sucesso: false,
        erro: "Expressão vazia",
      };
    }

    // Valida caracteres permitidos
    // Permite: dígitos, operadores básicos e avançados, parênteses, ponto decimal, espaços
    // Operadores: +, -, *, /, ^, !, sqrt
    const caracteresPermitidos = /^[\d+\-*/().\s^!a-z]+$/i;
    if (!caracteresPermitidos.test(expressaoLimpa)) {
      return {
        sucesso: false,
        erro: "Expressão contém caracteres não permitidos",
      };
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
    return {
      sucesso: false,
      erro: erro instanceof Error ? erro.message : "Erro ao avaliar expressão",
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
