import { describe, expect, it } from 'vitest'
import { addMonths, utcMs, fromMs, DAY_MS } from './dates'
import {
  formatHijri,
  gregorianToHijri,
  hijriMonthLength,
  hijriToGregorian,
} from './hijri'

describe('Umm al-Qura converter', () => {
  it('1 Muharram 1446 = 7 July 2024', () => {
    expect(gregorianToHijri({ y: 2024, m: 7, d: 7 })).toEqual({ y: 1446, m: 1, d: 1 })
    expect(hijriToGregorian({ y: 1446, m: 1, d: 1 })).toEqual({ y: 2024, m: 7, d: 7 })
  })
  it('Eid al-Fitr 1445 (1 Shawwal) = 10 April 2024', () => {
    expect(hijriToGregorian({ y: 1445, m: 10, d: 1 })).toEqual({ y: 2024, m: 4, d: 10 })
  })
  it('Eid al-Adha 1445 (10 Dhul Hijjah) = 16 June 2024', () => {
    expect(hijriToGregorian({ y: 1445, m: 12, d: 10 })).toEqual({ y: 2024, m: 6, d: 16 })
  })
  it('Saudi National Day 23 Sep 2024 maps into Rabi al-Awwal 1446', () => {
    const h = gregorianToHijri({ y: 2024, m: 9, d: 23 })!
    expect(h.y).toBe(1446)
    expect(h.m).toBe(3)
  })
  it('round-trips Gregorian -> Hijri -> Gregorian over a decade', () => {
    let ms = utcMs(2018, 1, 1)
    const end = utcMs(2028, 1, 1)
    while (ms < end) {
      const g = fromMs(ms)
      const h = gregorianToHijri(g)!
      expect(hijriToGregorian(h)).toEqual(g)
      ms += 11 * DAY_MS
    }
  })
  it('rejects day 30 in a 29-day month and out-of-range years', () => {
    const len = hijriMonthLength(1446, 1)!
    expect([29, 30]).toContain(len)
    if (len === 29) expect(hijriToGregorian({ y: 1446, m: 1, d: 30 })).toBeNull()
    expect(hijriToGregorian({ y: 1446, m: 13, d: 1 })).toBeNull()
    expect(hijriToGregorian({ y: 1000, m: 1, d: 1 })).toBeNull()
    expect(gregorianToHijri({ y: 1500, m: 1, d: 1 })).toBeNull()
  })
  it('every Hijri month has 29 or 30 days', () => {
    for (let m = 1; m <= 12; m++) expect([29, 30]).toContain(hijriMonthLength(1447, m))
  })
  it('formats in Arabic', () => {
    expect(formatHijri({ y: 1446, m: 9, d: 1 })).toBe('1 رمضان 1446هـ')
  })
  it('helper sanity: addMonths is exported from dates', () => {
    expect(addMonths({ y: 2024, m: 1, d: 1 }, 1).m).toBe(2)
  })
})
