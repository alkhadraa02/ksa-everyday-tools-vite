import { describe, expect, it } from 'vitest'
import { integerToWords, sarToWords } from './words'

describe('Arabic number to words', () => {
  it('small numbers', () => {
    expect(integerToWords(0)).toBe('صفر')
    expect(integerToWords(1)).toBe('واحد')
    expect(integerToWords(2)).toBe('اثنان')
    expect(integerToWords(10)).toBe('عشرة')
    expect(integerToWords(11)).toBe('أحد عشر')
    expect(integerToWords(12)).toBe('اثنا عشر')
    expect(integerToWords(21)).toBe('واحد وعشرون')
    expect(integerToWords(99)).toBe('تسعة وتسعون')
  })
  it('hundreds', () => {
    expect(integerToWords(100)).toBe('مئة')
    expect(integerToWords(101)).toBe('مئة وواحد')
    expect(integerToWords(200)).toBe('مئتان')
    expect(integerToWords(300)).toBe('ثلاثمئة')
    expect(integerToWords(999)).toBe('تسعمئة وتسعة وتسعون')
  })
  it('thousands', () => {
    expect(integerToWords(1000)).toBe('ألف')
    expect(integerToWords(2000)).toBe('ألفان')
    expect(integerToWords(3000)).toBe('ثلاثة آلاف')
    expect(integerToWords(11000)).toBe('أحد عشر ألفاً')
    expect(integerToWords(2500)).toBe('ألفان وخمسمئة')
    expect(integerToWords(101000)).toBe('مئة وألف')
    expect(integerToWords(102000)).toBe('مئة وألفان')
    expect(integerToWords(100000)).toBe('مئة ألف')
    expect(integerToWords(200000)).toBe('مئتا ألف')
    expect(integerToWords(300000)).toBe('ثلاثمئة ألف')
  })
  it('millions and billions', () => {
    expect(integerToWords(1_000_000)).toBe('مليون')
    expect(integerToWords(2_000_000)).toBe('مليونان')
    expect(integerToWords(5_000_000)).toBe('خمسة ملايين')
    expect(integerToWords(1_234_567)).toBe('مليون ومئتان وأربعة وثلاثون ألفاً وخمسمئة وسبعة وستون')
    expect(integerToWords(3_000_000_000)).toBe('ثلاثة مليارات')
  })
  it('feminine forms', () => {
    expect(integerToWords(3, true)).toBe('ثلاث')
    expect(integerToWords(13, true)).toBe('ثلاث عشرة')
    expect(integerToWords(25, true)).toBe('خمس وعشرون')
  })
  it('rejects invalid input', () => {
    expect(integerToWords(-1)).toBeNull()
    expect(integerToWords(1.5)).toBeNull()
    expect(integerToWords(1e16)).toBeNull()
  })
})

describe('SAR in words', () => {
  it('riyals only', () => {
    expect(sarToWords(1)?.text).toBe('ريال واحد فقط لا غير')
    expect(sarToWords(2)?.text).toBe('ريالان فقط لا غير')
    expect(sarToWords(5)?.text).toBe('خمسة ريالات فقط لا غير')
    expect(sarToWords(125)?.text).toBe('مئة وخمسة وعشرون ريالاً فقط لا غير')
    expect(sarToWords(100)?.text).toBe('مئة ريال فقط لا غير')
  })
  it('riyals and halalas', () => {
    expect(sarToWords(125.5)?.text).toBe('مئة وخمسة وعشرون ريالاً وخمسون هللة فقط لا غير')
    expect(sarToWords(0.01)?.text).toBe('هللة واحدة فقط لا غير')
    expect(sarToWords(3.03)?.text).toBe('ثلاثة ريالات وثلاث هللات فقط لا غير')
  })
  it('zero and invalid', () => {
    expect(sarToWords(0)?.text).toBe('صفر ريال فقط لا غير')
    expect(sarToWords(-5)).toBeNull()
  })
  it('splits halalas without float drift', () => {
    const r = sarToWords(1.15)!
    expect(r.riyals).toBe(1)
    expect(r.halalas).toBe(15)
  })
})
