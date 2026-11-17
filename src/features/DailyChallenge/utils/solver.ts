import type { Level } from '../services/models'
import type { MathNode, Row } from '../types'
import { RANK } from './constants'
import { evaluate, isTarget } from './evaluate'

/*
 * Solver dos desafios: monta, de baixo para cima, todas as contas possíveis
 * com 1, 2, … n algarismos e guarda a mais simples para cada valor. É a
 * fonte das dicas enquanto a solução não vem do banco.
 */

interface Expr {
   value: number
   row: Row
   /** 0 = soma/subtração, 1 = multiplicação, 2 = termo isolado. */
   prec: 0 | 1 | 2
   /** Quanto mais simples a conta, menor o custo. */
   cost: number
}

const LIMIT = 1e6
const MAX_FACTORIAL = 10
const MAX_EXPONENT = 20

const keyOf = (v: number) => String(Math.round(v * 1e6) / 1e6 + 0) // + 0 desfaz o −0
const isInt = (v: number) => Math.abs(v - Math.round(v)) < 1e-9
const op = (v: '+' | '-' | '*'): MathNode => ({ k: 'op', v })
const group = (e: Expr): Row => [{ k: 'group', body: e.row }]
const atLeast = (e: Expr, prec: number): Row =>
   e.prec >= prec ? e.row : group(e)
const lastKind = (row: Row) => row[row.length - 1].k

function keep(set: Map<string, Expr>, e: Expr) {
   if (!Number.isFinite(e.value) || Math.abs(e.value) > LIMIT) return
   const key = keyOf(e.value)
   const known = set.get(key)
   if (!known || e.cost < known.cost) set.set(key, e)
}

export interface SolveParams {
   target: number
   digit: number
   count: number
   level: Level
}

/**
 * A conta mais simples que forma `target` com exatamente `count` algarismos
 * `digit`, usando só as operações liberadas no nível. `null` se não achar.
 */
export function solvePuzzle({
   target,
   digit,
   count,
   level,
}: SolveParams): Row | null {
   const advanced = RANK[level] >= RANK.medium // potência e raiz
   const expert = RANK[level] >= RANK.hard // fatorial

   const combine = (set: Map<string, Expr>, a: Expr, b: Expr) => {
      const cost = a.cost + b.cost
      keep(set, {
         value: a.value + b.value,
         row: [...a.row, op('+'), ...b.row],
         prec: 0,
         cost: cost + 1,
      })
      keep(set, {
         value: a.value - b.value,
         row: [...a.row, op('-'), ...atLeast(b, 1)],
         prec: 0,
         cost: cost + 1,
      })
      keep(set, {
         value: a.value * b.value,
         row: [...atLeast(a, 1), op('*'), ...atLeast(b, 1)],
         prec: 1,
         cost: cost + 1,
      })
      if (b.value !== 0)
         keep(set, {
            value: a.value / b.value,
            row: [{ k: 'frac', num: a.row, den: b.row }],
            prec: 2,
            cost: cost + 1.5,
         })
      if (
         advanced &&
         isInt(b.value) &&
         Math.abs(b.value) <= MAX_EXPONENT &&
         Math.round(b.value) !== 1 &&
         !(a.value === 0 && b.value <= 0)
      ) {
         const plain = a.prec === 2 && lastKind(a.row) !== 'pow'
         keep(set, {
            value: Math.pow(a.value, Math.round(b.value)),
            row: [...(plain ? a.row : group(a)), { k: 'pow', exp: b.row }],
            prec: 2,
            cost: cost + 2,
         })
      }
   }

   const unary = (set: Map<string, Expr>, e: Expr) => {
      if (advanced && e.value > 0) {
         const root = Math.sqrt(e.value)
         // só raízes "redondas", para as dicas ficarem legíveis
         if (isInt(root * 12) && root !== e.value)
            keep(set, {
               value: root,
               row: [{ k: 'sqrt', body: e.row }],
               prec: 2,
               cost: e.cost + 2,
            })
      }
      if (expert && isInt(e.value)) {
         const n = Math.round(e.value)
         // 1! e 2! não mudam o valor
         if (n === 0 || (n >= 3 && n <= MAX_FACTORIAL)) {
            const plain = e.prec === 2 && lastKind(e.row) !== 'pow'
            let value = 1
            for (let i = 2; i <= n; i++) value *= i
            keep(set, {
               value,
               row: [...(plain ? e.row : group(e)), { k: 'fact' }],
               prec: 2,
               cost: e.cost + 2.5,
            })
         }
      }
   }

   // sets[n] = melhor conta para cada valor alcançável com n algarismos
   const sets: Array<Map<string, Expr>> = [new Map()]
   for (let n = 1; n <= count; n++) {
      const set = new Map<string, Expr>()

      // algarismos lado a lado formam um número: 7 7 → 77
      const digits: Row = Array.from({ length: n }, () => ({
         k: 'digit',
         v: digit,
      }))
      keep(set, {
         value: Number(String(digit).repeat(n)),
         row: digits,
         prec: 2,
         cost: 0,
      })

      for (let i = 1; i < n; i++)
         for (const a of sets[i].values())
            for (const b of sets[n - i].values()) combine(set, a, b)

      // duas passadas cobrem casos como (3!)! e √(4!+1)
      for (let pass = 0; pass < 2; pass++)
         for (const e of [...set.values()]) unary(set, e)

      sets.push(set)
   }

   const found = sets[count].get(keyOf(target))
   if (!found) return null
   const check = evaluate(found.row)
   return check.ok && isTarget(check.value, target) ? found.row : null
}

const DIGIT_HOLE: MathNode = { k: 'hole', of: 'digit' }
const SIGN_HOLE: MathNode = { k: 'hole', of: 'sign' }

/**
 * Transforma uma solução em dica: mantém o desenho da conta, mas esconde
 * metade dos algarismos e metade dos sinais, alternando na ordem de leitura.
 * Conta como sinal toda operação: + − ×, fração, potência, raiz e fatorial.
 *
 * Algarismo escondido vira uma casa vazia; sinal escondido vira um "?".
 * Fração, potência e raiz escondidas são desmontadas em linha (a ? b), para
 * o formato não entregar qual era a operação.
 *
 * Ex.: 9 + 9/9 → 9 ? ▢/9.
 */
export function maskSolution(solution: Row): Row {
   let digits = 0
   let signs = 0
   const showDigit = () => digits++ % 2 === 0 // 1º, 3º, 5º…
   const showSign = () => signs++ % 2 === 1 // 2º, 4º…: sempre fica ao menos um escondido

   // Parênteses em volta do que não é um número só, para a conta em linha não ficar ambígua.
   const wrap = (row: Row): Row =>
      row.every((n) => n.k === 'digit' || (n.k === 'hole' && n.of === 'digit'))
         ? row
         : [{ k: 'group', body: row }]

   const mask = (row: Row): Row => {
      const out: Row = []
      row.forEach((node, i) => {
         switch (node.k) {
            case 'digit':
               out.push(showDigit() ? node : DIGIT_HOLE)
               break
            case 'op':
            case 'fact':
               out.push(showSign() ? node : SIGN_HOLE)
               break
            case 'group':
               out.push({ k: 'group', body: mask(node.body) })
               break
            case 'sqrt': {
               const shown = showSign()
               const body = mask(node.body)
               if (shown) out.push({ k: 'sqrt', body })
               else out.push(SIGN_HOLE, { k: 'group', body })
               break
            }
            case 'pow': {
               const shown = showSign()
               const exp = mask(node.exp)
               if (shown) out.push({ k: 'pow', exp })
               else out.push(SIGN_HOLE, ...wrap(exp))
               break
            }
            case 'frac': {
               const num = mask(node.num)
               const shown = showSign()
               const den = mask(node.den)
               if (shown) {
                  out.push({ k: 'frac', num, den })
                  break
               }
               const inline: Row = [...wrap(num), SIGN_HOLE, ...wrap(den)]
               // se algo se aplica à fração inteira (potência, fatorial), mantém o conjunto unido
               const next = row[i + 1]?.k
               if (next === 'pow' || next === 'fact')
                  out.push({ k: 'group', body: inline })
               else out.push(...inline)
               break
            }
            case 'hole':
               out.push(node)
               break
         }
      })
      return out
   }

   return mask(solution)
}
