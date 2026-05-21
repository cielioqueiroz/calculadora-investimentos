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
): number {
  switch (type.rateBasis) {
    case 'cdi':
      return rates.cdi * (type.defaultRate / 100)
    case 'selic':
      return rates.selic * (type.defaultRate / 100)
    case 'ipca':
      return rates.ipca + type.defaultRate
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

export function simulate(
  input: SimulationInput,
  taxExempt: boolean,
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

  const taxRate = taxExempt ? 0 : incomeTaxRate(months)
  const taxAmount = grossInterest > 0 ? grossInterest * taxRate : 0
  const netBalance = grossBalance - taxAmount
  const netInterest = grossInterest - taxAmount

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
    breakdown,
  }
}
