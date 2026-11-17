import type { Evaluation, Row } from '../types'

/* Avalia a árvore com a precedência usual. */

class MathError extends Error {}

function factorial(v: number): number {
   const n = Math.round(v)
   if (Math.abs(v - n) > 1e-9 || n < 0)
      throw new MathError('Fatorial só vale para inteiros a partir de zero.')
   if (n > 18) throw new MathError('Esse fatorial é grande demais.')
   let r = 1
   for (let i = 2; i <= n; i++) r *= i
   return r
}

function evalRow(row: Row): number {
   if (!row.length) throw new MathError('Ainda há um espaço vazio na conta.')
   let pos = 0

   const primary = (): number => {
      const n = row[pos]
      if (!n) throw new MathError('A conta termina em um operador.')
      switch (n.k) {
         case 'digit': {
            let v = 0 // algarismos vizinhos formam um número: 7 7 → 77
            for (let d = row[pos]; d && d.k === 'digit'; d = row[++pos])
               v = v * 10 + d.v
            return v
         }
         case 'group':
            pos++
            return evalRow(n.body)
         case 'sqrt': {
            pos++
            const v = evalRow(n.body)
            if (v < 0)
               throw new MathError('Não dá para tirar raiz de número negativo.')
            return Math.sqrt(v)
         }
         case 'frac': {
            pos++
            const a = evalRow(n.num)
            const b = evalRow(n.den)
            if (b === 0) throw new MathError('Divisão por zero.')
            return a / b
         }
         case 'pow':
            throw new MathError('Falta a base da potência.')
         case 'fact':
            throw new MathError('Falta um número antes do fatorial.')
         default:
            throw new MathError('Há dois operadores seguidos.')
      }
   }

   const postfix = (): number => {
      let v = primary()
      for (;;) {
         const n = row[pos]
         if (n?.k === 'pow') {
            pos++
            v = Math.pow(v, evalRow(n.exp))
            if (!Number.isFinite(v))
               throw new MathError('Essa potência não tem resultado real.')
         } else if (n?.k === 'fact') {
            pos++
            v = factorial(v)
         } else return v
      }
   }

   const unary = (): number => {
      const n = row[pos]
      if (n?.k === 'op' && n.v === '-') {
         pos++
         return -unary()
      }
      return postfix()
   }

   const term = (): number => {
      let v = unary()
      for (;;) {
         const n = row[pos]
         if (!n) return v
         if (n.k === 'op') {
            if (n.v !== '*') return v
            pos++
            v *= unary()
            continue
         }
         // Multiplicação implícita só ao lado de parênteses ou raiz: 2(3), 2√4.
         const prev = row[pos - 1]
         if (n.k === 'group' || n.k === 'sqrt' || prev.k === 'group') {
            v *= postfix()
            continue
         }
         throw new MathError('Falta um operador entre dois termos.')
      }
   }

   let v = term()
   while (pos < row.length) {
      const n = row[pos++]
      const r = term()
      v = n.k === 'op' && n.v === '+' ? v + r : v - r
   }
   return v
}

export function evaluate(root: Row): Evaluation {
   try {
      const value = evalRow(root)
      if (!Number.isFinite(value))
         return { ok: false, error: 'O resultado é grande demais.' }
      return { ok: true, value }
   } catch (e) {
      if (e instanceof MathError) return { ok: false, error: e.message }
      throw e
   }
}

export const isTarget = (value: number, target: number) =>
   Math.abs(value - target) < 1e-9
