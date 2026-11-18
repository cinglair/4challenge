/*
 * Gera os desafios diários e escreve o SQL de carga da tabela `daily_puzzles`.
 *
 *    node scripts/generate-daily-puzzles.mjs 2026-11-01 2027-04-30 > seed.sql
 *
 * Cada desafio é conferido pelo solver do jogo, que também mede o quanto a
 * conta mais simples é trabalhosa (o "custo"):
 *   easy   — sai só com + − × ÷
 *   medium — exige potência ou raiz, com uma conta ainda curta
 *   hard   — a conta é trabalhosa; na maioria dos dias o fatorial é só mais um
 *            caminho possível; nos outros, ele é necessário
 * A dica (o começo de uma solução) vai junto, na coluna `hint`, e a solução
 * inteira na coluna `solution`. Rodar o SQL de novo sobre dias que já existem
 * só (re)preenche a solução.
 * Nenhum trio (alvo, algarismo, quantidade) se repete dentro de um nível.
 * O sorteio tem semente fixa: o mesmo intervalo gera sempre o mesmo SQL.
 */
import { registerHooks } from 'node:module'

// O Node já roda TypeScript; falta só achar os imports sem extensão.
registerHooks({
   resolve(specifier, context, nextResolve) {
      try {
         return nextResolve(specifier, context)
      } catch (error) {
         if (!specifier.startsWith('.')) throw error
         try {
            return nextResolve(specifier + '.ts', context)
         } catch {
            return nextResolve(specifier + '/index.ts', context)
         }
      }
   },
})

const [from, to] = process.argv.slice(2)
if (!from || !to) {
   console.error('uso: generate-daily-puzzles.mjs AAAA-MM-DD AAAA-MM-DD')
   process.exit(1)
}

const LEVELS = ['easy', 'medium', 'hard']
const RANGES = {
   easy: { counts: [3, 4], maxTarget: 60 },
   medium: { counts: [3, 4, 5], maxTarget: 120 },
   hard: { counts: [4, 5], maxTarget: 150 },
}
/** A partir deste custo a conta já é de nível difícil. */
const HARD_COST = 6
/** Acima disto a conta fica rebuscada demais, como (3!)! aninhado. */
const MAX_COST = 12
/** Fração dos dias em que o difícil não exige fatorial. */
const NO_FACTORIAL_SHARE = 0.6

const { solvePuzzle, maskSolution } =
   await import('../src/features/DailyChallenge/utils/solver.ts')

// mulberry32: gerador simples com semente
function rng(seed) {
   return () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
   }
}
function shuffle(list, random) {
   for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
   }
   return list
}

// Mesmos pesos do solver: quanto mais operações, mais trabalhosa a conta.
const WEIGHT = { op: 1, frac: 1.5, pow: 2, sqrt: 2, fact: 2.5 }
const costOf = (row) =>
   row.reduce(
      (sum, n) =>
         sum +
         (WEIGHT[n.k] ?? 0) +
         (n.num ? costOf(n.num) + costOf(n.den) : 0) +
         (n.exp ? costOf(n.exp) : 0) +
         (n.body ? costOf(n.body) : 0),
      0
   )

/** Em que grupo o desafio entra neste nível, ou `null` se não serve. */
function classify(level, puzzle) {
   const solve = (l) => solvePuzzle({ ...puzzle, level: l })
   const easy = solve('easy')
   if (level === 'easy') {
      // só algarismos lado a lado (ex.: 44 com dois 4) não é desafio
      if (!easy || easy.every((n) => n.k === 'digit')) return null
      return { group: 'easy', row: easy }
   }
   if (easy) return null
   const medium = solve('medium')
   if (level === 'medium')
      return medium && costOf(medium) < HARD_COST
         ? { group: 'medium', row: medium }
         : null
   const hard = solve('hard')
   if (!hard) return null
   const cost = costOf(hard)
   if (cost > MAX_COST) return null
   if (!medium) return { group: 'factorial', row: hard }
   return cost >= HARD_COST ? { group: 'plain', row: hard } : null
}

// pools[nível][grupo] = desafios embaralhados
const pools = {}
for (const level of LEVELS) {
   const { counts, maxTarget } = RANGES[level]
   const groups = {}
   for (const count of counts)
      for (let digit = 1; digit <= 9; digit++)
         for (let target = 1; target <= maxTarget; target++) {
            const puzzle = { target, digit, count }
            const found = classify(level, puzzle)
            if (!found) continue
            ;(groups[found.group] ??= []).push({
               ...puzzle,
               hint: maskSolution(found.row),
               solution: found.row,
            })
         }
   pools[level] = groups
   Object.entries(groups).forEach(([group, list], i) => {
      shuffle(list, rng(LEVELS.indexOf(level) * 10 + i + 1))
      console.error(`${level}/${group}: ${list.length} desafios possíveis`)
   })
}

const days = []
for (
   let d = new Date(from + 'T00:00:00Z');
   d <= new Date(to + 'T00:00:00Z');
   d.setUTCDate(d.getUTCDate() + 1)
)
   days.push(d.toISOString().slice(0, 10))

// Evita o mesmo algarismo de ontem no nível e nos outros níveis do dia.
const rows = []
const lastDigit = {}
const pickGroup = rng(99)
for (const date of days) {
   const today = new Set()
   for (const level of LEVELS) {
      const groups = pools[level]
      let pool = groups[level]
      if (level === 'hard') {
         const plain = pickGroup() < NO_FACTORIAL_SHARE
         pool = plain && groups.plain.length ? groups.plain : groups.factorial
      }
      let i = pool.findIndex(
         (p) => p.digit !== lastDigit[level] && !today.has(p.digit)
      )
      if (i < 0) i = 0
      const [p] = pool.splice(i, 1)
      if (!p) throw new Error(`faltou desafio ${level} para ${date}`)
      lastDigit[level] = p.digit
      today.add(p.digit)
      const json = (row) => JSON.stringify(row).replaceAll("'", "''")
      rows.push(
         `('${date}','${level}',${p.target},${p.digit},${p.count},'${json(p.hint)}','${json(p.solution)}')`
      )
   }
}

console.log(
   'insert into public.daily_puzzles (date, level, target, digit, count, hint, solution) values\n' +
      rows.join(',\n') +
      '\non conflict (date, level) do update set solution = excluded.solution;'
)
console.error(`${days.length} dias, ${rows.length} desafios`)
