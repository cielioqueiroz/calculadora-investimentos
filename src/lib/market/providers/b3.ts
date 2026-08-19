import { z } from 'zod'
import type { Quote, Reading } from '../types'

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

const publishedSchema = z.object({
  updatedAt: z.number().optional(),
  quotes: z.array(
    z.object({
      symbol: z.string(),
      name: z.string(),
      price: z.number(),
      currency: z.literal('BRL'),
      changePercent: z.number(),
    }),
  ),
})

/**
 * B3 quotes come only from the snapshot a scheduled workflow commits. The brapi
 * token stays in that runner, so it never reaches the browser; when the snapshot
 * is missing the caller degrades to its cached or seeded data.
 *
 * The file carries the moment it was produced, which is what the UI must show:
 * a snapshot from this morning is not a live quote.
 */
export async function fetchB3(signal?: AbortSignal): Promise<Reading> {
  const url = `${import.meta.env.BASE_URL}market/b3.json`
  const res = await fetch(url, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`b3.json ${res.status}`)
  const { quotes, updatedAt } = publishedSchema.parse(await res.json())
  if (!quotes.length) throw new Error('b3.json vazio')
  return { data: quotes, updatedAt }
}
