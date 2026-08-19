import type {
  InvestmentType,
  MarketRates,
  MonthlyPoint,
  SimulationInput,
  SimulationResult,
} from '@/types'

export function resolveAnnualRate(
  type: InvestmentType,
  rates: MarketRates,
  customRate?: number,
): number {
  switch (type.rateBasis) {
    case 'cdi':
      return rates.cdi * (type.defaultRate / 100)
    case 'selic':
      return rates.selic * (type.defaultRate / 100)
    case 'ipca':
      return rates.ipca + type.defaultRate
    case 'custom':
      return customRate ?? type.customRate ?? type.defaultRate
    case 'fixed':
    default:
      return type.defaultRate
  }
}

export function monthlyRateFromAnnual(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1
}

export function incomeTaxRate(months: number): number {
  const days = months * 30
  if (days <= 180) return 0.225
  if (days <= 360) return 0.2
  if (days <= 720) return 0.175
  return 0.15
}

export function applyInflation(
  nominal: number,
  annualInflation: number,
  months: number,
): number {
  if (annualInflation === 0) return nominal
  const factor = Math.pow(1 + annualInflation / 100, months / 12)
  return nominal / factor
}

export function solveMonthlyContribution(
  target: number,
  initial: number,
  months: number,
  annualRate: number,
): number {
  if (months <= 0) return 0
  const i = monthlyRateFromAnnual(annualRate)
  const futureOfInitial = initial * Math.pow(1 + i, months)
  const remaining = target - futureOfInitial
  if (remaining <= 0) return 0
  if (i === 0) return remaining / months
  const annuityFactor = (Math.pow(1 + i, months) - 1) / i
  return remaining / annuityFactor
}

export function simulate(
  input: SimulationInput,
  taxExempt: boolean,
  inflationRate: number = 0,
  flatTaxRate?: number,
): SimulationResult {
  const { initialAmount, monthlyContribution, months, annualRate } = input
  const monthlyRate = monthlyRateFromAnnual(annualRate)

  const breakdown: MonthlyPoint[] = []
  let balance = initialAmount
  let invested = initialAmount

  breakdown.push({
    month: 0,
    invested,
    interest: 0,
    grossBalance: balance,
  })

  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution
    invested += monthlyContribution
    breakdown.push({
      month,
      invested,
      interest: balance - invested,
      grossBalance: balance,
    })
  }

  const grossBalance = balance
  const totalInvested = invested
  const grossInterest = grossBalance - totalInvested

  const taxRate = taxExempt
    ? 0
    : flatTaxRate !== undefined
      ? flatTaxRate
      : incomeTaxRate(months)
  const taxAmount = grossInterest > 0 ? grossInterest * taxRate : 0
  const netBalance = grossBalance - taxAmount
  const netInterest = grossInterest - taxAmount
  const realNetBalance = applyInflation(netBalance, inflationRate, months)

  return {
    investmentTypeId: input.investmentTypeId,
    totalInvested,
    grossBalance,
    grossInterest,
    taxRate,
    taxAmount,
    netBalance,
    netInterest,
    effectiveAnnualRate: annualRate,
    months,
    inflationRate,
    realNetBalance,
    breakdown,
  }
}
