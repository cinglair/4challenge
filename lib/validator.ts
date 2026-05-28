/**
 * Validador de Expressões do Jogo
 * Verifica se a expressão usa o dígito correto o número correto de vezes
 */

import { avaliarExpressao, numerosIguais } from "./evaluator";

function normalizar(expr: string): string {
  return expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

export interface ResultadoValidacao {
  valido: boolean;
  mensagem: string;
  detalhes?: {
    ocorrenciasEncontradas?: number;
    ocorrenciasEsperadas?: number;
    valorCalculado?: number;
    valorEsperado?: number;
  };
}

/**
 * Conta quantas vezes um dígito aparece em uma expressão
 * Ignora o dígito dentro de operadores ou parênteses
 */
export function contarOcorrenciasDigito(
  expressao: string,
  digito: number,
): number {
  // Remove espaços
  const expressaoLimpa = expressao.replace(/\s/g, "");

  // Remove operadores (básicos e avançados), parênteses e funções para contar apenas dígitos
  // Remove: +, -, *, /, ^, !, (), sqrt
  const apenasDigitos = expressaoLimpa
    .replace(/sqrt/gi, " ")
    .replace(/[+\-*/().^!]/g, " ");

  // Conta ocorrências do dígito como string
  const digitoStr = digito.toString();
  let contador = 0;

  // Percorre a string de dígitos
  for (let i = 0; i < apenasDigitos.length; i++) {
    if (apenasDigitos[i] === digitoStr) {
      contador++;
    }
  }

  return contador;
}

/**
 * Valida se a expressão está correta para o desafio
 */
export function validarExpressao(
  expressao: string,
  digito: number,
  quantidadeEsperada: number,
  alvo: number,
): ResultadoValidacao {
  const expr = normalizar(expressao);

  // 1. Valida caracteres e avalia a expressão
  const resultadoAvaliacao = avaliarExpressao(expr);

  if (!resultadoAvaliacao.sucesso) {
    return {
      valido: false,
      mensagem: `Erro na expressão: ${resultadoAvaliacao.erro}`,
    };
  }

  const valorCalculado = resultadoAvaliacao.valor!;

  // 2. Conta ocorrências do dígito
  const ocorrencias = contarOcorrenciasDigito(expr, digito);

  if (ocorrencias !== quantidadeEsperada) {
    return {
      valido: false,
      mensagem: `Você deve usar o dígito ${digito} exatamente ${quantidadeEsperada} vezes. Você usou ${ocorrencias} vezes.`,
      detalhes: {
        ocorrenciasEncontradas: ocorrencias,
        ocorrenciasEsperadas: quantidadeEsperada,
        valorCalculado,
        valorEsperado: alvo,
      },
    };
  }

  // 3. Verifica se o resultado é igual ao alvo
  if (!numerosIguais(valorCalculado, alvo)) {
    return {
      valido: false,
      mensagem: `O resultado da expressão é ${valorCalculado.toFixed(2)}, mas deveria ser ${alvo}.`,
      detalhes: {
        ocorrenciasEncontradas: ocorrencias,
        ocorrenciasEsperadas: quantidadeEsperada,
        valorCalculado,
        valorEsperado: alvo,
      },
    };
  }

  // 4. Tudo está correto!
  return {
    valido: true,
    mensagem: "🎉 Parabéns! Sua solução está correta!",
    detalhes: {
      ocorrenciasEncontradas: ocorrencias,
      ocorrenciasEsperadas: quantidadeEsperada,
      valorCalculado,
      valorEsperado: alvo,
    },
  };
}
