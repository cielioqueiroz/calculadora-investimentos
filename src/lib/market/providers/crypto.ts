import { z } from 'zod'
import type { Quote, Reading } from '../types'

const COIN_IDS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple']

const schema = z.array(
  z.object({
    symbol: z.string(),
    name: z.string(),
    current_price: z.number(),
    price_change_percentage_24h: z.number().nullable().optional(),
    market_cap: z.number().nullable().optional(),
    sparkline_in_7d: z.object({ price: z.array(z.number()) }).optional(),
  }),
)

export function mapCoinGecko(raw: unknown): Quote[] {
  const parsed = schema.parse(raw)
  return parsed.map((coin) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    currency: 'BRL' as const,
    changePercent: coin.price_change_percentage_24h ?? 0,
    marketCap: coin.market_cap ?? undefined,
    sparkline: coin.sparkline_in_7d?.price,
  }))
}

export async function fetchCrypto(signal?: AbortSignal): Promise<Reading> {
  const url =
    'https://api.coingecko.com/api/v3/coins/markets' +
    `?vs_currency=brl&ids=${COIN_IDS.join(',')}` +
    '&order=market_cap_desc&sparkline=true&price_change_percentage=24h'
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`)
  return { data: mapCoinGecko(await res.json()) }
}
