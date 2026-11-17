export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Data local no formato AAAA-MM-DD. */
export function localISODate(d: Date): string {
   return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** Lê AAAA-MM-DD como meia-noite no fuso local (e não em UTC, como `new Date(iso)`). */
export function parseISODate(iso: string): Date {
   const [y, m, d] = iso.split('-').map(Number)
   return new Date(y, m - 1, d)
}
