import type { MarketResult, MarketSource, Quote } from './types'

export const SNAPSHOTS: Record<MarketSource, Quote[]> = {
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 380000, currency: 'BRL', changePercent: 1.2, marketCap: 7.5e12, sparkline: [360000, 365000, 372000, 369000, 378000, 376000, 380000] },
    { symbol: 'ETH', name: 'Ethereum', price: 19500, currency: 'BRL', changePercent: -0.8, marketCap: 2.3e12, sparkline: [19800, 19600, 19400, 19550, 19300, 19450, 19500] },
    { symbol: 'SOL', name: 'Solana', price: 920, currency: 'BRL', changePercent: 3.4, marketCap: 4.4e11, sparkline: [880, 895, 905, 900, 915, 910, 920] },
    { symbol: 'BNB', name: 'BNB', price: 3200, currency: 'BRL', changePercent: 0.6, marketCap: 4.6e11, sparkline: [3170, 3185, 3190, 3180, 3205, 3195, 3200] },
    { symbol: 'XRP', name: 'XRP', price: 3.1, currency: 'BRL', changePercent: -1.5, marketCap: 1.7e11, sparkline: [3.2, 3.18, 3.15, 3.16, 3.12, 3.13, 3.1] },
  ],
  forex: [
    { symbol: 'USD', name: 'Dólar', price: 5.42, currency: 'BRL', changePercent: 0.3, sparkline: [5.39, 5.4, 5.41, 5.43, 5.42, 5.41, 5.42] },
    { symbol: 'EUR', name: 'Euro', price: 5.88, currency: 'BRL', changePercent: -0.2, sparkline: [5.9, 5.89, 5.87, 5.88, 5.86, 5.88, 5.88] },
    { symbol: 'GBP', name: 'Libra', price: 6.85, currency: 'BRL', changePercent: 0.1, sparkline: [6.84, 6.85, 6.86, 6.85, 6.84, 6.85, 6.85] },
    { symbol: 'JPY', name: 'Iene', price: 0.036, currency: 'BRL', changePercent: -0.4, sparkline: [0.0362, 0.0361, 0.036, 0.0359, 0.036, 0.036, 0.036] },
    { symbol: 'CNY', name: 'Yuan', price: 0.74, currency: 'BRL', changePercent: 0.05, sparkline: [0.739, 0.74, 0.741, 0.74, 0.739, 0.74, 0.74] },
  ],
  b3: [
    { symbol: '^BVSP', name: 'Ibovespa', price: 128500, currency: 'BRL', changePercent: 0.7 },
    { symbol: 'PETR4', name: 'Petrobras', price: 38.2, currency: 'BRL', changePercent: 1.1 },
    { symbol: 'VALE3', name: 'Vale', price: 61.4, currency: 'BRL', changePercent: -0.6 },
    { symbol: 'ITUB4', name: 'Itaú', price: 34.8, currency: 'BRL', changePercent: 0.4 },
    { symbol: 'BBDC4', name: 'Bradesco', price: 14.9, currency: 'BRL', changePercent: -0.3 },
    { symbol: 'ABEV3', name: 'Ambev', price: 12.6, currency: 'BRL', changePercent: 0.2 },
  ],
}

const PREFIX = 'investment-calculator:market:'

export function readCache(source: MarketSource): MarketResult<Quote[]> | null {
  try {
    const raw = localStorage.getItem(PREFIX + source)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data: Quote[]; updatedAt: number }
    if (!Array.isArray(parsed.data)) return null
    return { data: parsed.data, updatedAt: parsed.updatedAt, status: 'stale' }
  } catch {
    return null
  }
}

export function writeCache(source: MarketSource, data: Quote[]): void {
  try {
    localStorage.setItem(
      PREFIX + source,
      JSON.stringify({ data, updatedAt: Date.now() }),
    )
  } catch (error) {
    console.error('Could not persist market cache.', error)
  }
}
