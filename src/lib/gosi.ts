import { round2 } from './format'

/** GOSI contribution estimate (private sector). Rates are configurable constants. */
export const GOSI_MIN_BASE = 1500
export const GOSI_MAX_BASE = 45000

export const GOSI_RATES = {
  annuitiesEmployee: 0.09,
  annuitiesEmployer: 0.09,
  sanedEmployee: 0.0075,
  sanedEmployer: 0.0075,
  hazardsEmployer: 0.02,
} as const

export type Nationality = 'saudi' | 'expat'

export interface GosiInput {
  basic: number
  housing: number
  nationality: Nationality
}

export interface GosiLine {
  key: string
  label: string
  rate: number
  amount: number
}

export interface GosiResult {
  rawBase: number
  base: number
  clamped: 'min' | 'max' | null
  employee: GosiLine[]
  employer: GosiLine[]
  employeeTotal: number
  employerTotal: number
  total: number
}

function line(key: string, label: string, rate: number, base: number): GosiLine {
  return { key, label, rate, amount: round2(base * rate) }
}

export function calcGosi({ basic, housing, nationality }: GosiInput): GosiResult {
  const rawBase = round2(basic + housing)
  const base = Math.min(Math.max(rawBase, GOSI_MIN_BASE), GOSI_MAX_BASE)
  const clamped = rawBase < GOSI_MIN_BASE ? 'min' : rawBase > GOSI_MAX_BASE ? 'max' : null
  const employee: GosiLine[] = []
  const employer: GosiLine[] = []
  if (nationality === 'saudi') {
    employee.push(line('ann-ee', 'المعاشات (الموظف)', GOSI_RATES.annuitiesEmployee, base))
    employee.push(line('saned-ee', 'ساند (الموظف)', GOSI_RATES.sanedEmployee, base))
    employer.push(line('ann-er', 'المعاشات (صاحب العمل)', GOSI_RATES.annuitiesEmployer, base))
    employer.push(line('saned-er', 'ساند (صاحب العمل)', GOSI_RATES.sanedEmployer, base))
  }
  employer.push(line('haz-er', 'الأخطار المهنية (صاحب العمل)', GOSI_RATES.hazardsEmployer, base))
  const sum = (ls: GosiLine[]) => round2(ls.reduce((a, l) => a + l.amount, 0))
  const employeeTotal = sum(employee)
  const employerTotal = sum(employer)
  return {
    rawBase,
    base,
    clamped,
    employee,
    employer,
    employeeTotal,
    employerTotal,
    total: round2(employeeTotal + employerTotal),
  }
}
