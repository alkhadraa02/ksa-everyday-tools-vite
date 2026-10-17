/** Convert Arabic-Indic / Persian digits and separators to plain ASCII. */
export function toLatinDigits(s: string): string {
  return s
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/\u066b/g, '.')
    .replace(/[\u066c,\s]/g, '')
}

/** Parse a user-typed number; returns null for empty or invalid input. */
export function parseNum(s: string | undefined): number | null {
  if (s === undefined) return null
  const t = toLatinDigits(s.trim())
  if (t === '') return null
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

const nf = new Intl.NumberFormat('ar-SA-u-nu-latn', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const nf0 = new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 2 })

export function formatMoney(n: number): string {
  return `${nf.format(n)} ر.س`
}

export function formatNumber(n: number): string {
  return nf0.format(n)
}
