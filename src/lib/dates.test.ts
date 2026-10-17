import { describe, expect, it } from 'vitest'
import {
  addMonths,
  calcAge,
  daysInMonth,
  diffDays,
  diffYMD,
  isValidYMD,
  parseISO,
  toISO,
  weekdayAr,
} from './dates'

describe('date helpers', () => {
  it('knows month lengths and leap years', () => {
    expect(daysInMonth(2024, 2)).toBe(29)
    expect(daysInMonth(2023, 2)).toBe(28)
    expect(daysInMonth(1900, 2)).toBe(28)
    expect(daysInMonth(2000, 2)).toBe(29)
    expect(daysInMonth(2024, 12)).toBe(31)
  })
  it('validates and round-trips ISO strings', () => {
    expect(parseISO('2024-02-30')).toBeNull()
    expect(parseISO('nonsense')).toBeNull()
    expect(toISO(parseISO('2024-02-29')!)).toBe('2024-02-29')
    expect(isValidYMD({ y: 2023, m: 2, d: 29 })).toBe(false)
  })
  it('counts days across leap years', () => {
    expect(diffDays({ y: 2024, m: 1, d: 1 }, { y: 2025, m: 1, d: 1 })).toBe(366)
    expect(diffDays({ y: 2025, m: 1, d: 1 }, { y: 2024, m: 1, d: 1 })).toBe(-366)
  })
  it('clamps month-end when adding months', () => {
    expect(addMonths({ y: 2024, m: 1, d: 31 }, 1)).toEqual({ y: 2024, m: 2, d: 29 })
    expect(addMonths({ y: 2024, m: 11, d: 15 }, 3)).toEqual({ y: 2025, m: 2, d: 15 })
  })
  it('computes years/months/days', () => {
    const s = diffYMD({ y: 1990, m: 5, d: 15 }, { y: 2024, m: 5, d: 14 })
    expect([s.years, s.months, s.days]).toEqual([33, 11, 29])
    const t = diffYMD({ y: 2000, m: 1, d: 31 }, { y: 2000, m: 3, d: 1 })
    expect([t.years, t.months, t.days]).toEqual([1, 1, 1].map((x, i) => (i === 0 ? 0 : x)))
    expect(t.totalDays).toBe(30)
  })
  it('is symmetric and reports weeks', () => {
    const a = diffYMD({ y: 2024, m: 1, d: 1 }, { y: 2024, m: 1, d: 15 })
    const b = diffYMD({ y: 2024, m: 1, d: 15 }, { y: 2024, m: 1, d: 1 })
    expect(a).toEqual(b)
    expect(a.totalWeeks).toBe(2)
    expect(a.days).toBe(14)
  })
  it('computes age and next birthday', () => {
    const a = calcAge({ y: 1990, m: 5, d: 15 }, { y: 2024, m: 5, d: 14 })!
    expect(a.years).toBe(33)
    expect(a.daysUntilBirthday).toBe(1)
    expect(a.isBirthdayToday).toBe(false)
    const b = calcAge({ y: 1990, m: 5, d: 15 }, { y: 2024, m: 5, d: 15 })!
    expect(b.years).toBe(34)
    expect(b.isBirthdayToday).toBe(true)
    const c = calcAge({ y: 1990, m: 5, d: 15 }, { y: 2024, m: 5, d: 16 })!
    expect(c.nextBirthday).toEqual({ y: 2025, m: 5, d: 15 })
  })
  it('rejects a birth date in the future', () => {
    expect(calcAge({ y: 2030, m: 1, d: 1 }, { y: 2024, m: 1, d: 1 })).toBeNull()
  })
  it('names the weekday in Arabic', () => {
    expect(weekdayAr({ y: 2024, m: 7, d: 7 })).toBe('الأحد')
  })
})
