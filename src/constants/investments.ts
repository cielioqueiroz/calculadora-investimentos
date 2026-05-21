import type { InvestmentType, MarketRates } from '@/types'

export const DEFAULT_MARKET_RATES: MarketRates = {
  cdi: 10.65,
  selic: 10.75,
  ipca: 4.5,
}

export const INVESTMENT_TYPES: InvestmentType[] = [
  {
    id: 'poupanca',
    name: 'Poupança',
    shortName: 'Poupança',
    category: 'savings',
    rateBasis: 'fixed',
    defaultRate: 6.17,
    taxExempt: true,
    fgcProtected: true,
    risk: 'low',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#22D3EE',
  },
  {
    id: 'cdb',
    name: 'CDB',
    shortName: 'CDB',
    category: 'fixed-income',
    rateBasis: 'cdi',
    defaultRate: 102,
    taxExempt: false,
    fgcProtected: true,
    risk: 'low',
    liquidity: 'maturity',
    minInvestment: 100,
    color: '#FFD700',
  },
  {
    id: 'lci-lca',
    name: 'LCI / LCA',
    shortName: 'LCI/LCA',
    category: 'fixed-income',
    rateBasis: 'cdi',
    defaultRate: 92,
    taxExempt: true,
    fgcProtected: true,
    risk: 'low',
    liquidity: 'maturity',
    minInvestment: 1000,
    color: '#34D399',
  },
  {
    id: 'tesouro-selic',
    name: 'Tesouro Selic',
    shortName: 'T. Selic',
    category: 'treasury',
    rateBasis: 'selic',
    defaultRate: 100,
    taxExempt: false,
    fgcProtected: false,
    risk: 'low',
    liquidity: 'daily',
    minInvestment: 50,
    color: '#818CF8',
  },
  {
    id: 'tesouro-prefixado',
    name: 'Tesouro Prefixado',
    shortName: 'T. Pré',
    category: 'treasury',
    rateBasis: 'fixed',
    defaultRate: 11.5,
    taxExempt: false,
    fgcProtected: false,
    risk: 'medium',
    liquidity: 'maturity',
    minInvestment: 50,
    color: '#F472B6',
  },
  {
    id: 'tesouro-ipca',
    name: 'Tesouro IPCA+',
    shortName: 'T. IPCA+',
    category: 'treasury',
    rateBasis: 'ipca',
    defaultRate: 6.0,
    taxExempt: false,
    fgcProtected: false,
    risk: 'medium',
    liquidity: 'maturity',
    minInvestment: 50,
    color: '#FB923C',
  },
]

export const INVESTMENT_TYPE_MAP: Record<string, InvestmentType> =
  Object.fromEntries(INVESTMENT_TYPES.map((type) => [type.id, type]))

export function getInvestmentType(id: string): InvestmentType | undefined {
  return INVESTMENT_TYPE_MAP[id]
}
