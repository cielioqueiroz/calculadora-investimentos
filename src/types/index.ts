export type RiskLevel = 'low' | 'medium' | 'high'

export type RateBasis = 'fixed' | 'cdi' | 'selic' | 'ipca'

export type InvestmentCategory = 'fixed-income' | 'savings' | 'treasury'

export type LiquidityKey = 'daily' | 'maturity'

export interface InvestmentType {
  id: string
  name: string
  shortName: string
  category: InvestmentCategory
  rateBasis: RateBasis
  defaultRate: number
  taxExempt: boolean
  fgcProtected: boolean
  risk: RiskLevel
  liquidity: LiquidityKey
  minInvestment: number
  color: string
}

export interface MarketRates {
  cdi: number
  selic: number
  ipca: number
}

export interface SimulationInput {
  investmentTypeId: string
  initialAmount: number
  monthlyContribution: number
  months: number
  annualRate: number
}

export interface MonthlyPoint {
  month: number
  invested: number
  interest: number
  grossBalance: number
}

export interface SimulationResult {
  investmentTypeId: string
  totalInvested: number
  grossBalance: number
  grossInterest: number
  taxRate: number
  taxAmount: number
  netBalance: number
  netInterest: number
  effectiveAnnualRate: number
  months: number
  breakdown: MonthlyPoint[]
}

export interface SavedSimulation {
  id: string
  name: string
  createdAt: string
  input: SimulationInput
  result: SimulationResult
}
