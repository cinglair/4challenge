/**
 * Gerador de Desafios Matemáticos
 * Baseado no problema "Four Fours", mas generalizado
 */

type Resultado = [number, string]; // [valor, expressão]

const OPS = ["+", "-", "*", "/", "^"] as const;

/**
 * Calcula o fatorial de um número
 */
function fatorial(n: number): number | null {
  if (n < 0 || !Number.isInteger(n)) return null;
  if (n > 20) return null; // Limita para evitar overflow
  if (n === 0 || n === 1) return 1;
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

/**
 * Avalia de forma segura uma operação entre dois números
 */
function avaliarSeguro(a: number, b: number, op: string): number | null {
  try {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        if (b === 0) return null;
        return a / b;
      case "^":
        // Limita potências para evitar números muito grandes
        if (Math.abs(b) > 10) return null;
        const resultado = Math.pow(a, b);
        if (!isFinite(resultado)) return null;
        return resultado;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Aplica operações unárias a um valor
 */
function aplicarOperacoesUnarias(valor: number, expr: string): Resultado[] {
  const resultados: Resultado[] = [[valor, expr]];

  // Fatorial
  if (Number.isInteger(valor) && valor >= 0 && valor <= 10) {
    const fat = fatorial(valor);
    if (fat !== null && fat < 1e10) {
      resultados.push([fat, `${expr}!`]);
    }
  }

  // Raiz quadrada
  if (valor >= 0) {
    const raiz = Math.sqrt(valor);
    if (isFinite(raiz) && raiz < 1e10) {
      resultados.push([raiz, `sqrt(${expr})`]);
    }
  }

  return resultados;
}

// Cache para memoização
const cache = new Map<string, Resultado[]>();

/**
 * Gera todas as expressões possíveis com um dígito usado N vezes
 */
function gerar(digito: number, quantidade: number): Resultado[] {
  const chave = `${digito}-${quantidade}`;

  if (cache.has(chave)) {
    return cache.get(chave)!;
  }

  if (quantidade === 1) {
    // Aplica operações unárias ao dígito base
    const resultadosBase = aplicarOperacoesUnarias(digito, digito.toString());
    cache.set(chave, resultadosBase);
    return resultadosBase;
  }

  const resultados: Resultado[] = [];

  // Divide em duas partes: i dígitos à esquerda, (quantidade - i) à direita
  for (let i = 1; i < quantidade; i++) {
    const esquerda = gerar(digito, i);
    const direita = gerar(digito, quantidade - i);

    for (const [valorEsq, exprEsq] of esquerda) {
      for (const [valorDir, exprDir] of direita) {
        // Operações binárias
        for (const op of OPS) {
          const valor = avaliarSeguro(valorEsq, valorDir, op);

          if (valor === null) continue;

          // Evita números muito grandes ou muito pequenos
          if (
            Math.abs(valor) > 1e10 ||
            (Math.abs(valor) > 0 && Math.abs(valor) < 1e-10)
          ) {
            continue;
          }

          const expr = `(${exprEsq} ${op} ${exprDir})`;

          // Adiciona o resultado da operação binária
          resultados.push([valor, expr]);

          // Aplica operações unárias ao resultado
          const comUnarias = aplicarOperacoesUnarias(valor, expr);
          for (const [valUnario, exprUnaria] of comUnarias) {
            if (valUnario !== valor) {
              // Evita duplicar o resultado original
              if (
                Math.abs(valUnario) <= 1e10 &&
                (Math.abs(valUnario) === 0 || Math.abs(valUnario) >= 1e-10)
              ) {
                resultados.push([valUnario, exprUnaria]);
              }
            }
          }
        }

        // Concatenação de dígitos (apenas se ambos forem o dígito base)
        if (i === 1 && quantidade - i === 1) {
          // Concatena dois dígitos (ex: 3 e 3 = 33)
          const concatenado = parseInt(digito.toString() + digito.toString());
          if (concatenado < 1e10) {
            resultados.push([
              concatenado,
              digito.toString() + digito.toString(),
            ]);
          }

          // Decimal (ex: .3)
          const decimal = parseFloat("0." + digito.toString());
          resultados.push([decimal, "." + digito.toString()]);
        }
      }
    }
  }

  cache.set(chave, resultados);
  return resultados;
}

/**
 * Constrói um mapa de desafios únicos (target -> expressão)
 */
function construirDesafios(
  digito: number,
  quantidade: number,
): Map<number, string> {
  const brutos = gerar(digito, quantidade);
  const unicos = new Map<number, string>();

  for (const [valor, expr] of brutos) {
    // Arredonda para 5 casas decimais para evitar problemas de precisão
    const chave = Math.round(valor * 100000) / 100000;

    if (!unicos.has(chave)) {
      unicos.set(chave, expr);
    }
  }

  return unicos;
}

export interface Desafio {
  digito: number;
  quantidade: number;
  alvo: number;
  solucao: string;
}

/**
 * Gera um desafio aleatório válido
 */
export function gerarDesafioAleatorio(
  digito: number,
  quantidade: number,
): Desafio {
  const desafios = construirDesafios(digito, quantidade);
  const alvos = Array.from(desafios.keys());

  if (alvos.length === 0) {
    // Fallback: se não há resultados, retorna um simples
    return {
      digito,
      quantidade,
      alvo: digito * quantidade,
      solucao: Array(quantidade).fill(digito).join(" + "),
    };
  }

  // Filtra para valores inteiros mais interessantes
  const alvosInteiros = alvos.filter(
    (v) => Number.isInteger(v) && v >= 0 && v <= 100,
  );

  const alvosPreferidos =
    alvosInteiros.length > 0
      ? alvosInteiros
      : alvos.filter((v) => v >= 0 && v <= 100);
  const alvosFinais = alvosPreferidos.length > 0 ? alvosPreferidos : alvos;

  const alvoAleatorio =
    alvosFinais[Math.floor(Math.random() * alvosFinais.length)];

  return {
    digito,
    quantidade,
    alvo: alvoAleatorio,
    solucao: desafios.get(alvoAleatorio)!,
  };
}

/**
 * Gera um desafio com parâmetros pré-definidos comuns
 */
export function gerarDesafioPreDefinido(): Desafio {
  const configs = [
    { digito: 3, quantidade: 4 },
    { digito: 4, quantidade: 4 },
    { digito: 2, quantidade: 4 },
    { digito: 5, quantidade: 4 },
    { digito: 3, quantidade: 3 },
    { digito: 4, quantidade: 3 },
  ];

  const config = configs[Math.floor(Math.random() * configs.length)];
  return gerarDesafioAleatorio(config.digito, config.quantidade);
}

/**
 * Gera um desafio baseado no nível de dificuldade (1-10)
 */
export function gerarDesafioPorNivel(nivel: number): Desafio {
  // Garante que o nível está entre 1 e 10
  const nivelAjustado = Math.max(1, Math.min(10, nivel));

  let configs: Array<{ digito: number; quantidade: number }>;

  switch (nivelAjustado) {
    case 1:
      // Muito fácil: dígitos baixos, poucas operações
      configs = [
        { digito: 2, quantidade: 3 },
        { digito: 3, quantidade: 3 },
      ];
      break;
    case 2:
      // Fácil
      configs = [
        { digito: 2, quantidade: 4 },
        { digito: 3, quantidade: 3 },
        { digito: 4, quantidade: 3 },
      ];
      break;
    case 3:
      // Médio-Fácil
      configs = [
        { digito: 3, quantidade: 4 },
        { digito: 4, quantidade: 4 },
      ];
      break;
    case 4:
      // Médio
      configs = [
        { digito: 4, quantidade: 4 },
        { digito: 5, quantidade: 3 },
        { digito: 5, quantidade: 4 },
      ];
      break;
    case 5:
      // Médio-Difícil
      configs = [
        { digito: 5, quantidade: 4 },
        { digito: 6, quantidade: 4 },
      ];
      break;
    case 6:
      // Difícil
      configs = [
        { digito: 6, quantidade: 4 },
        { digito: 7, quantidade: 4 },
        { digito: 5, quantidade: 5 },
      ];
      break;
    case 7:
      // Muito Difícil
      configs = [
        { digito: 6, quantidade: 5 },
        { digito: 7, quantidade: 4 },
        { digito: 8, quantidade: 4 },
      ];
      break;
    case 8:
      // Extremo
      configs = [
        { digito: 7, quantidade: 5 },
        { digito: 8, quantidade: 4 },
        { digito: 8, quantidade: 5 },
      ];
      break;
    case 9:
      // Mestre
      configs = [
        { digito: 8, quantidade: 5 },
        { digito: 9, quantidade: 5 },
        { digito: 7, quantidade: 6 },
      ];
      break;
    case 10:
      // Grande Mestre
      configs = [
        { digito: 9, quantidade: 5 },
        { digito: 9, quantidade: 6 },
        { digito: 8, quantidade: 6 },
      ];
      break;
    default:
      configs = [{ digito: 4, quantidade: 4 }];
  }

  const config = configs[Math.floor(Math.random() * configs.length)];
  return gerarDesafioAleatorio(config.digito, config.quantidade);
}

/**
 * Limpa o cache (útil para testes)
 */
export function limparCache(): void {
  cache.clear();
}

/**
 * Versão assíncrona de gerarDesafioPorNivel que não bloqueia a UI
 * Usa setTimeout para permitir que a thread principal respire
 */
export async function gerarDesafioPorNivelAsync(
  nivel: number,
): Promise<Desafio> {
  // Permite que a UI atualize antes de começar a computação pesada
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Garante que o nível está entre 1 e 10
  const nivelAjustado = Math.max(1, Math.min(10, nivel));

  let configs: Array<{ digito: number; quantidade: number }>;

  switch (nivelAjustado) {
    case 1:
      configs = [
        { digito: 2, quantidade: 3 },
        { digito: 3, quantidade: 3 },
      ];
      break;
    case 2:
      configs = [
        { digito: 2, quantidade: 4 },
        { digito: 3, quantidade: 3 },
        { digito: 4, quantidade: 3 },
      ];
      break;
    case 3:
      configs = [
        { digito: 3, quantidade: 4 },
        { digito: 4, quantidade: 4 },
      ];
      break;
    case 4:
      configs = [
        { digito: 4, quantidade: 4 },
        { digito: 5, quantidade: 3 },
        { digito: 5, quantidade: 4 },
      ];
      break;
    case 5:
      configs = [
        { digito: 5, quantidade: 4 },
        { digito: 6, quantidade: 4 },
      ];
      break;
    case 6:
      configs = [
        { digito: 6, quantidade: 4 },
        { digito: 7, quantidade: 4 },
        { digito: 5, quantidade: 5 },
      ];
      break;
    case 7:
      configs = [
        { digito: 6, quantidade: 5 },
        { digito: 7, quantidade: 4 },
        { digito: 8, quantidade: 4 },
      ];
      break;
    case 8:
      configs = [
        { digito: 7, quantidade: 5 },
        { digito: 8, quantidade: 4 },
        { digito: 8, quantidade: 5 },
      ];
      break;
    case 9:
      configs = [
        { digito: 8, quantidade: 5 },
        { digito: 9, quantidade: 5 },
        { digito: 7, quantidade: 6 },
      ];
      break;
    case 10:
      configs = [
        { digito: 9, quantidade: 5 },
        { digito: 9, quantidade: 6 },
        { digito: 8, quantidade: 6 },
      ];
      break;
    default:
      configs = [{ digito: 4, quantidade: 4 }];
  }

  const config = configs[Math.floor(Math.random() * configs.length)];

  // Outra pausa antes da computação pesada
  await new Promise((resolve) => setTimeout(resolve, 0));

  return gerarDesafioAleatorio(config.digito, config.quantidade);
}
