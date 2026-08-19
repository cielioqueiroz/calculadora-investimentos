import { describe, it, expect } from 'vitest'
import {
  applyInflation,
  incomeTaxRate,
  monthlyRateFromAnnual,
  resolveAnnualRate,
  simulate,
  solveMonthlyContribution,
} from './calculations'
import type { InvestmentType, MarketRates, SimulationInput } from '@/types'

const rates: MarketRates = { cdi: 10, selic: 10, ipca: 4 }

function makeType(overrides: Partial<InvestmentType>): InvestmentType {
  return {
    id: 'test',
    name: 'Test',
    shortName: 'Test',
    category: 'fixed-income',
    rateBasis: 'fixed',
    defaultRate: 10,
    taxExempt: false,
    fgcProtected: false,
    risk: 'low',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#000000',
    ...overrides,
  }
}

describe('resolveAnnualRate', () => {
  it('returns the fixed rate as-is', () => {
    expect(resolveAnnualRate(makeType({ rateBasis: 'fixed', defaultRate: 11.5 }), rates)).toBe(11.5)
  })

  it('applies the CDI percentage', () => {
    expect(resolveAnnualRate(makeType({ rateBasis: 'cdi', defaultRate: 102 }), rates)).toBeCloseTo(10.2)
  })

  it('applies the Selic percentage', () => {
    expect(resolveAnnualRate(makeType({ rateBasis: 'selic', defaultRate: 100 }), rates)).toBe(10)
  })

  it('adds the IPCA spread to inflation', () => {
    expect(resolveAnnualRate(makeType({ rateBasis: 'ipca', defaultRate: 6 }), rates)).toBe(10)
  })
})

describe('monthlyRateFromAnnual', () => {
  it('converts an annual rate to its monthly equivalent', () => {
    expect(monthlyRateFromAnnual(12.682503)).toBeCloseTo(0.01, 5)
  })

  it('returns zero for a zero rate', () => {
    expect(monthlyRateFromAnnual(0)).toBe(0)
  })
})

describe('incomeTaxRate', () => {
  it('charges 22.5% up to 180 days', () => {
    expect(incomeTaxRate(6)).toBe(0.225)
  })

  it('charges 20% between 181 and 360 days', () => {
    expect(incomeTaxRate(7)).toBe(0.2)
    expect(incomeTaxRate(12)).toBe(0.2)
  })

  it('charges 17.5% between 361 and 720 days', () => {
    expect(incomeTaxRate(13)).toBe(0.175)
    expect(incomeTaxRate(24)).toBe(0.175)
  })

  it('charges 15% above 720 days', () => {
    expect(incomeTaxRate(25)).toBe(0.15)
    expect(incomeTaxRate(60)).toBe(0.15)
  })
})

describe('applyInflation', () => {
  it('discounts nominal value by accumulated inflation', () => {
    expect(applyInflation(1100, 10, 12)).toBeCloseTo(1000, 2)
  })
  it('returns the nominal value when inflation is zero', () => {
    expect(applyInflation(1000, 0, 24)).toBe(1000)
  })
})

describe('solveMonthlyContribution', () => {
  it('returns 0 when the initial amount already reaches the target', () => {
    expect(solveMonthlyContribution(1000, 2000, 12, 10)).toBe(0)
  })
  it('solves a positive contribution and round-trips through simulate', () => {
    const target = 50_000
    const pmt = solveMonthlyContribution(target, 1000, 60, 8)
    expect(pmt).toBeGreaterThan(0)
    const result = simulate(
      { investmentTypeId: 'test', initialAmount: 1000, monthlyContribution: pmt, months: 60, annualRate: 8 },
      true,
    )
    expect(result.grossBalance).toBeCloseTo(target, 0)
  })
  it('handles a zero rate as plain division', () => {
    expect(solveMonthlyContribution(1200, 0, 12, 0)).toBeCloseTo(100, 5)
  })
})

describe('simulate real return', () => {
  it('fills realNetBalance below nominal when inflation is positive', () => {
    const result = simulate(
      { investmentTypeId: 'test', initialAmount: 1000, monthlyContribution: 0, months: 12, annualRate: 12.682503 },
      true,
      10,
    )
    expect(result.inflationRate).toBe(10)
    expect(result.realNetBalance).toBeLessThan(result.netBalance)
  })
})

describe('custom rate and flat tax', () => {
  it('resolveAnnualRate returns the provided custom rate', () => {
    const type = makeType({ rateBasis: 'custom' })
    expect(resolveAnnualRate(type, rates, 18.5)).toBe(18.5)
  })
  it('simulate applies a flat tax instead of the regressive table', () => {
    const result = simulate(
      { investmentTypeId: 'test', initialAmount: 1000, monthlyContribution: 0, months: 60, annualRate: 12.682503 },
      false,
      0,
      0.15,
    )
    expect(result.taxRate).toBe(0.15)
    expect(result.taxAmount).toBeCloseTo(result.grossInterest * 0.15, 5)
  })
})

describe('simulate', () => {
  const baseInput: SimulationInput = {
    investmentTypeId: 'test',
    initialAmount: 1000,
    monthlyContribution: 0,
    months: 12,
    annualRate: 12.682503,
  }

  it('compounds a single deposit without contributions', () => {
    const result = simulate(baseInput, true)
    expect(result.grossBalance).toBeCloseTo(1126.83, 1)
    expect(result.totalInvested).toBe(1000)
    expect(result.grossInterest).toBeCloseTo(126.83, 1)
  })

  it('includes the starting point and one entry per month', () => {
    const result = simulate(baseInput, true)
    expect(result.breakdown).toHaveLength(13)
    expect(result.breakdown[0]).toMatchObject({ month: 0, invested: 1000, interest: 0 })
  })

  it('sums monthly contributions into total invested', () => {
    const result = simulate({ ...baseInput, monthlyContribution: 100 }, true)
    expect(result.totalInvested).toBe(2200)
  })

  it('does not deduct tax for exempt investments', () => {
    const result = simulate(baseInput, true)
    expect(result.taxRate).toBe(0)
    expect(result.taxAmount).toBe(0)
    expect(result.netBalance).toBe(result.grossBalance)
  })

  it('deducts income tax on the gains for taxable investments', () => {
    const result = simulate(baseInput, false)
    expect(result.taxRate).toBe(0.2)
    expect(result.taxAmount).toBeCloseTo(result.grossInterest * 0.2, 5)
    expect(result.netBalance).toBeCloseTo(result.grossBalance - result.taxAmount, 5)
  })

  it('never charges tax when there are no gains', () => {
    const result = simulate({ ...baseInput, annualRate: 0 }, false)
    expect(result.grossInterest).toBe(0)
    expect(result.taxAmount).toBe(0)
  })
})
