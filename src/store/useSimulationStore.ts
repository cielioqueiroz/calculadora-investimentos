import { create } from 'zustand'
import type {
  MarketRates,
  SavedSimulation,
  SimulationInput,
  SimulationResult,
} from '@/types'
import { DEFAULT_MARKET_RATES, getInvestmentType } from '@/constants/investments'
import { resolveAnnualRate, simulate } from '@/lib/calculations'
import {
  deleteSimulation,
  getSimulations,
  saveSimulation,
} from '@/lib/localStorage'

export interface SimulationParams {
  investmentTypeId: string
  initialAmount: number
  monthlyContribution: number
  months: number
}

const DEFAULT_PARAMS: SimulationParams = {
  investmentTypeId: 'cdb',
  initialAmount: 1000,
  monthlyContribution: 300,
  months: 24,
}

interface SimulationState {
  marketRates: MarketRates
  params: SimulationParams
  result: SimulationResult | null
  history: SavedSimulation[]
  comparisonIds: string[]
  setMarketRates: (rates: Partial<MarketRates>) => void
  setParams: (params: Partial<SimulationParams>) => void
  runSimulation: () => SimulationResult | null
  persistCurrent: (name: string) => void
  loadHistory: () => void
  removeSimulation: (id: string) => void
  loadFromHistory: (simulation: SavedSimulation) => void
  toggleComparison: (investmentTypeId: string) => void
}

function buildInput(
  params: SimulationParams,
  rates: MarketRates,
): { input: SimulationInput; taxExempt: boolean } | null {
  const type = getInvestmentType(params.investmentTypeId)
  if (!type) return null
  const annualRate = resolveAnnualRate(type, rates)
  return {
    input: {
      investmentTypeId: params.investmentTypeId,
      initialAmount: params.initialAmount,
      monthlyContribution: params.monthlyContribution,
      months: params.months,
      annualRate,
    },
    taxExempt: type.taxExempt,
  }
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  marketRates: DEFAULT_MARKET_RATES,
  params: DEFAULT_PARAMS,
  result: null,
  history: [],
  comparisonIds: ['cdb', 'poupanca', 'tesouro-selic'],

  setMarketRates: (rates) =>
    set((state) => ({ marketRates: { ...state.marketRates, ...rates } })),

  setParams: (params) =>
    set((state) => ({ params: { ...state.params, ...params } })),

  runSimulation: () => {
    const { params, marketRates } = get()
    const built = buildInput(params, marketRates)
    if (!built) return null
    const result = simulate(built.input, built.taxExempt)
    set({ result })
    return result
  },

  persistCurrent: (name) => {
    const { params, marketRates } = get()
    const built = buildInput(params, marketRates)
    if (!built) return
    const result = simulate(built.input, built.taxExempt)
    const simulation: SavedSimulation = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      input: built.input,
      result,
    }
    saveSimulation(simulation)
    set({ history: getSimulations() })
  },

  loadHistory: () => set({ history: getSimulations() }),

  removeSimulation: (id) => {
    deleteSimulation(id)
    set({ history: getSimulations() })
  },

  loadFromHistory: (simulation) =>
    set({
      params: {
        investmentTypeId: simulation.input.investmentTypeId,
        initialAmount: simulation.input.initialAmount,
        monthlyContribution: simulation.input.monthlyContribution,
        months: simulation.input.months,
      },
      result: simulation.result,
    }),

  toggleComparison: (investmentTypeId) =>
    set((state) => ({
      comparisonIds: state.comparisonIds.includes(investmentTypeId)
        ? state.comparisonIds.filter((id) => id !== investmentTypeId)
        : [...state.comparisonIds, investmentTypeId],
    })),
}))
