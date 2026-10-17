import { describe, expect, it } from 'vitest'
import { calcZakat, type ZakatInput } from './zakat'

const base: ZakatInput = {
  cash: 0,
  goldGrams: 0,
  goldPricePerGram: 0,
  silverGrams: 0,
  silverPricePerGram: 0,
  tradeGoods: 0,
  debts: 0,
  basis: 'silver',
}

describe('zakat', () => {
  it('nisab is 595g silver or 85g gold', () => {
    expect(calcZakat({ ...base, silverPricePerGram: 3 }).nisabValue).toBe(1785)
    expect(calcZakat({ ...base, basis: 'gold', goldPricePerGram: 300 }).nisabValue).toBe(25500)
  })
  it('charges 2.5% when wealth reaches nisab', () => {
    const r = calcZakat({ ...base, cash: 100000, silverPricePerGram: 3 })
    expect(r.isDue).toBe(true)
    expect(r.zakat).toBe(2500)
  })
  it('charges nothing below nisab', () => {
    const r = calcZakat({ ...base, cash: 20000, basis: 'gold', goldPricePerGram: 300 })
    expect(r.isDue).toBe(false)
    expect(r.zakat).toBe(0)
  })
  it('is due exactly at nisab', () => {
    const r = calcZakat({ ...base, cash: 25500, basis: 'gold', goldPricePerGram: 300 })
    expect(r.isDue).toBe(true)
    expect(r.zakat).toBe(637.5)
  })
  it('values gold, silver and trade goods and deducts debts', () => {
    const r = calcZakat({
      ...base,
      cash: 10000,
      goldGrams: 100,
      goldPricePerGram: 300,
      silverGrams: 100,
      silverPricePerGram: 3,
      tradeGoods: 5000,
      debts: 5300,
      basis: 'gold',
    })
    expect(r.totalAssets).toBe(45300)
    expect(r.netWealth).toBe(40000)
    expect(r.zakat).toBe(1000)
  })
  it('asks for the metal price instead of guessing', () => {
    const r = calcZakat({ ...base, cash: 1000000 })
    expect(r.needsPrice).toBe(true)
    expect(r.isDue).toBe(false)
  })
  it('never goes negative with large debts', () => {
    expect(calcZakat({ ...base, cash: 100, debts: 500, silverPricePerGram: 3 }).netWealth).toBe(0)
  })
})
