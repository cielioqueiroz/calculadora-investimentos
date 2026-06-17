import { z } from 'zod'
import type { Quote } from '../types'

const TICKERS = [
  '^BVSP',
  'PETR4',
  'VALE3',
  'ITUB4',
  'BBDC4',
  'ABEV3',
  'B3SA3',
  'WEGE3',
  'BBAS3',
  'ITSA4',
  'MGLU3',
  'PETR3',
]

const schema = z.object({
  results: z.array(
    z.object({
      symbol: z.string(),
      shortName: z.string().optional(),
      longName: z.string().optional(),
      regularMarketPrice: z.number(),
      regularMarketChangePercent: z.number().nullable().optional(),
    }),
  ),
})

export function mapBrapi(raw: unknown): Quote[] {
  const parsed = schema.parse(raw)
  return parsed.results.map((item) => ({
    symbol: item.symbol,
    name: item.shortName ?? item.longName ?? item.symbol,
    price: item.regularMarketPrice,
    currency: 'BRL' as const,
    changePercent: item.regularMarketChangePercent ?? 0,
  }))
}

export async function fetchB3(signal?: AbortSignal): Promise<Quote[]> {
  const token = import.meta.env.VITE_BRAPI_TOKEN
  if (!token) throw new Error('brapi token absent')
  const url = `https://brapi.dev/api/quote/${TICKERS.join(',')}?token=${token}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`brapi ${res.status}`)
  return mapBrapi(await res.json())
}
