import { parseNum } from './format'

export interface NumField {
  value: number
  empty: boolean
  error: string | null
}

/** Reads an optional non-negative number from a text field (empty counts as 0). */
export function numField(s: string): NumField {
  if (s.trim() === '') return { value: 0, empty: true, error: null }
  const n = parseNum(s)
  if (n === null) return { value: 0, empty: false, error: 'أدخل رقمًا صحيحًا' }
  if (n < 0) return { value: 0, empty: false, error: 'القيمة لا يمكن أن تكون سالبة' }
  return { value: n, empty: false, error: null }
}
