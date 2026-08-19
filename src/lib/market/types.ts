export type MarketStatus = 'live' | 'stale' | 'snapshot'

export type MarketSource = 'crypto' | 'forex' | 'b3'

export interface Quote {
  symbol: string
  name: string
  price: number
  currency: 'BRL' | 'USD'
  changePercent: number
  marketCap?: number
  sparkline?: number[]
}

/** What a provider returns: the quotes plus, when known, when they were produced. */
export interface Reading {
  data: Quote[]
  updatedAt?: number
}

export interface MarketResult<T> {
  data: T
  status: MarketStatus
  updatedAt: number
}
