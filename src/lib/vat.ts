import { round2 } from './format'

export const VAT_RATE = 0.15

export interface VatResult {
  net: number
  vat: number
  gross: number
}

/** Price excluding VAT -> add VAT on top. */
export function addVat(net: number, rate: number = VAT_RATE): VatResult {
  const vat = round2(net * rate)
  return { net: round2(net), vat, gross: round2(net + vat) }
}

/** Price including VAT -> extract the net and the VAT portion. */
export function extractVat(gross: number, rate: number = VAT_RATE): VatResult {
  const net = round2(gross / (1 + rate))
  return { net, vat: round2(gross - net), gross: round2(gross) }
}
