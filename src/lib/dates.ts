export interface YMD {
  y: number
  m: number
  d: number
}

export const DAY_MS = 86_400_000

/** UTC midnight in ms; safe for years < 100. */
export function utcMs(y: number, m: number, d: number): number {
  const dt = new Date(0)
  dt.setUTCFullYear(y, m - 1, d)
  return dt.getTime()
}

export function fromMs(ms: number): YMD {
  const dt = new Date(ms)
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() }
}

export function daysInMonth(y: number, m: number): number {
  return fromMs(utcMs(y, m + 1, 0)).d
}

export function isValidYMD({ y, m, d }: YMD): boolean {
  if (![y, m, d].every(Number.isInteger)) return false
  if (m < 1 || m > 12 || d < 1) return false
  return d <= daysInMonth(y, m)
}

export function parseISO(s: string | undefined): YMD | null {
  if (!s) return null
  const mt = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!mt) return null
  const v = { y: Number(mt[1]), m: Number(mt[2]), d: Number(mt[3]) }
  return isValidYMD(v) ? v : null
}

export function toISO({ y, m, d }: YMD): string {
  const p = (n: number, l = 2) => String(n).padStart(l, '0')
  return `${p(y, 4)}-${p(m)}-${p(d)}`
}

export function todayYMD(now: Date = new Date()): YMD {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }
}

/** Signed number of days from a to b. */
export function diffDays(a: YMD, b: YMD): number {
  return Math.round((utcMs(b.y, b.m, b.d) - utcMs(a.y, a.m, a.d)) / DAY_MS)
}

export function addMonths(a: YMD, months: number): YMD {
  const idx = a.y * 12 + (a.m - 1) + months
  const y = Math.floor(idx / 12)
  const m = (idx % 12) + 1
  return { y, m, d: Math.min(a.d, daysInMonth(y, m)) }
}

export interface Span {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
}

/** Calendar difference between two dates (order does not matter). */
export function diffYMD(from: YMD, to: YMD): Span {
  const [a, b] = diffDays(from, to) >= 0 ? [from, to] : [to, from]
  let months = (b.y - a.y) * 12 + (b.m - a.m)
  if (b.d < a.d) months -= 1
  // clamping can overshoot b when a.d > days in the target month; step back if so
  let anchor = addMonths(a, months)
  while (months > 0 && diffDays(anchor, b) < 0) {
    months -= 1
    anchor = addMonths(a, months)
  }
  const totalDays = diffDays(a, b)
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: diffDays(anchor, b),
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: months,
  }
}

export interface AgeResult extends Span {
  nextBirthday: YMD
  daysUntilBirthday: number
  isBirthdayToday: boolean
}

export function calcAge(birth: YMD, today: YMD): AgeResult | null {
  if (diffDays(birth, today) < 0) return null
  const span = diffYMD(birth, today)
  const at = (y: number): YMD => ({ y, m: birth.m, d: Math.min(birth.d, daysInMonth(y, birth.m)) })
  let next = at(today.y)
  if (diffDays(today, next) < 0) next = at(today.y + 1)
  const daysUntilBirthday = diffDays(today, next)
  return { ...span, nextBirthday: next, daysUntilBirthday, isBirthdayToday: daysUntilBirthday === 0 }
}

export const WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export function weekdayAr(v: YMD): string {
  return WEEKDAYS_AR[new Date(utcMs(v.y, v.m, v.d)).getUTCDay()]
}
