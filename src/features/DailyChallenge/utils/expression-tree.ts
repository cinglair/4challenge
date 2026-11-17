import type { Cursor, Doc, MathNode, Row, Slot, Step } from '../types'

/* Leitura e edição imutável da árvore da expressão. */

export function slotsOf(n: MathNode): Slot[] {
   if (n.k === 'frac') return ['num', 'den']
   if (n.k === 'pow') return ['exp']
   if (n.k === 'sqrt' || n.k === 'group') return ['body']
   return []
}

export function getSlot(n: MathNode, s: Slot): Row {
   if (n.k === 'frac') return s === 'num' ? n.num : n.den
   if (n.k === 'pow') return n.exp
   if (n.k === 'sqrt' || n.k === 'group') return n.body
   return []
}

function withSlot(n: MathNode, s: Slot, row: Row): MathNode {
   if (n.k === 'frac')
      return s === 'num' ? { ...n, num: row } : { ...n, den: row }
   if (n.k === 'pow') return { ...n, exp: row }
   if (n.k === 'sqrt' || n.k === 'group') return { ...n, body: row }
   return n
}

export function rowAt(root: Row, path: Step[]): Row {
   let row = root
   for (const st of path) row = getSlot(row[st.i], st.slot)
   return row
}

function replaceRow(root: Row, path: Step[], next: Row): Row {
   if (path.length === 0) return next
   const [st, ...rest] = path
   const copy = root.slice()
   copy[st.i] = withSlot(
      root[st.i],
      st.slot,
      replaceRow(getSlot(root[st.i], st.slot), rest, next)
   )
   return copy
}

export const samePath = (a: Step[], b: Step[]) =>
   a.length === b.length &&
   a.every((s, i) => s.i === b[i].i && s.slot === b[i].slot)

/** Cursor no fim da linha raiz. */
export const endCursor = (root: Row): Cursor => ({
   path: [],
   index: root.length,
})

export function insertNode(d: Doc, node: MathNode): Doc {
   const { path, index } = d.cursor
   const row = rowAt(d.root, path)

   // Fração: o termo à esquerda do cursor sobe para o numerador.
   if (node.k === 'frac') {
      let start = index
      while (start > 0 && row[start - 1].k !== 'op') start--
      const taken = row.slice(start, index)
      const frac: MathNode = { k: 'frac', num: taken, den: [] }
      const next = [...row.slice(0, start), frac, ...row.slice(index)]
      return {
         root: replaceRow(d.root, path, next),
         cursor: {
            path: [...path, { i: start, slot: taken.length ? 'den' : 'num' }],
            index: 0,
         },
      }
   }

   const next = [...row.slice(0, index), node, ...row.slice(index)]
   const root = replaceRow(d.root, path, next)
   const slots = slotsOf(node)
   return slots.length
      ? {
           root,
           cursor: { path: [...path, { i: index, slot: slots[0] }], index: 0 },
        }
      : { root, cursor: { path, index: index + 1 } }
}

export function backspace(d: Doc): Doc {
   const { path, index } = d.cursor
   const row = rowAt(d.root, path)

   if (index > 0) {
      const prev = row[index - 1]
      const slots = slotsOf(prev)
      const hollow = slots.every((s) => getSlot(prev, s).length === 0)
      if (slots.length && !hollow) {
         // Entra na estrutura em vez de apagá-la inteira.
         const last = slots[slots.length - 1]
         return {
            root: d.root,
            cursor: {
               path: [...path, { i: index - 1, slot: last }],
               index: getSlot(prev, last).length,
            },
         }
      }
      const next = [...row.slice(0, index - 1), ...row.slice(index)]
      return {
         root: replaceRow(d.root, path, next),
         cursor: { path, index: index - 1 },
      }
   }

   if (!path.length) return d

   // Início de uma estrutura: desfaz a estrutura e mantém o conteúdo.
   const st = path[path.length - 1]
   const parentPath = path.slice(0, -1)
   const parent = rowAt(d.root, parentPath)
   const node = parent[st.i]
   const flat: MathNode[] = []
   let before = 0
   for (const s of slotsOf(node)) {
      if (s === st.slot) before = flat.length
      flat.push(...getSlot(node, s))
   }
   const next = [...parent.slice(0, st.i), ...flat, ...parent.slice(st.i + 1)]
   return {
      root: replaceRow(d.root, parentPath, next),
      cursor: { path: parentPath, index: st.i + before },
   }
}

export function moveLeft(d: Doc): Cursor {
   const { path, index } = d.cursor
   const row = rowAt(d.root, path)
   if (index > 0) {
      const prev = row[index - 1]
      const slots = slotsOf(prev)
      if (!slots.length) return { path, index: index - 1 }
      const last = slots[slots.length - 1]
      return {
         path: [...path, { i: index - 1, slot: last }],
         index: getSlot(prev, last).length,
      }
   }
   if (!path.length) return d.cursor
   const st = path[path.length - 1]
   const parentPath = path.slice(0, -1)
   const node = rowAt(d.root, parentPath)[st.i]
   const slots = slotsOf(node)
   const at = slots.indexOf(st.slot)
   if (at > 0)
      return {
         path: [...parentPath, { i: st.i, slot: slots[at - 1] }],
         index: getSlot(node, slots[at - 1]).length,
      }
   return { path: parentPath, index: st.i }
}

export function moveRight(d: Doc): Cursor {
   const { path, index } = d.cursor
   const row = rowAt(d.root, path)
   if (index < row.length) {
      const slots = slotsOf(row[index])
      return slots.length
         ? { path: [...path, { i: index, slot: slots[0] }], index: 0 }
         : { path, index: index + 1 }
   }
   if (!path.length) return d.cursor
   const st = path[path.length - 1]
   const parentPath = path.slice(0, -1)
   const slots = slotsOf(rowAt(d.root, parentPath)[st.i])
   const at = slots.indexOf(st.slot)
   if (at < slots.length - 1)
      return {
         path: [...parentPath, { i: st.i, slot: slots[at + 1] }],
         index: 0,
      }
   return { path: parentPath, index: st.i + 1 }
}

/** ↑ e ↓ alternam entre numerador e denominador da fração mais próxima. */
export function moveVertical(d: Doc, dir: 'up' | 'down'): Cursor {
   const { path } = d.cursor
   const from: Slot = dir === 'up' ? 'den' : 'num'
   const to: Slot = dir === 'up' ? 'num' : 'den'
   for (let depth = path.length - 1; depth >= 0; depth--) {
      if (path[depth].slot !== from) continue
      const head = path.slice(0, depth)
      const node = rowAt(d.root, head)[path[depth].i]
      return {
         path: [...head, { i: path[depth].i, slot: to }],
         index: getSlot(node, to).length,
      }
   }
   return d.cursor
}

/** Sai dos parênteses mais próximos (tecla ")"). */
export function closeGroup(d: Doc): Cursor {
   const { path } = d.cursor
   for (let depth = path.length - 1; depth >= 0; depth--) {
      const head = path.slice(0, depth)
      if (rowAt(d.root, head)[path[depth].i].k === 'group')
         return { path: head, index: path[depth].i + 1 }
   }
   return d.cursor
}

export function countDigits(row: Row): number {
   let n = 0
   for (const node of row) {
      if (node.k === 'digit') n++
      for (const s of slotsOf(node)) n += countDigits(getSlot(node, s))
   }
   return n
}
