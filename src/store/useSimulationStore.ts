import { create } from 'zustand'
import type {
  MarketRates,
  SavedSimulation,
  SimulationInput,
  SimulationResult,
} from '@/types'
import {
  DEFAULT_MARKET_RATES,
  DEFAULT_INFLATION,
  getInvestmentType,
} from '@/constants/investments'
import {
  resolveAnnualRate,
  simulate,
  solveMonthlyContribution,
} from '@/lib/calculations'
import {
  deleteSimulation,
  getSimulations,
  saveSimulation,
} from '@/lib/localStorage'

export type SimulationMode = 'project' | 'goal'

export interface SimulationParams {
  investmentTypeId: string
  initialAmount: number
  monthlyContribution: number
  months: number
  customRate: number
  inflationRate: number
  mode: SimulationMode
  targetAmount: number
}

const DEFAULT_PARAMS: SimulationParams = {
  investmentTypeId: 'cdb',
  initialAmount: 1000,
  monthlyContribution: 300,
  months: 24,
  customRate: 12,
  inflationRate: DEFAULT_INFLATION,
  mode: 'project',
  targetAmount: 100000,
}

interface SimulationState {
  marketRates: MarketRates
  params: SimulationParams
  result: SimulationResult | null
  history: SavedSimulation[]
  comparisonIds: string[]
  setMarketRates: (rates: Partial<MarketRates>) => void
  setParams: (params: Partial<SimulationParams>) => void
  setCustomRate: (rate: number) => void
  setMode: (mode: SimulationMode) => void
  setTarget: (value: number) => void
  runSimulation: () => SimulationResult | null
  persistCurrent: (name: string) => void
  loadHistory: () => void
  removeSimulation: (id: string) => void
  loadFromHistory: (simulation: SavedSimulation) => void
  toggleComparison: (investmentTypeId: string) => void
}

interface BuiltInput {
  input: SimulationInput
  taxExempt: boolean
  inflationRate: number
  flatTaxRate?: number
}

function buildInput(
  params: SimulationParams,
  rates: MarketRates,
): BuiltInput | null {
  const type = getInvestmentType(params.investmentTypeId)
  if (!type) return null
  const annualRate = resolveAnnualRate(type, rates, params.customRate)
  const monthlyContribution =
    params.mode === 'goal'
      ? solveMonthlyContribution(
          params.targetAmount,
          params.initialAmount,
          params.months,
          annualRate,
        )
      : params.monthlyContribution
  return {
    input: {
      investmentTypeId: params.investmentTypeId,
      initialAmount: params.initialAmount,
      monthlyContribution,
      months: params.months,
      annualRate,
    },
    taxExempt: type.taxExempt,
    inflationRate: params.inflationRate,
    flatTaxRate: type.flatTaxRate,
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

  setCustomRate: (customRate) =>
    set((state) => ({ params: { ...state.params, customRate } })),

  setMode: (mode) => set((state) => ({ params: { ...state.params, mode } })),

  setTarget: (targetAmount) =>
    set((state) => ({ params: { ...state.params, targetAmount } })),

  runSimulation: () => {
    const { params, marketRates } = get()
    const built = buildInput(params, marketRates)
    if (!built) return null
    const result = simulate(
      built.input,
      built.taxExempt,
      built.inflationRate,
      built.flatTaxRate,
    )
    set({ result })
    return result
  },

  persistCurrent: (name) => {
    const { params, marketRates } = get()
    const built = buildInput(params, marketRates)
    if (!built) return
    const result = simulate(
      built.input,
      built.taxExempt,
      built.inflationRate,
      built.flatTaxRate,
    )
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
    set((state) => ({
      params: {
        ...state.params,
        investmentTypeId: simulation.input.investmentTypeId,
        initialAmount: simulation.input.initialAmount,
        monthlyContribution: simulation.input.monthlyContribution,
        months: simulation.input.months,
        customRate: simulation.input.annualRate,
        inflationRate: simulation.result.inflationRate ?? state.params.inflationRate,
        mode: 'project',
      },
      result: simulation.result,
    })),

  toggleComparison: (investmentTypeId) =>
    set((state) => ({
      comparisonIds: state.comparisonIds.includes(investmentTypeId)
        ? state.comparisonIds.filter((id) => id !== investmentTypeId)
        : [...state.comparisonIds, investmentTypeId],
    })),
}))
