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

const HOLE: MathNode = { k: 'hole' }

function digitsIn(row: Row): number {
   let n = 0
   for (const node of row) {
      if (node.k === 'digit') n++
      else if (node.k === 'frac') n += digitsIn(node.num) + digitsIn(node.den)
      else if (node.k === 'pow') n += digitsIn(node.exp)
      else if (node.k === 'sqrt' || node.k === 'group') n += digitsIn(node.body)
   }
   return n
}

/**
 * Mostra de `row` só o que cabe em `budget` algarismos; o resto vira lacuna.
 * `nested` evita abrir demais a estrutura de partes que já estão dentro de
 * outra conta.
 */
function reveal(row: Row, budget: number, nested: boolean): Row {
   if (budget <= 0) return [HOLE]
   if (digitsIn(row) <= budget) return row

   // Parcelas (ou fatores) soltos: mostra os que cabem e junta os demais numa lacuna.
   const isOp = (n: MathNode, ops: string) => n.k === 'op' && ops.includes(n.v)
   const ops = row.some((n) => isOp(n, '+-')) ? '+-' : '*'
   if (row.some((n) => isOp(n, ops))) {
      const chunks: Row[] = [[]]
      const seps: MathNode[] = []
      for (const n of row) {
         if (isOp(n, ops)) {
            seps.push(n)
            chunks.push([])
         } else chunks[chunks.length - 1].push(n)
      }

      let left = budget
      const shown = chunks.map((chunk) => {
         const size = digitsIn(chunk)
         if (size > left) return false
         left -= size
         return true
      })

      if (!shown.includes(true)) {
         // nenhuma parcela cabe inteira: abre só a primeira, e só no nível de cima
         if (nested) return [HOLE]
         return [...reveal(chunks[0], budget, true), seps[0], HOLE]
      }

      const out: Row = []
      chunks.forEach((chunk, i) => {
         const hiddenRun = !shown[i] && i > 0 && !shown[i - 1]
         if (hiddenRun) return // já coberta pela lacuna anterior
         if (i > 0) out.push(seps[i - 1])
         out.push(...(shown[i] ? chunk : [HOLE]))
      })
      return out
   }

   // Um termo só: desce na estrutura, mostrando primeiro a parte menor.
   // Depois de mostrar uma parte, o resto entra como `nested` para não abrir demais.
   const last = row[row.length - 1]
   const rest = row.slice(0, -1)
   switch (last.k) {
      case 'fact':
         return [...reveal(rest, budget, nested), last]
      case 'pow': {
         const exp = digitsIn(last.exp)
         return exp <= budget
            ? [...reveal(rest, budget - exp, true), last]
            : [...reveal(rest, budget, nested), { k: 'pow', exp: [HOLE] }]
      }
      case 'frac': {
         const den = digitsIn(last.den)
         return den <= budget
            ? [
                 {
                    k: 'frac',
                    num: reveal(last.num, budget - den, true),
                    den: last.den,
                 },
              ]
            : [
                 {
                    k: 'frac',
                    num: reveal(last.num, budget, nested),
                    den: [HOLE],
                 },
              ]
      }
      case 'sqrt':
         return [{ k: 'sqrt', body: reveal(last.body, budget, nested) }]
      case 'group':
         return [{ k: 'group', body: reveal(last.body, budget, nested) }]
      default:
         return [HOLE] // um número com mais algarismos do que a dica pode mostrar
   }
}

/** Quantos algarismos uma dica pode entregar: no máximo metade da conta. */
export const hintBudget = (count: number) => Math.max(1, Math.floor(count / 2))

/**
 * Esconde a maior parte de uma solução para virar dica: mostra um pedaço
 * com no máximo metade dos algarismos e troca o resto por lacunas.
 * Ex.: 9 + 9/9 → 9 + ▢.
 */
export function maskSolution(row: Row): Row {
   return reveal(row, hintBudget(digitsIn(row)), false)
}
