import { describe, expect, it } from 'vitest'
import { calcGosi } from './gosi'

describe('GOSI', () => {
  it('Saudi: 9.75% employee, 11.75% employer', () => {
    const r = calcGosi({ basic: 8000, housing: 2000, nationality: 'saudi' })
    expect(r.base).toBe(10000)
    expect(r.employeeTotal).toBe(975)
    expect(r.employerTotal).toBe(1175)
    expect(r.total).toBe(2150)
  })
  it('expat: only 2% occupational hazards, paid by the employer', () => {
    const r = calcGosi({ basic: 8000, housing: 2000, nationality: 'expat' })
    expect(r.employeeTotal).toBe(0)
    expect(r.employerTotal).toBe(200)
  })
  it('clamps the contribution base to 1,500 – 45,000', () => {
    const lo = calcGosi({ basic: 1000, housing: 0, nationality: 'saudi' })
    expect(lo.base).toBe(1500)
    expect(lo.clamped).toBe('min')
    const hi = calcGosi({ basic: 40000, housing: 10000, nationality: 'saudi' })
    expect(hi.base).toBe(45000)
    expect(hi.clamped).toBe('max')
    expect(hi.employeeTotal).toBe(4387.5)
  })
  it('no clamp inside the range', () => {
    expect(calcGosi({ basic: 5000, housing: 0, nationality: 'saudi' }).clamped).toBeNull()
  })
})
