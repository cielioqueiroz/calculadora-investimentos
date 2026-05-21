import type { InvestmentType, SimulationResult } from '@/types'

export interface ComparisonRow {
  type: InvestmentType
  result: SimulationResult
}
