import { describe, expect, it } from 'vitest'
import { addVat, extractVat, VAT_RATE } from './vat'

describe('VAT', () => {
  it('uses the Saudi 15% rate', () => {
    expect(VAT_RATE).toBe(0.15)
  })
  it('adds 15% on top of a net amount', () => {
    expect(addVat(100)).toEqual({ net: 100, vat: 15, gross: 115 })
    expect(addVat(1234.56)).toEqual({ net: 1234.56, vat: 185.18, gross: 1419.74 })
  })
  it('extracts VAT from a gross amount', () => {
    expect(extractVat(115)).toEqual({ net: 100, vat: 15, gross: 115 })
    expect(extractVat(100)).toEqual({ net: 86.96, vat: 13.04, gross: 100 })
  })
  it('gross = net + vat after extraction', () => {
    const r = extractVat(987.65)
    expect(Math.round((r.net + r.vat) * 100) / 100).toBe(r.gross)
  })
  it('handles zero', () => {
    expect(addVat(0)).toEqual({ net: 0, vat: 0, gross: 0 })
    expect(extractVat(0)).toEqual({ net: 0, vat: 0, gross: 0 })
  })
})
