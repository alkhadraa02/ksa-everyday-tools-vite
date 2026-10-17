import { round2 } from './format'

/**
 * End-of-service award per the Saudi Labor Law:
 * - Art. 84: half a month's wage for each of the first five years, a full month for each year after.
 * - Art. 85: on resignation — nothing under 2 years, 1/3 from 2 to under 5,
 *   2/3 from 5 to under 10, the full award from 10 years.
 * - Art. 80: dismissal for the listed causes — no award.
 * - Art. 81: worker leaves for a legitimate cause — full award.
 */
export type EosReason = 'termination' | 'resignation' | 'dismissal80' | 'leave81'

export interface EosInput {
  /** Last monthly wage (basic + regular allowances). */
  wage: number
  /** Service length in (fractional) years. */
  years: number
  reason: EosReason
}

export interface EosResult {
  firstFiveYears: number
  afterFiveYears: number
  fullAward: number
  fraction: number
  award: number
}

/** Fractional years from a whole years/months/days split (a month = 30 days). */
export function serviceYears(y: number, m: number, d: number): number {
  return (y * 12 + m + d / 30) / 12
}

export function resignationFraction(years: number): number {
  if (years < 2) return 0
  if (years < 5) return 1 / 3
  if (years < 10) return 2 / 3
  return 1
}

export function reasonFraction(reason: EosReason, years: number): number {
  switch (reason) {
    case 'termination':
    case 'leave81':
      return 1
    case 'dismissal80':
      return 0
    case 'resignation':
      return resignationFraction(years)
  }
}

export function calcEos({ wage, years, reason }: EosInput): EosResult {
  const firstFiveYears = round2(Math.min(years, 5) * (wage / 2))
  const afterFiveYears = round2(Math.max(years - 5, 0) * wage)
  const fullAward = round2(firstFiveYears + afterFiveYears)
  const fraction = reasonFraction(reason, years)
  return { firstFiveYears, afterFiveYears, fullAward, fraction, award: round2(fullAward * fraction) }
}
