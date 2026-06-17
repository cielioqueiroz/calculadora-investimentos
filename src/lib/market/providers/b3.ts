import { z } from 'zod'
import type { Quote } from '../types'
import { getBrapiToken } from '../token'

const INDEX = '^BVSP'
const STOCKS = [
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

const publishedSchema = z.object({
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

async function fetchPublished(signal?: AbortSignal): Promise<Quote[]> {
  const url = `${import.meta.env.BASE_URL}market/b3.json`
  const res = await fetch(url, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`b3.json ${res.status}`)
  const { quotes } = publishedSchema.parse(await res.json())
  return quotes
}

async function fetchSymbol(
  symbol: string,
  token: string,
  signal?: AbortSignal,
): Promise<Quote | null> {
  try {
    const url = `https://brapi.dev/api/quote/${encodeURIComponent(symbol)}?token=${token}`
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`brapi ${res.status}`)
    return mapBrapi(await res.json())[0] ?? null
  } catch (error) {
    console.warn(`B3: ${symbol} indisponível.`, error)
    return null
  }
}

export async function fetchB3(signal?: AbortSignal): Promise<Quote[]> {
  try {
    const published = await fetchPublished(signal)
    if (published.length) return published
  } catch {
    // snapshot not published yet, fall through to the live token path
  }

  const token = getBrapiToken()
  if (!token) throw new Error('brapi token absent')

  // Free brapi plans allow a single ticker per request, so fetch one by one.
  const results = await Promise.all(
    [INDEX, ...STOCKS].map((symbol) => fetchSymbol(symbol, token, signal)),
  )
  const quotes = results.filter((quote): quote is Quote => quote !== null)
  if (!quotes.length) throw new Error('brapi sem cotações')
  return quotes
}
