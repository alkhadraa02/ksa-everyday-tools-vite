/** Arabic number-to-words (nominative, with a currency mode for SAR). */

const ONES_M = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة']
const ONES_F = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع', 'عشر']
const TEENS_M = ['', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر']
const TEENS_F = ['', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة']
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون']
const HUNDREDS = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة']

/** [singular, dual, plural (3-10), accusative singular (11-99)] */
const SCALES: [string, string, string, string][] = [
  ['', '', '', ''],
  ['ألف', 'ألفان', 'آلاف', 'ألفاً'],
  ['مليون', 'مليونان', 'ملايين', 'مليوناً'],
  ['مليار', 'ملياران', 'مليارات', 'ملياراً'],
  ['تريليون', 'تريليونان', 'تريليونات', 'تريليوناً'],
]

export const MAX_WORDS_INTEGER = 999_999_999_999_999

function below100(n: number, fem: boolean): string {
  if (n === 0) return ''
  if (n <= 10) return (fem ? ONES_F : ONES_M)[n]
  if (n < 20) return (fem ? TEENS_F : TEENS_M)[n - 10]
  const t = Math.floor(n / 10)
  const o = n % 10
  return o === 0 ? TENS[t] : `${(fem ? ONES_F : ONES_M)[o]} و${TENS[t]}`
}

function below1000(n: number, fem: boolean): string {
  const h = Math.floor(n / 100)
  const rest = n % 100
  const parts = [h ? HUNDREDS[h] : '', below100(rest, fem)].filter(Boolean)
  return parts.join(' و')
}

function scaled(g: number, scale: number): string {
  const [one, two, plural, acc] = SCALES[scale]
  const rest = g % 100
  if (g === 1) return one
  if (g === 2) return two
  if (g > 100 && (rest === 1 || rest === 2)) {
    return `${HUNDREDS[Math.floor(g / 100)]} و${rest === 1 ? one : two}`
  }
  if (g >= 100 && rest === 0) {
    const h = Math.floor(g / 100)
    return `${h === 2 ? 'مئتا' : HUNDREDS[h]} ${one}`
  }
  const w = below1000(g, false)
  return rest >= 3 && rest <= 10 ? `${w} ${plural}` : `${w} ${acc}`
}

/** Whole non-negative integer to Arabic words. Returns null when out of range or not an integer. */
export function integerToWords(n: number, fem = false): string | null {
  if (!Number.isInteger(n) || n < 0 || n > MAX_WORDS_INTEGER) return null
  if (n === 0) return 'صفر'
  const groups: number[] = []
  let x = n
  while (x > 0) {
    groups.push(x % 1000)
    x = Math.floor(x / 1000)
  }
  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]
    if (g === 0) continue
    parts.push(i === 0 ? below1000(g, fem) : scaled(g, i))
  }
  return parts.join(' و')
}

function unit(n: number, one: string, dual: string, plural: string, acc: string, fem: boolean): string {
  const w = integerToWords(n, fem)!
  const r = n % 100
  if (n === 1) return `${one} ${fem ? 'واحدة' : 'واحد'}`
  if (n === 2) return dual
  if (r >= 3 && r <= 10) return `${w} ${plural}`
  if (r >= 11) return `${w} ${acc}`
  return `${w} ${one}`
}

export interface SarWords {
  riyals: number
  halalas: number
  text: string
}

/** Amount in SAR (max 2 decimals) to words, e.g. "مئة وخمسة وعشرون ريالاً وخمسون هللة فقط لا غير". */
export function sarToWords(amount: number): SarWords | null {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1e12) return null
  const total = Math.round(amount * 100)
  const riyals = Math.floor(total / 100)
  const halalas = total % 100
  const parts: string[] = []
  if (riyals > 0 || halalas === 0) {
    parts.push(riyals === 0 ? 'صفر ريال' : unit(riyals, 'ريال', 'ريالان', 'ريالات', 'ريالاً', false))
  }
  if (halalas > 0) parts.push(unit(halalas, 'هللة', 'هللتان', 'هللات', 'هللة', true))
  return { riyals, halalas, text: `${parts.join(' و')} فقط لا غير` }
}
