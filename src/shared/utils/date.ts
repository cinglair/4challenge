export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Data local no formato AAAA-MM-DD. */
export function localISODate(d: Date): string {
   return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
