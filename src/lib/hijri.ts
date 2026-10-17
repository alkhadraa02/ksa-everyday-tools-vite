import { DAY_MS, fromMs, utcMs, type YMD } from './dates'

/** Umm al-Qura calendar through the platform's Intl (ICU) data — no external data needed. */
const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

export const HIJRI_MONTHS_AR = [
  'محرّم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوّال',
  'ذو القعدة',
  'ذو الحجة',
]

export const GREGORIAN_MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

export const HIJRI_MIN_YEAR = 1300
export const HIJRI_MAX_YEAR = 1600

export function gregorianToHijri(g: YMD): YMD | null {
  const parts = fmt.formatToParts(new Date(utcMs(g.y, g.m, g.d) + DAY_MS / 2))
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  const h = { y: get('year'), m: get('month'), d: get('day') }
  if (![h.y, h.m, h.d].every(Number.isFinite)) return null
  if (h.y < HIJRI_MIN_YEAR || h.y > HIJRI_MAX_YEAR) return null
  return h
}

const eq = (a: YMD, b: YMD) => a.y === b.y && a.m === b.m && a.d === b.d

/** Returns null when the Hijri date does not exist (e.g. day 30 in a 29-day month) or is out of range. */
export function hijriToGregorian(h: YMD): YMD | null {
  if (![h.y, h.m, h.d].every(Number.isInteger)) return null
  if (h.y < HIJRI_MIN_YEAR || h.y > HIJRI_MAX_YEAR || h.m < 1 || h.m > 12 || h.d < 1 || h.d > 30) return null
  const monthsSinceEpoch = (h.y - 1) * 12 + (h.m - 1)
  const approx = utcMs(622, 7, 19) + monthsSinceEpoch * 29.530588 * DAY_MS + (h.d - 1) * DAY_MS
  for (let off = -40; off <= 40; off++) {
    const g = fromMs(Math.round(approx / DAY_MS) * DAY_MS + off * DAY_MS)
    const back = gregorianToHijri(g)
    if (back && eq(back, h)) return g
  }
  return null
}

/** 29 or 30 days, or null if out of range. */
export function hijriMonthLength(y: number, m: number): number | null {
  if (hijriToGregorian({ y, m, d: 30 })) return 30
  if (hijriToGregorian({ y, m, d: 29 })) return 29
  return null
}

export function formatHijri(h: YMD): string {
  return `${h.d} ${HIJRI_MONTHS_AR[h.m - 1]} ${h.y}هـ`
}

export function formatGregorian(g: YMD): string {
  return `${g.d} ${GREGORIAN_MONTHS_AR[g.m - 1]} ${g.y}م`
}
