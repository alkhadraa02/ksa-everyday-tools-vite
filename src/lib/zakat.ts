import { round2 } from './format'

export const ZAKAT_RATE = 0.025
export const GOLD_NISAB_GRAMS = 85
export const SILVER_NISAB_GRAMS = 595

export type NisabBasis = 'gold' | 'silver'

export interface ZakatInput {
  cash: number
  goldGrams: number
  goldPricePerGram: number
  silverGrams: number
  silverPricePerGram: number
  tradeGoods: number
  debts: number
  basis: NisabBasis
}

export interface ZakatResult {
  totalAssets: number
  netWealth: number
  nisabGrams: number
  nisabValue: number
  /** True when the chosen metal price is missing so the nisab cannot be valued. */
  needsPrice: boolean
  isDue: boolean
  zakat: number
}

export function calcZakat(i: ZakatInput): ZakatResult {
  const totalAssets = round2(
    i.cash + i.goldGrams * i.goldPricePerGram + i.silverGrams * i.silverPricePerGram + i.tradeGoods,
  )
  const netWealth = round2(Math.max(0, totalAssets - i.debts))
  const nisabGrams = i.basis === 'gold' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS
  const price = i.basis === 'gold' ? i.goldPricePerGram : i.silverPricePerGram
  const nisabValue = round2(nisabGrams * price)
  const needsPrice = !(price > 0)
  const isDue = !needsPrice && netWealth >= nisabValue
  return {
    totalAssets,
    netWealth,
    nisabGrams,
    nisabValue,
    needsPrice,
    isDue,
    zakat: isDue ? round2(netWealth * ZAKAT_RATE) : 0,
  }
}
