import { z } from 'zod'
import type { Quote, Reading } from '../types'

const PAIRS = ['USD-BRL', 'EUR-BRL', 'GBP-BRL', 'JPY-BRL', 'CNY-BRL']

const NAMES: Record<string, string> = {
  USD: 'Dólar',
  EUR: 'Euro',
  GBP: 'Libra',
  JPY: 'Iene',
  CNY: 'Yuan',
}

const numeric = z.string().refine((v) => Number.isFinite(Number(v)), 'NaN')

const entry = z.object({ code: z.string(), bid: numeric, pctChange: numeric })
const schema = z.record(z.string(), entry)

export function mapAwesomeApi(raw: unknown): Quote[] {
  const parsed = schema.parse(raw)
  return Object.values(parsed).map((item) => ({
    symbol: item.code,
    name: NAMES[item.code] ?? item.code,
    price: Number(item.bid),
    currency: 'BRL' as const,
    changePercent: Number(item.pctChange),
  }))
}

export async function fetchForex(signal?: AbortSignal): Promise<Reading> {
  const url = `https://economia.awesomeapi.com.br/json/last/${PAIRS.join(',')}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`AwesomeAPI ${res.status}`)
  return { data: mapAwesomeApi(await res.json()) }
}
