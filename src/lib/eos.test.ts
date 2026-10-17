import { describe, expect, it } from 'vitest'
import { calcEos, resignationFraction, serviceYears } from './eos'

describe('end of service', () => {
  it('computes service years from y/m/d', () => {
    expect(serviceYears(3, 6, 0)).toBe(3.5)
    expect(serviceYears(1, 0, 15)).toBeCloseTo(1.0417, 3)
  })
  it('half a month per year for the first five years', () => {
    const r = calcEos({ wage: 10000, years: 3, reason: 'termination' })
    expect(r.firstFiveYears).toBe(15000)
    expect(r.afterFiveYears).toBe(0)
    expect(r.award).toBe(15000)
  })
  it('a full month per year after five years', () => {
    const r = calcEos({ wage: 10000, years: 8, reason: 'termination' })
    expect(r.firstFiveYears).toBe(25000)
    expect(r.afterFiveYears).toBe(30000)
    expect(r.award).toBe(55000)
  })
  it('resignation tiers: 0, 1/3, 2/3, full', () => {
    expect(resignationFraction(1.99)).toBe(0)
    expect(resignationFraction(2)).toBeCloseTo(1 / 3)
    expect(resignationFraction(4.99)).toBeCloseTo(1 / 3)
    expect(resignationFraction(5)).toBeCloseTo(2 / 3)
    expect(resignationFraction(9.99)).toBeCloseTo(2 / 3)
    expect(resignationFraction(10)).toBe(1)
  })
  it('applies the resignation fraction to the award', () => {
    expect(calcEos({ wage: 10000, years: 1.5, reason: 'resignation' }).award).toBe(0)
    expect(calcEos({ wage: 10000, years: 3, reason: 'resignation' }).award).toBe(5000)
    expect(calcEos({ wage: 10000, years: 8, reason: 'resignation' }).award).toBe(36666.67)
    expect(calcEos({ wage: 10000, years: 12, reason: 'resignation' }).award).toBe(95000)
  })
  it('dismissal under Art. 80 gets nothing, Art. 81 gets the full award', () => {
    expect(calcEos({ wage: 10000, years: 12, reason: 'dismissal80' }).award).toBe(0)
    expect(calcEos({ wage: 10000, years: 3, reason: 'leave81' }).award).toBe(15000)
  })
  it('zero service gives zero', () => {
    expect(calcEos({ wage: 10000, years: 0, reason: 'termination' }).award).toBe(0)
  })
})
