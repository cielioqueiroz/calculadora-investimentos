# Mercado em tempo real + expansão do simulador — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar dados de mercado em tempo real (ticker B3 no header, página `/mercado` com cripto/economias mundiais/ações) e expandir o simulador (novos ativos, retorno real, planejador de meta, IR/IOF), preservando o tema "cofre" e a hospedagem estática.

**Architecture:** Camada de dados em `src/lib/market/` com providers normalizados (CoinGecko/AwesomeAPI/brapi) validados por Zod, um hook de polling (`useMarketData`) com fallback em camadas (memória → localStorage → snapshot embutido), e componentes de UI no tema cofre. Cálculos financeiros novos são funções puras testadas com Vitest, reaproveitando `simulate`.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind, shadcn/ui (Radix), Recharts, Zustand, Zod, react-router-dom, Vitest.

## Global Constraints

- Identificadores (variáveis, funções, arquivos) em **inglês**; comentários mínimos (só lógica financeira complexa).
- **ZERO menções a IA** em código, comentários ou commits.
- Commits em **português**, sem trailer de co-autoria (segue o histórico do repo).
- Tema cofre fixo via CSS vars HSL: bg `228 11% 5%`, card `228 11% 9%`, primary/accent dourado `41 54% 54%`. Tokens Tailwind: `bg-gold-metal`, `shadow-gold`, `bg-hero-glow`, `font-display` (Fraunces), `font-sans` (Geist). Cores semânticas `success` (verde) e `destructive` (vermelho/queda).
- Rotas em português; alias `@/*` → `src/`.
- Sem novas dependências de runtime (usar Zod, já presente; sem react-query).
- Nenhum segredo no bundle. `VITE_BRAPI_TOKEN` é opcional; ausência → snapshot rotulado.
- Deploy segue no GitHub Pages (`base: '/calculadora-investimentos/'`).
- i18n: 5 locales (`pt`, `en`, `es`, `zh`, `ru`). Toda string visível precisa de chave nos 5.
- Testes: Vitest (`import { describe, it, expect } from 'vitest'`), ambiente jsdom. Apenas funções puras e mapeadores ganham testes (a suíte atual não testa componentes React; não adicionar testing-library).
- Verificação a cada commit relevante: `npm test`, `npm run lint`, `npm run build`.

---

## FASE 1 — Camada de dados + ticker B3

### Task 1: Tipos de mercado e helpers de formatação

**Files:**
- Create: `src/lib/market/types.ts`
- Create: `src/lib/market/format.ts`
- Test: `src/lib/market/format.test.ts`

**Interfaces:**
- Produces: `Quote`, `MarketStatus`, `MarketResult<T>`, `MarketSource` (types). `formatPrice(value, currency, locale)`, `formatSignedPercent(value)`, `formatCompact(value, locale)`, `timeAgo(epochMs, now?)` → `{ unit: 'now'|'s'|'m'|'h', value: number }`.

- [ ] **Step 1: Write the types file**

```ts
// src/lib/market/types.ts
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

export interface MarketResult<T> {
  data: T
  status: MarketStatus
  updatedAt: number
}
```

- [ ] **Step 2: Write the failing test for format helpers**

```ts
// src/lib/market/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, formatSignedPercent, formatCompact, timeAgo } from './format'

describe('formatPrice', () => {
  it('formats BRL with symbol', () => {
    expect(formatPrice(1234.5, 'BRL', 'pt')).toContain('1.234,50')
  })
  it('formats USD with symbol', () => {
    expect(formatPrice(99.9, 'USD', 'en')).toContain('99.90')
  })
  it('falls back to 0 for non-finite', () => {
    expect(formatPrice(Number.NaN, 'BRL', 'pt')).toContain('0,00')
  })
})

describe('formatSignedPercent', () => {
  it('prefixes a plus sign for gains', () => {
    expect(formatSignedPercent(1.234)).toBe('+1,23%')
  })
  it('keeps the minus sign for losses', () => {
    expect(formatSignedPercent(-0.5)).toBe('-0,50%')
  })
})

describe('formatCompact', () => {
  it('shortens large numbers', () => {
    expect(formatCompact(1_500_000_000, 'en')).toMatch(/1\.5\s?B/i)
  })
})

describe('timeAgo', () => {
  it('returns "now" under 5 seconds', () => {
    const now = 10_000
    expect(timeAgo(now - 2_000, now)).toEqual({ unit: 'now', value: 0 })
  })
  it('returns seconds under a minute', () => {
    const now = 100_000
    expect(timeAgo(now - 30_000, now)).toEqual({ unit: 's', value: 30 })
  })
  it('returns minutes under an hour', () => {
    const now = 1_000_000
    expect(timeAgo(now - 120_000, now)).toEqual({ unit: 'm', value: 2 })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/market/format.test.ts`
Expected: FAIL — `Cannot find module './format'`.

- [ ] **Step 4: Implement format helpers**

```ts
// src/lib/market/format.ts
import type { Locale } from '@/i18n/translations'

const LOCALE_TAG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN',
  ru: 'ru-RU',
}

function tag(locale: string): string {
  return LOCALE_TAG[locale as Locale] ?? 'pt-BR'
}

export function formatPrice(
  value: number,
  currency: 'BRL' | 'USD',
  locale: string,
): string {
  const safe = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat(tag(locale), {
    style: 'currency',
    currency,
  }).format(safe)
}

export function formatSignedPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  const body = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe)
  const sign = safe > 0 ? '+' : ''
  return `${sign}${body}%`
}

export function formatCompact(value: number, locale: string): string {
  const safe = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat(tag(locale), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safe)
}

export function timeAgo(
  epochMs: number,
  now: number = Date.now(),
): { unit: 'now' | 's' | 'm' | 'h'; value: number } {
  const seconds = Math.max(0, Math.floor((now - epochMs) / 1000))
  if (seconds < 5) return { unit: 'now', value: 0 }
  if (seconds < 60) return { unit: 's', value: seconds }
  if (seconds < 3600) return { unit: 'm', value: Math.floor(seconds / 60) }
  return { unit: 'h', value: Math.floor(seconds / 3600) }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/market/format.test.ts`
Expected: PASS (all suites green).

- [ ] **Step 6: Commit**

```bash
git add src/lib/market/types.ts src/lib/market/format.ts src/lib/market/format.test.ts
git commit -m "Adiciona tipos de mercado e helpers de formatacao"
```

---

### Task 2: Snapshots embutidos + cache em localStorage

**Files:**
- Create: `src/lib/market/snapshots.ts`
- Test: `src/lib/market/snapshots.test.ts`

**Interfaces:**
- Consumes: `Quote`, `MarketResult`, `MarketSource` (Task 1).
- Produces: `SNAPSHOTS: Record<MarketSource, Quote[]>`, `readCache(source): MarketResult<Quote[]> | null`, `writeCache(source, data: Quote[]): void`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/market/snapshots.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { SNAPSHOTS, readCache, writeCache } from './snapshots'

beforeEach(() => localStorage.clear())

describe('SNAPSHOTS', () => {
  it('has non-empty fallback for every source', () => {
    expect(SNAPSHOTS.crypto.length).toBeGreaterThan(0)
    expect(SNAPSHOTS.forex.length).toBeGreaterThan(0)
    expect(SNAPSHOTS.b3.length).toBeGreaterThan(0)
  })
})

describe('cache round-trip', () => {
  it('returns null when nothing cached', () => {
    expect(readCache('crypto')).toBeNull()
  })
  it('persists and reads back data with stale status', () => {
    writeCache('crypto', SNAPSHOTS.crypto)
    const cached = readCache('crypto')
    expect(cached?.status).toBe('stale')
    expect(cached?.data).toHaveLength(SNAPSHOTS.crypto.length)
    expect(typeof cached?.updatedAt).toBe('number')
  })
  it('survives corrupted storage', () => {
    localStorage.setItem('investment-calculator:market:crypto', '{not json')
    expect(readCache('crypto')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/market/snapshots.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement snapshots + cache**

```ts
// src/lib/market/snapshots.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/market/snapshots.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/market/snapshots.ts src/lib/market/snapshots.test.ts
git commit -m "Adiciona snapshots de fallback e cache de mercado"
```

---

### Task 3: Provider de criptomoedas (CoinGecko)

**Files:**
- Create: `src/lib/market/providers/crypto.ts`
- Test: `src/lib/market/providers/crypto.test.ts`

**Interfaces:**
- Consumes: `Quote` (Task 1).
- Produces: `mapCoinGecko(raw: unknown): Quote[]` (puro, valida com Zod), `fetchCrypto(signal?: AbortSignal): Promise<Quote[]>`.

- [ ] **Step 1: Write the failing test (mapper + schema)**

```ts
// src/lib/market/providers/crypto.test.ts
import { describe, it, expect } from 'vitest'
import { mapCoinGecko } from './crypto'

const sample = [
  {
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 380000,
    price_change_percentage_24h: 1.23,
    market_cap: 7.5e12,
    sparkline_in_7d: { price: [360000, 380000] },
  },
]

describe('mapCoinGecko', () => {
  it('normalizes a valid payload to Quote[]', () => {
    const quotes = mapCoinGecko(sample)
    expect(quotes).toHaveLength(1)
    expect(quotes[0]).toMatchObject({
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 380000,
      currency: 'BRL',
      changePercent: 1.23,
      marketCap: 7.5e12,
    })
    expect(quotes[0].sparkline).toEqual([360000, 380000])
  })
  it('throws on a malformed payload', () => {
    expect(() => mapCoinGecko({ not: 'an array' })).toThrow()
  })
  it('defaults missing change to zero', () => {
    const quotes = mapCoinGecko([{ ...sample[0], price_change_percentage_24h: null }])
    expect(quotes[0].changePercent).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/market/providers/crypto.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the crypto provider**

```ts
// src/lib/market/providers/crypto.ts
import { z } from 'zod'
import type { Quote } from '../types'

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

export async function fetchCrypto(signal?: AbortSignal): Promise<Quote[]> {
  const url =
    'https://api.coingecko.com/api/v3/coins/markets' +
    `?vs_currency=brl&ids=${COIN_IDS.join(',')}` +
    '&order=market_cap_desc&sparkline=true&price_change_percentage=24h'
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`)
  return mapCoinGecko(await res.json())
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/market/providers/crypto.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/market/providers/crypto.ts src/lib/market/providers/crypto.test.ts
git commit -m "Adiciona provider de criptomoedas via CoinGecko"
```

---

### Task 4: Provider de câmbio (AwesomeAPI)

**Files:**
- Create: `src/lib/market/providers/forex.ts`
- Test: `src/lib/market/providers/forex.test.ts`

**Interfaces:**
- Consumes: `Quote` (Task 1).
- Produces: `mapAwesomeApi(raw: unknown): Quote[]`, `fetchForex(signal?: AbortSignal): Promise<Quote[]>`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/market/providers/forex.test.ts
import { describe, it, expect } from 'vitest'
import { mapAwesomeApi } from './forex'

const sample = {
  USDBRL: { code: 'USD', name: 'Dólar Americano/Real Brasileiro', bid: '5.4210', pctChange: '0.30' },
  EURBRL: { code: 'EUR', name: 'Euro/Real Brasileiro', bid: '5.8800', pctChange: '-0.20' },
}

describe('mapAwesomeApi', () => {
  it('normalizes string fields to numbers', () => {
    const quotes = mapAwesomeApi(sample)
    expect(quotes).toHaveLength(2)
    expect(quotes[0]).toMatchObject({ symbol: 'USD', price: 5.421, currency: 'BRL', changePercent: 0.3 })
    expect(quotes[1].changePercent).toBe(-0.2)
  })
  it('throws on a malformed payload', () => {
    expect(() => mapAwesomeApi({ USDBRL: { bid: 'x' } })).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/market/providers/forex.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the forex provider**

```ts
// src/lib/market/providers/forex.ts
import { z } from 'zod'
import type { Quote } from '../types'

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

export async function fetchForex(signal?: AbortSignal): Promise<Quote[]> {
  const url = `https://economia.awesomeapi.com.br/json/last/${PAIRS.join(',')}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`AwesomeAPI ${res.status}`)
  return mapAwesomeApi(await res.json())
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/market/providers/forex.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/market/providers/forex.ts src/lib/market/providers/forex.test.ts
git commit -m "Adiciona provider de cambio via AwesomeAPI"
```

---

### Task 5: Provider de ações B3 (brapi.dev)

**Files:**
- Create: `src/lib/market/providers/b3.ts`
- Test: `src/lib/market/providers/b3.test.ts`

**Interfaces:**
- Consumes: `Quote` (Task 1).
- Produces: `mapBrapi(raw: unknown): Quote[]`, `fetchB3(signal?: AbortSignal): Promise<Quote[]>`. `fetchB3` lê `import.meta.env.VITE_BRAPI_TOKEN`; sem token → lança erro (hook cai no fallback).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/market/providers/b3.test.ts
import { describe, it, expect } from 'vitest'
import { mapBrapi } from './b3'

const sample = {
  results: [
    { symbol: 'PETR4', shortName: 'PETROBRAS PN', regularMarketPrice: 38.2, regularMarketChangePercent: 1.1 },
    { symbol: '^BVSP', shortName: 'IBOVESPA', regularMarketPrice: 128500, regularMarketChangePercent: 0.7 },
  ],
}

describe('mapBrapi', () => {
  it('normalizes brapi results to Quote[]', () => {
    const quotes = mapBrapi(sample)
    expect(quotes).toHaveLength(2)
    expect(quotes[0]).toMatchObject({ symbol: 'PETR4', name: 'PETROBRAS PN', price: 38.2, currency: 'BRL', changePercent: 1.1 })
  })
  it('throws on a malformed payload', () => {
    expect(() => mapBrapi({ results: 'nope' })).toThrow()
  })
  it('defaults missing change to zero', () => {
    const quotes = mapBrapi({ results: [{ symbol: 'X', regularMarketPrice: 1 }] })
    expect(quotes[0].changePercent).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/market/providers/b3.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the B3 provider**

```ts
// src/lib/market/providers/b3.ts
import { z } from 'zod'
import type { Quote } from '../types'

const TICKERS = ['^BVSP', 'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'B3SA3', 'WEGE3']

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/market/providers/b3.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the env typing for `VITE_BRAPI_TOKEN`**

Create `src/vite-env.d.ts` if absent, else append the interface:

```ts
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAPI_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

- [ ] **Step 6: Verify build still typechecks**

Run: `npm run build`
Expected: build completes (tsc + vite) without type errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/market/providers/b3.ts src/lib/market/providers/b3.test.ts src/vite-env.d.ts
git commit -m "Adiciona provider de acoes B3 via brapi com token opcional"
```

---

### Task 6: Hook de polling `useMarketData`

**Files:**
- Create: `src/lib/market/useMarketData.ts`

**Interfaces:**
- Consumes: `fetchCrypto`, `fetchForex`, `fetchB3`; `readCache`, `writeCache`, `SNAPSHOTS`; `MarketResult`, `MarketSource`, `Quote`.
- Produces: `useMarketData(source: MarketSource): MarketResult<Quote[]> & { loading: boolean }`.

- [ ] **Step 1: Implement the hook**

```ts
// src/lib/market/useMarketData.ts
import { useEffect, useRef, useState } from 'react'
import type { MarketResult, MarketSource, Quote } from './types'
import { readCache, writeCache, SNAPSHOTS } from './snapshots'
import { fetchCrypto } from './providers/crypto'
import { fetchForex } from './providers/forex'
import { fetchB3 } from './providers/b3'

const FETCHERS: Record<MarketSource, (signal?: AbortSignal) => Promise<Quote[]>> = {
  crypto: fetchCrypto,
  forex: fetchForex,
  b3: fetchB3,
}

const INTERVALS: Record<MarketSource, number> = {
  crypto: 30_000,
  forex: 30_000,
  b3: 60_000,
}

function initial(source: MarketSource): MarketResult<Quote[]> {
  const cached = readCache(source)
  if (cached) return cached
  return { data: SNAPSHOTS[source], status: 'snapshot', updatedAt: 0 }
}

export function useMarketData(
  source: MarketSource,
): MarketResult<Quote[]> & { loading: boolean } {
  const [result, setResult] = useState<MarketResult<Quote[]>>(() => initial(source))
  const [loading, setLoading] = useState(true)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      try {
        const data = await FETCHERS[source](controller.signal)
        if (!active) return
        writeCache(source, data)
        setResult({ data, status: 'live', updatedAt: Date.now() })
      } catch (error) {
        if (!active || controller.signal.aborted) return
        const cached = readCache(source)
        if (cached) setResult(cached)
        // else keep current state (snapshot or last good)
      } finally {
        if (active) setLoading(false)
      }
    }

    function onVisible() {
      if (document.visibilityState === 'visible') load()
    }

    load()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, INTERVALS[source])
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      active = false
      controllerRef.current?.abort()
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [source])

  return { ...result, loading }
}
```

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: no errors. (No unit test for the hook — the suite does not cover React hooks; correctness is verified via the components in later tasks and manual run.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/market/useMarketData.ts
git commit -m "Adiciona hook de polling de mercado com fallback em camadas"
```

---

### Task 7: Ticker tape da B3 no header

**Files:**
- Create: `src/components/market/MarketTicker.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `tailwind.config.js` (keyframe `marquee`)
- Modify: `src/index.css` (respeito a `prefers-reduced-motion`)

**Interfaces:**
- Consumes: `useMarketData`, `Quote`, `formatSignedPercent`, `useTranslation` (locale), `formatPrice`.
- Produces: `MarketTicker` component (sem props).

- [ ] **Step 1: Add the `marquee` keyframe to Tailwind**

In `tailwind.config.js`, inside `theme.extend.keyframes` add:

```js
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
```

and inside `theme.extend.animation` add:

```js
        marquee: 'marquee 40s linear infinite',
```

- [ ] **Step 2: Disable marquee under reduced motion**

Append to `src/index.css` (inside the second `@layer base` block, after the scrollbar rules):

```css
  @media (prefers-reduced-motion: reduce) {
    .animate-marquee {
      animation: none;
    }
  }
```

- [ ] **Step 3: Implement `MarketTicker`**

```tsx
// src/components/market/MarketTicker.tsx
import { useMarketData } from '@/lib/market/useMarketData'
import { formatPrice, formatSignedPercent } from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/market/types'

function TickerItem({ quote, locale }: { quote: Quote; locale: string }) {
  const up = quote.changePercent >= 0
  return (
    <span className="inline-flex items-center gap-2 px-4 text-xs tabular-nums">
      <span className="font-medium text-foreground">{quote.symbol}</span>
      <span className="text-muted-foreground">
        {formatPrice(quote.price, quote.currency, locale)}
      </span>
      <span className={cn('font-medium', up ? 'text-success' : 'text-destructive')}>
        {formatSignedPercent(quote.changePercent)}
      </span>
    </span>
  )
}

export function MarketTicker() {
  const { locale } = useTranslation()
  const { data, status } = useMarketData('b3')
  const items = data.length ? [...data, ...data] : []

  return (
    <div
      className="group relative flex overflow-hidden border-b border-border/15 bg-background/60"
      aria-hidden="true"
    >
      {status === 'snapshot' && (
        <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
          demo
        </span>
      )}
      <div className="flex min-w-full shrink-0 animate-marquee items-center py-1.5 group-hover:[animation-play-state:paused]">
        {items.map((quote, i) => (
          <TickerItem key={`${quote.symbol}-${i}`} quote={quote} locale={locale} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Mount the ticker at the top of the header**

In `src/components/layout/Header.tsx`, import and render `MarketTicker` above the existing inner `<div>`. Change the `<header>` body to:

```tsx
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MarketTicker } from '@/components/market/MarketTicker'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-border/15 bg-background/70 backdrop-blur-xl">
      <MarketTicker />
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-metal text-[hsl(228_11%_5%)] shadow-gold">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight text-foreground">
              InvestCalc
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t('header.tagline')}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 5: Verify lint + build + manual smoke**

Run: `npm run lint && npm run build`
Expected: no errors.
Run: `npm run dev` and open the app — the ticker scrolls under the header with symbols and colored changes (snapshot "demo" badge if no `VITE_BRAPI_TOKEN`).

- [ ] **Step 6: Commit**

```bash
git add src/components/market/MarketTicker.tsx src/components/layout/Header.tsx tailwind.config.js src/index.css
git commit -m "Adiciona ticker de cotacoes da B3 no header"
```

---

## FASE 2 — Página `/mercado`

### Task 8: Primitivos visuais de mercado (Sparkline, FreshnessBadge, QuoteCard)

**Files:**
- Create: `src/components/market/Sparkline.tsx`
- Create: `src/components/market/FreshnessBadge.tsx`
- Create: `src/components/market/QuoteCard.tsx`

**Interfaces:**
- Consumes: Recharts, `Quote`, `MarketStatus`, `formatPrice`, `formatSignedPercent`, `formatCompact`, `timeAgo`, `useTranslation`.
- Produces: `Sparkline({ data, up })`, `FreshnessBadge({ status, updatedAt })`, `QuoteCard({ quote, onSimulate? })`.

- [ ] **Step 1: Implement `Sparkline`**

```tsx
// src/components/market/Sparkline.tsx
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useId } from 'react'

interface SparklineProps {
  data: number[]
  up: boolean
}

export function Sparkline({ data, up }: SparklineProps) {
  const id = useId().replace(/[:]/g, '')
  const color = up ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
  const points = data.map((value, index) => ({ index, value }))

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={points} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Implement `FreshnessBadge`**

```tsx
// src/components/market/FreshnessBadge.tsx
import { useTranslation } from '@/i18n/useTranslation'
import { timeAgo } from '@/lib/market/format'
import { cn } from '@/lib/utils'
import type { MarketStatus } from '@/lib/market/types'

interface FreshnessBadgeProps {
  status: MarketStatus
  updatedAt: number
}

export function FreshnessBadge({ status, updatedAt }: FreshnessBadgeProps) {
  const { t } = useTranslation()
  const ago = timeAgo(updatedAt)

  const label =
    status === 'live'
      ? ago.unit === 'now'
        ? t('market.fresh.now')
        : t('market.fresh.ago', { value: `${ago.value}${t(`market.unit.${ago.unit}` as never)}` })
      : status === 'stale'
        ? t('market.fresh.delayed')
        : t('market.fresh.demo')

  const dot =
    status === 'live'
      ? 'bg-success'
      : status === 'stale'
        ? 'bg-primary'
        : 'bg-muted-foreground'

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className={cn('h-1.5 w-1.5 rounded-full', dot, status === 'live' && 'animate-pulse')} />
      {label}
    </span>
  )
}
```

- [ ] **Step 3: Implement `QuoteCard`**

```tsx
// src/components/market/QuoteCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Sparkline } from './Sparkline'
import { formatPrice, formatSignedPercent, formatCompact } from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/market/types'

interface QuoteCardProps {
  quote: Quote
  onSimulate?: (quote: Quote) => void
}

export function QuoteCard({ quote, onSimulate }: QuoteCardProps) {
  const { t, locale } = useTranslation()
  const up = quote.changePercent >= 0

  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{quote.symbol}</p>
            <p className="truncate text-xs text-muted-foreground">{quote.name}</p>
          </div>
          <span className={cn('shrink-0 text-sm font-medium tabular-nums', up ? 'text-success' : 'text-destructive')}>
            {formatSignedPercent(quote.changePercent)}
          </span>
        </div>

        <p className="font-display text-xl font-semibold tabular-nums text-foreground">
          {formatPrice(quote.price, quote.currency, locale)}
        </p>

        {quote.sparkline && quote.sparkline.length > 1 && (
          <Sparkline data={quote.sparkline} up={up} />
        )}

        <div className="flex items-center justify-between pt-1">
          {quote.marketCap ? (
            <span className="text-[11px] text-muted-foreground">
              {t('market.marketCap')}: {formatCompact(quote.marketCap, locale)}
            </span>
          ) : (
            <span />
          )}
          {onSimulate && (
            <button
              type="button"
              onClick={() => onSimulate(quote)}
              className="rounded-md border border-border/15 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t('market.simulate')}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: no errors. (i18n keys referenced here — `market.*` — are added in Task 19; until then `t()` returns the key string, which is harmless for build.)

- [ ] **Step 5: Commit**

```bash
git add src/components/market/Sparkline.tsx src/components/market/FreshnessBadge.tsx src/components/market/QuoteCard.tsx
git commit -m "Adiciona primitivos visuais de mercado"
```

---

### Task 9: Página `/mercado` com as três seções + rota + navegação

**Files:**
- Create: `src/components/market/MarketSection.tsx`
- Create: `src/pages/Market.tsx`
- Modify: `src/App.tsx` (rota `/mercado`)
- Modify: `src/components/layout/Sidebar.tsx` (item Mercado)
- Modify: `src/components/layout/MobileNav.tsx` (item Mercado)

**Interfaces:**
- Consumes: `useMarketData`, `QuoteCard`, `FreshnessBadge`, `PageHeader`, `useSimulationStore`, `useNavigate`.
- Produces: `MarketSection({ source, title, onSimulate? })`, `Market` page.

- [ ] **Step 1: Implement `MarketSection` (handles loading skeleton + freshness)**

```tsx
// src/components/market/MarketSection.tsx
import { useMarketData } from '@/lib/market/useMarketData'
import { QuoteCard } from './QuoteCard'
import { FreshnessBadge } from './FreshnessBadge'
import type { MarketSource, Quote } from '@/lib/market/types'

interface MarketSectionProps {
  source: MarketSource
  title: string
  onSimulate?: (quote: Quote) => void
}

export function MarketSection({ source, title, onSimulate }: MarketSectionProps) {
  const { data, status, updatedAt, loading } = useMarketData(source)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        <FreshnessBadge status={status} updatedAt={updatedAt} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && status === 'snapshot'
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg border border-border/15 bg-card/40" />
            ))
          : data.map((quote) => (
              <QuoteCard key={quote.symbol} quote={quote} onSimulate={onSimulate} />
            ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Implement the `Market` page**

```tsx
// src/pages/Market.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MarketSection } from '@/components/market/MarketSection'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'
import type { Quote } from '@/lib/market/types'

export function Market() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setParams = useSimulationStore((s) => s.setParams)
  const setCustomRate = useSimulationStore((s) => s.setCustomRate)

  function simulateCrypto(quote: Quote) {
    setParams({ investmentTypeId: 'cripto' })
    setCustomRate(20)
    navigate('/simulador')
    void quote
  }

  return (
    <div className="space-y-10">
      <PageHeader title={t('market.title')} subtitle={t('market.subtitle')} />
      <MarketSection source="forex" title={t('market.economies')} />
      <MarketSection source="crypto" title={t('market.crypto')} onSimulate={simulateCrypto} />
      <MarketSection source="b3" title={t('market.b3')} />
    </div>
  )
}
```

Note: `setCustomRate` is added to the store in Task 16. If executing strictly in order, implement Task 16 before wiring this call, or temporarily omit the `setCustomRate(20)` line and add it after Task 16. The `void quote` avoids an unused-parameter lint error until per-asset prefill is added.

- [ ] **Step 3: Register the route**

In `src/App.tsx`, import `Market` and add the route after `/simulador`:

```tsx
import { Market } from '@/pages/Market'
// ...
          <Route path="/mercado" element={<Market />} />
```

- [ ] **Step 4: Add the nav item to Sidebar and MobileNav**

In both `src/components/layout/Sidebar.tsx` and `src/components/layout/MobileNav.tsx`, import `LineChart` from `lucide-react` and add to `navItems` after the simulator entry:

```tsx
    { to: '/mercado', label: t('nav.market'), icon: LineChart, end: false },
```

(Adjust the existing import line: `import { Calculator, GitCompareArrows, History, LayoutDashboard, LineChart } from 'lucide-react'`.)

- [ ] **Step 5: Verify lint + build + manual**

Run: `npm run lint && npm run build`
Expected: no errors.
Run: `npm run dev` — navigate to `/mercado`; three sections render (snapshot data if offline/no token), nav highlights Mercado.

- [ ] **Step 6: Commit**

```bash
git add src/components/market/MarketSection.tsx src/pages/Market.tsx src/App.tsx src/components/layout/Sidebar.tsx src/components/layout/MobileNav.tsx
git commit -m "Adiciona pagina de mercado com cripto, economias e acoes"
```

---

### Task 10: Card "Mercado agora" na Home

**Files:**
- Create: `src/components/market/MarketSummary.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `useMarketData`, `Quote`, `formatPrice`, `formatSignedPercent`, `Link`.
- Produces: `MarketSummary` component (sem props).

- [ ] **Step 1: Implement `MarketSummary` (Ibovespa + USD + BTC)**

```tsx
// src/components/market/MarketSummary.tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useMarketData } from '@/lib/market/useMarketData'
import { formatPrice, formatSignedPercent } from '@/lib/market/format'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/market/types'

function pick(quotes: Quote[], symbol: string): Quote | undefined {
  return quotes.find((q) => q.symbol === symbol)
}

export function MarketSummary() {
  const { t, locale } = useTranslation()
  const b3 = useMarketData('b3')
  const forex = useMarketData('forex')
  const crypto = useMarketData('crypto')

  const highlights = [
    pick(b3.data, '^BVSP'),
    pick(forex.data, 'USD'),
    pick(crypto.data, 'BTC'),
  ].filter((q): q is Quote => Boolean(q))

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t('home.market.title')}</h3>
          <Link to="/mercado" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            {t('home.market.cta')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {highlights.map((q) => {
            const up = q.changePercent >= 0
            return (
              <div key={q.symbol} className="rounded-md border border-border/15 bg-background/40 p-3">
                <p className="truncate text-xs text-muted-foreground">{q.name}</p>
                <p className="truncate font-display text-base font-semibold tabular-nums text-foreground">
                  {formatPrice(q.price, q.currency, locale)}
                </p>
                <p className={cn('text-xs font-medium tabular-nums', up ? 'text-success' : 'text-destructive')}>
                  {formatSignedPercent(q.changePercent)}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Render it on the Home page**

In `src/pages/Home.tsx`, import `MarketSummary` and place it as its own section between the hero `</section>` and the features `<section>`:

```tsx
import { MarketSummary } from '@/components/market/MarketSummary'
// ...inside the returned fragment, after the hero section:
      <MarketSummary />
```

- [ ] **Step 3: Verify lint + build + manual**

Run: `npm run lint && npm run build`
Expected: no errors.
Run: `npm run dev` — Home shows the "Mercado agora" card with three quotes linking to `/mercado`.

- [ ] **Step 4: Commit**

```bash
git add src/components/market/MarketSummary.tsx src/pages/Home.tsx
git commit -m "Adiciona resumo de mercado na home"
```

---

## FASE 3 — Expansão do simulador e cálculos

### Task 11: IOF regressivo

**Files:**
- Modify: `src/lib/calculations.ts`
- Modify: `src/lib/calculations.test.ts`

**Interfaces:**
- Produces: `iofRate(days: number): number` — fração (0..1) de IOF sobre o **rendimento** para resgates com menos de 30 dias (96% no dia 1 → 0% no dia 30+).

- [ ] **Step 1: Write the failing test**

```ts
// append to src/lib/calculations.test.ts
import { iofRate } from './calculations'

describe('iofRate', () => {
  it('charges 96% on day 1', () => {
    expect(iofRate(1)).toBeCloseTo(0.96, 5)
  })
  it('charges 3% on day 29', () => {
    expect(iofRate(29)).toBeCloseTo(0.03, 5)
  })
  it('charges nothing from day 30 onward', () => {
    expect(iofRate(30)).toBe(0)
    expect(iofRate(60)).toBe(0)
  })
})
```

(Adjust the existing import at the top of the test file to also import `iofRate`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/calculations.test.ts -t iofRate`
Expected: FAIL — `iofRate is not a function`.

- [ ] **Step 3: Implement `iofRate`**

```ts
// add to src/lib/calculations.ts
const IOF_TABLE = [
  0.96, 0.93, 0.9, 0.86, 0.83, 0.8, 0.76, 0.73, 0.7, 0.66, 0.63, 0.6, 0.56,
  0.53, 0.5, 0.46, 0.43, 0.4, 0.36, 0.33, 0.3, 0.26, 0.23, 0.2, 0.16, 0.13,
  0.1, 0.06, 0.03,
]

export function iofRate(days: number): number {
  if (days < 1) return IOF_TABLE[0]
  if (days >= 30) return 0
  return IOF_TABLE[days - 1]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/calculations.test.ts -t iofRate`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculations.ts src/lib/calculations.test.ts
git commit -m "Adiciona tabela regressiva de IOF"
```

---

### Task 12: Retorno real (desconto de inflação)

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/lib/calculations.ts`
- Modify: `src/lib/calculations.test.ts`

**Interfaces:**
- Produces: `applyInflation(nominal: number, annualInflation: number, months: number): number`. `SimulationResult` ganha `inflationRate: number` e `realNetBalance: number`. `simulate(input, taxExempt, inflationRate = 0)` passa a aceitar a inflação anual e preencher os dois campos.

- [ ] **Step 1: Write the failing test**

```ts
// append to src/lib/calculations.test.ts
import { applyInflation } from './calculations'

describe('applyInflation', () => {
  it('discounts nominal value by accumulated inflation', () => {
    // 12 months at 10% a.a. → divide by 1.10
    expect(applyInflation(1100, 10, 12)).toBeCloseTo(1000, 2)
  })
  it('returns the nominal value when inflation is zero', () => {
    expect(applyInflation(1000, 0, 24)).toBe(1000)
  })
})

describe('simulate real return', () => {
  it('fills realNetBalance below nominal when inflation is positive', () => {
    const result = simulate(
      { investmentTypeId: 'test', initialAmount: 1000, monthlyContribution: 0, months: 12, annualRate: 12.682503 },
      true,
      10,
    )
    expect(result.inflationRate).toBe(10)
    expect(result.realNetBalance).toBeLessThan(result.netBalance)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/calculations.test.ts -t "real return"`
Expected: FAIL — `applyInflation is not a function` / missing fields.

- [ ] **Step 3: Extend the type**

In `src/types/index.ts`, add two fields to `SimulationResult`:

```ts
  inflationRate: number
  realNetBalance: number
```

- [ ] **Step 4: Implement `applyInflation` and wire it into `simulate`**

```ts
// add to src/lib/calculations.ts
export function applyInflation(
  nominal: number,
  annualInflation: number,
  months: number,
): number {
  if (annualInflation === 0) return nominal
  const factor = Math.pow(1 + annualInflation / 100, months / 12)
  return nominal / factor
}
```

Change the `simulate` signature and return object:

```ts
export function simulate(
  input: SimulationInput,
  taxExempt: boolean,
  inflationRate: number = 0,
): SimulationResult {
  // ...existing body unchanged until the return...
  const realNetBalance = applyInflation(netBalance, inflationRate, months)

  return {
    investmentTypeId: input.investmentTypeId,
    totalInvested,
    grossBalance,
    grossInterest,
    taxRate,
    taxAmount,
    netBalance,
    netInterest,
    effectiveAnnualRate: annualRate,
    months,
    inflationRate,
    realNetBalance,
    breakdown,
  }
}
```

- [ ] **Step 5: Run all calculation tests**

Run: `npx vitest run src/lib/calculations.test.ts`
Expected: PASS (existing tests still green; `realNetBalance` defaults to `netBalance` when `inflationRate` omitted, since `applyInflation(x, 0, m) === x`).

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/calculations.ts src/lib/calculations.test.ts
git commit -m "Adiciona retorno real com desconto de inflacao"
```

---

### Task 13: Planejador de meta (aporte mensal necessário)

**Files:**
- Modify: `src/lib/calculations.ts`
- Modify: `src/lib/calculations.test.ts`

**Interfaces:**
- Produces: `solveMonthlyContribution(target: number, initial: number, months: number, annualRate: number): number` — resolve o aporte mensal (anuidade ordinária) para atingir `target`. Retorna 0 se o valor inicial já capitaliza acima da meta.

- [ ] **Step 1: Write the failing test**

```ts
// append to src/lib/calculations.test.ts
import { solveMonthlyContribution } from './calculations'

describe('solveMonthlyContribution', () => {
  it('returns 0 when the initial amount already reaches the target', () => {
    expect(solveMonthlyContribution(1000, 2000, 12, 10)).toBe(0)
  })
  it('solves a positive contribution and round-trips through simulate', () => {
    const target = 50_000
    const pmt = solveMonthlyContribution(target, 1000, 60, 8)
    expect(pmt).toBeGreaterThan(0)
    const result = simulate(
      { investmentTypeId: 'test', initialAmount: 1000, monthlyContribution: pmt, months: 60, annualRate: 8 },
      true,
    )
    expect(result.grossBalance).toBeCloseTo(target, 0)
  })
  it('handles a zero rate as plain division', () => {
    // need 1200 over 12 months from 0 initial at 0% → 100/month
    expect(solveMonthlyContribution(1200, 0, 12, 0)).toBeCloseTo(100, 5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/calculations.test.ts -t solveMonthlyContribution`
Expected: FAIL — function not defined.

- [ ] **Step 3: Implement `solveMonthlyContribution`**

```ts
// add to src/lib/calculations.ts
export function solveMonthlyContribution(
  target: number,
  initial: number,
  months: number,
  annualRate: number,
): number {
  if (months <= 0) return 0
  const i = monthlyRateFromAnnual(annualRate)
  const futureOfInitial = initial * Math.pow(1 + i, months)
  const remaining = target - futureOfInitial
  if (remaining <= 0) return 0
  if (i === 0) return remaining / months
  const annuityFactor = (Math.pow(1 + i, months) - 1) / i
  return remaining / annuityFactor
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/calculations.test.ts -t solveMonthlyContribution`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculations.ts src/lib/calculations.test.ts
git commit -m "Adiciona planejador de meta por aporte mensal"
```

---

### Task 14: Renda variável — taxação custom e `rateBasis: 'custom'`

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/lib/calculations.ts`
- Modify: `src/lib/calculations.test.ts`

**Interfaces:**
- Consumes: tipos existentes.
- Produces: `RateBasis` ganha `'custom'`; `InvestmentCategory` ganha `'variable-income'` e `'crypto'`; `InvestmentType` ganha `customRate?: number` e `flatTaxRate?: number`. `resolveAnnualRate(type, rates, customRate?)` retorna `customRate` para `'custom'`. `simulate` aceita `flatTaxRate?: number` que, quando definido, substitui a tabela regressiva por uma alíquota fixa.

- [ ] **Step 1: Write the failing test**

```ts
// append to src/lib/calculations.test.ts
describe('custom rate and flat tax', () => {
  it('resolveAnnualRate returns the provided custom rate', () => {
    const type = makeType({ rateBasis: 'custom' })
    expect(resolveAnnualRate(type, rates, 18.5)).toBe(18.5)
  })
  it('simulate applies a flat tax instead of the regressive table', () => {
    const result = simulate(
      { investmentTypeId: 'test', initialAmount: 1000, monthlyContribution: 0, months: 60, annualRate: 12.682503 },
      false,
      0,
      0.15,
    )
    expect(result.taxRate).toBe(0.15)
    expect(result.taxAmount).toBeCloseTo(result.grossInterest * 0.15, 5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/calculations.test.ts -t "custom rate"`
Expected: FAIL — signature mismatch / wrong tax.

- [ ] **Step 3: Extend the types**

In `src/types/index.ts`:

```ts
export type RateBasis = 'fixed' | 'cdi' | 'selic' | 'ipca' | 'custom'

export type InvestmentCategory =
  | 'fixed-income'
  | 'savings'
  | 'treasury'
  | 'variable-income'
  | 'crypto'
```

and add to `InvestmentType`:

```ts
  customRate?: number
  flatTaxRate?: number
```

- [ ] **Step 4: Extend `resolveAnnualRate` and `simulate`**

```ts
// resolveAnnualRate — add a case and an optional param
export function resolveAnnualRate(
  type: InvestmentType,
  rates: MarketRates,
  customRate?: number,
): number {
  switch (type.rateBasis) {
    case 'cdi':
      return rates.cdi * (type.defaultRate / 100)
    case 'selic':
      return rates.selic * (type.defaultRate / 100)
    case 'ipca':
      return rates.ipca + type.defaultRate
    case 'custom':
      return customRate ?? type.customRate ?? type.defaultRate
    case 'fixed':
    default:
      return type.defaultRate
  }
}
```

Update `simulate` to accept and apply `flatTaxRate`:

```ts
export function simulate(
  input: SimulationInput,
  taxExempt: boolean,
  inflationRate: number = 0,
  flatTaxRate?: number,
): SimulationResult {
  // ...unchanged until the tax block...
  const taxRate = taxExempt
    ? 0
    : flatTaxRate !== undefined
      ? flatTaxRate
      : incomeTaxRate(months)
  // ...rest unchanged (taxAmount/netBalance/realNetBalance/return)...
}
```

- [ ] **Step 5: Run all calculation tests**

Run: `npx vitest run src/lib/calculations.test.ts`
Expected: PASS (all suites).

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/calculations.ts src/lib/calculations.test.ts
git commit -m "Adiciona suporte a renda variavel com taxa custom e IR fixo"
```

---

### Task 15: Novos ativos no catálogo

**Files:**
- Modify: `src/constants/investments.ts`

**Interfaces:**
- Consumes: `InvestmentType` (Task 14 fields).
- Produces: cinco novas entradas em `INVESTMENT_TYPES` — `acoes`, `fii`, `etf`, `dolar`, `cripto`. Adiciona `DEFAULT_INFLATION = 4.5`.

- [ ] **Step 1: Add the constant and new asset entries**

Append `DEFAULT_INFLATION` and push these objects into `INVESTMENT_TYPES` (after the existing six):

```ts
export const DEFAULT_INFLATION = 4.5

// new entries inside INVESTMENT_TYPES:
  {
    id: 'acoes',
    name: 'Ações B3',
    shortName: 'Ações',
    category: 'variable-income',
    rateBasis: 'custom',
    defaultRate: 12,
    customRate: 12,
    flatTaxRate: 0.15,
    taxExempt: false,
    fgcProtected: false,
    risk: 'high',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#D98A4B',
  },
  {
    id: 'fii',
    name: 'Fundos Imobiliários',
    shortName: 'FIIs',
    category: 'variable-income',
    rateBasis: 'custom',
    defaultRate: 10,
    customRate: 10,
    taxExempt: true,
    fgcProtected: false,
    risk: 'high',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#C77B4A',
  },
  {
    id: 'etf',
    name: 'ETF',
    shortName: 'ETF',
    category: 'variable-income',
    rateBasis: 'custom',
    defaultRate: 11,
    customRate: 11,
    flatTaxRate: 0.15,
    taxExempt: false,
    fgcProtected: false,
    risk: 'high',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#B5728C',
  },
  {
    id: 'dolar',
    name: 'Dólar',
    shortName: 'Dólar',
    category: 'variable-income',
    rateBasis: 'custom',
    defaultRate: 6,
    customRate: 6,
    flatTaxRate: 0.15,
    taxExempt: false,
    fgcProtected: false,
    risk: 'medium',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#6E84B8',
  },
  {
    id: 'cripto',
    name: 'Criptomoedas',
    shortName: 'Cripto',
    category: 'crypto',
    rateBasis: 'custom',
    defaultRate: 20,
    customRate: 20,
    flatTaxRate: 0.15,
    taxExempt: false,
    fgcProtected: false,
    risk: 'high',
    liquidity: 'daily',
    minInvestment: 0,
    color: '#E0A23B',
  },
```

- [ ] **Step 2: Verify build + existing tests**

Run: `npm run build && npx vitest run`
Expected: no type errors; all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/constants/investments.ts
git commit -m "Adiciona acoes, FIIs, ETF, dolar e cripto ao catalogo"
```

---

### Task 16: Store — taxa custom, inflação e modo meta

**Files:**
- Modify: `src/store/useSimulationStore.ts`

**Interfaces:**
- Consumes: `DEFAULT_INFLATION`, `solveMonthlyContribution`, `applyInflation` indirectly via `simulate`.
- Produces: `SimulationParams` ganha `customRate: number`, `inflationRate: number`, `mode: 'project' | 'goal'`, `targetAmount: number`. Store ganha `setCustomRate(rate)`, `setMode(mode)`, `setTarget(value)`. `runSimulation`/`persistCurrent` passam `inflationRate` e `flatTaxRate` para `simulate`, e no modo `goal` derivam o aporte mensal antes de simular.

- [ ] **Step 1: Update `SimulationParams`, defaults and `buildInput`**

```ts
import { DEFAULT_MARKET_RATES, DEFAULT_INFLATION, getInvestmentType } from '@/constants/investments'
import { resolveAnnualRate, simulate, solveMonthlyContribution } from '@/lib/calculations'

export interface SimulationParams {
  investmentTypeId: string
  initialAmount: number
  monthlyContribution: number
  months: number
  customRate: number
  inflationRate: number
  mode: 'project' | 'goal'
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
```

`buildInput` resolves the annual rate (using `customRate`), derives the monthly contribution in goal mode, and returns the flat tax + inflation:

```ts
function buildInput(
  params: SimulationParams,
  rates: MarketRates,
): { input: SimulationInput; taxExempt: boolean; inflationRate: number; flatTaxRate?: number } | null {
  const type = getInvestmentType(params.investmentTypeId)
  if (!type) return null
  const annualRate = resolveAnnualRate(type, rates, params.customRate)
  const monthlyContribution =
    params.mode === 'goal'
      ? solveMonthlyContribution(params.targetAmount, params.initialAmount, params.months, annualRate)
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
```

- [ ] **Step 2: Add actions and pass new args to `simulate`**

Add to the `SimulationState` interface:

```ts
  setCustomRate: (rate: number) => void
  setMode: (mode: 'project' | 'goal') => void
  setTarget: (value: number) => void
```

Implement them and update `runSimulation`/`persistCurrent` to use the new `built` fields:

```ts
  setCustomRate: (customRate) => set((state) => ({ params: { ...state.params, customRate } })),
  setMode: (mode) => set((state) => ({ params: { ...state.params, mode } })),
  setTarget: (targetAmount) => set((state) => ({ params: { ...state.params, targetAmount } })),

  runSimulation: () => {
    const { params, marketRates } = get()
    const built = buildInput(params, marketRates)
    if (!built) return null
    const result = simulate(built.input, built.taxExempt, built.inflationRate, built.flatTaxRate)
    set({ result })
    return result
  },
```

Apply the same four-arg `simulate(...)` call inside `persistCurrent`.

- [ ] **Step 3: Verify build + tests**

Run: `npm run build && npx vitest run`
Expected: no errors; tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/store/useSimulationStore.ts
git commit -m "Estende store com taxa custom, inflacao e modo meta"
```

---

### Task 17: SimulatorForm — taxa custom, inflação e alternância projetar/meta

**Files:**
- Modify: `src/components/simulator/SimulatorForm.tsx`

**Interfaces:**
- Consumes: store fields/actions from Task 16; `resolveAnnualRate(type, rates, customRate)`.

- [ ] **Step 1: Read the new params/actions from the store**

At the top of `SimulatorForm`, add:

```tsx
  const setCustomRate = useSimulationStore((s) => s.setCustomRate)
  const setMode = useSimulationStore((s) => s.setMode)
  const setTarget = useSimulationStore((s) => s.setTarget)
```

and pass the custom rate into the annual rate calc:

```tsx
  const annualRate = useMemo(
    () => (selectedType ? resolveAnnualRate(selectedType, marketRates, params.customRate) : 0),
    [selectedType, marketRates, params.customRate],
  )
```

- [ ] **Step 2: Add a mode toggle above the type selector**

Inside `<CardContent>`, before the type `<div>`:

```tsx
        <div className="grid grid-cols-2 gap-2 rounded-md bg-secondary p-1">
          {(['project', 'goal'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMode(mode)}
              className={
                'rounded px-3 py-1.5 text-sm font-medium transition-colors ' +
                (params.mode === mode
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground')
              }
            >
              {mode === 'project' ? t('simulator.mode.project') : t('simulator.mode.goal')}
            </button>
          ))}
        </div>
```

- [ ] **Step 3: Show a custom-rate input for variable-income/crypto assets**

After the badges block (`selectedType && (...)`), add:

```tsx
        {selectedType?.rateBasis === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="custom-rate">{t('simulator.form.expectedRate')}</Label>
            <Input
              id="custom-rate"
              type="number"
              step={0.5}
              value={params.customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
            />
            <p className="text-xs text-destructive">{t('simulator.form.volatilityWarning')}</p>
          </div>
        )}
```

- [ ] **Step 4: Swap the monthly field for a target field in goal mode**

Wrap the existing "monthly" `<div>` so it renders only in `project` mode, and add a target field for `goal` mode right after it:

```tsx
        {params.mode === 'project' ? (
          /* existing monthly contribution <div> ... */
        ) : (
          <div className="space-y-2">
            <Label htmlFor="target">{t('simulator.form.target')}</Label>
            <Input
              id="target"
              type="number"
              min={0}
              step={1000}
              value={params.targetAmount}
              onChange={(e) => setTarget(Math.max(0, Number(e.target.value)))}
            />
          </div>
        )}
```

- [ ] **Step 5: Add an inflation input after the period field**

```tsx
        <div className="space-y-2">
          <Label htmlFor="inflation">{t('simulator.form.inflation')}</Label>
          <Input
            id="inflation"
            type="number"
            min={0}
            step={0.1}
            value={params.inflationRate}
            onChange={(e) => useSimulationStore.getState().setParams({ inflationRate: Math.max(0, Number(e.target.value)) })}
          />
        </div>
```

- [ ] **Step 6: Verify lint + build + manual**

Run: `npm run lint && npm run build`
Expected: no errors.
Run: `npm run dev` — toggle Projetar/Meta; selecting Cripto/Ações shows the expected-rate input with the volatility warning; goal mode shows the target field.

- [ ] **Step 7: Commit**

```bash
git add src/components/simulator/SimulatorForm.tsx
git commit -m "Adiciona taxa esperada, inflacao e modo meta no formulario"
```

---

### Task 18: ResultSummary — retorno real e breakdown IR/IOF

**Files:**
- Modify: `src/components/simulator/ResultSummary.tsx`

**Interfaces:**
- Consumes: `SimulationResult` (com `inflationRate`, `realNetBalance`).

- [ ] **Step 1: Add a real-return line under the highlight card**

In `ResultSummary`, after the highlight `<Card>` and before the grid, insert (only when inflation applies):

```tsx
      {result.inflationRate > 0 && (
        <p className="px-1 text-sm text-muted-foreground">
          {t('result.realBalance')}:{' '}
          <span className="font-medium text-foreground tabular-nums">
            {formatCurrency(result.realNetBalance)}
          </span>{' '}
          <span className="text-xs">
            ({t('result.realHint', { rate: formatPercent(result.inflationRate) })})
          </span>
        </p>
      )}
```

- [ ] **Step 2: Verify lint + build + manual**

Run: `npm run lint && npm run build`
Expected: no errors.
Run: `npm run dev` — run a simulation with inflation > 0; the real (inflation-adjusted) balance appears below the headline figure.

- [ ] **Step 3: Commit**

```bash
git add src/components/simulator/ResultSummary.tsx
git commit -m "Mostra retorno real no resumo do resultado"
```

---

## FASE 4 — i18n, acessibilidade, docs e fechamento

### Task 19: Chaves de tradução nos 5 idiomas

**Files:**
- Modify: `src/i18n/translations.ts`

**Interfaces:**
- Produces: novas chaves em cada um dos cinco objetos de locale (`pt`, `en`, `es`, `zh`, `ru`). Toda chave referenciada nas Tasks 7–18 precisa existir.

Chaves a adicionar (com o texto `pt` de referência; traduzir nas demais línguas mantendo as mesmas chaves):

```
'nav.market': 'Mercado'
'market.title': 'Mercado em tempo real'
'market.subtitle': 'Acompanhe cripto, economias mundiais e ações da B3.'
'market.economies': 'Principais economias'
'market.crypto': 'Criptomoedas'
'market.b3': 'Ações B3'
'market.marketCap': 'Cap. de mercado'
'market.simulate': 'Simular'
'market.fresh.now': 'ao vivo'
'market.fresh.ago': 'há {value}'
'market.fresh.delayed': 'atrasado'
'market.fresh.demo': 'demonstração'
'market.unit.s': 's'
'market.unit.m': 'min'
'market.unit.h': 'h'
'home.market.title': 'Mercado agora'
'home.market.cta': 'Ver mercado'
'simulator.mode.project': 'Projetar valor'
'simulator.mode.goal': 'Planejar meta'
'simulator.form.expectedRate': 'Retorno anual esperado (%)'
'simulator.form.volatilityWarning': 'Ativo de alta volatilidade — retorno não garantido.'
'simulator.form.target': 'Meta (R$)'
'simulator.form.inflation': 'Inflação anual estimada (% a.a.)'
'result.realBalance': 'Valor real (poder de compra)'
'result.realHint': 'descontada inflação de {rate} a.a.'
```

Also add localized investment descriptions for the five new assets used by Home's `t(\`investment.${id}.desc\`)`:

```
'investment.acoes.desc': 'Participação em empresas listadas na B3, com potencial de valorização e dividendos.'
'investment.fii.desc': 'Fundos que investem em imóveis e papéis do setor, com rendimentos mensais.'
'investment.etf.desc': 'Cesta de ativos que replica um índice, negociada como uma ação.'
'investment.dolar.desc': 'Exposição à moeda americana como proteção e diversificação.'
'investment.cripto.desc': 'Ativos digitais de alta volatilidade e alto risco.'
```

Also add the new category labels referenced by Home:

```
'category.variable-income': 'Renda Variável'
'category.crypto': 'Cripto'
```

- [ ] **Step 1: Add every key above to the `pt` object**

Insert the keys into the `pt` block of `src/i18n/translations.ts`.

- [ ] **Step 2: Add the same keys to `en` (English translations)**

Example values: `'nav.market': 'Market'`, `'market.title': 'Live market'`, `'market.fresh.demo': 'demo'`, `'simulator.mode.goal': 'Plan a goal'`, etc. Translate all keys.

- [ ] **Step 3: Add the same keys to `es`, `zh`, `ru`**

Translate every key for the three remaining locales, keeping identical key names.

- [ ] **Step 4: Typecheck the translation maps**

Run: `npm run build`
Expected: no type errors. The `TranslationKey` type is derived from the `pt` object; every locale must contain the same keys or TypeScript will flag the mismatch. Fix any missing key it reports.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/translations.ts
git commit -m "Adiciona traducoes de mercado e simulador nos cinco idiomas"
```

---

### Task 20: Acessibilidade, README e verificação final

**Files:**
- Modify: `README.md`
- Modify: `src/components/market/MarketTicker.tsx` (reduced-motion fallback already via CSS; ensure pause-on-focus)

**Interfaces:** none.

- [ ] **Step 1: Document `VITE_BRAPI_TOKEN` in the README**

Add a section explaining the optional env var:

```markdown
## Dados de mercado

O ticker da B3 e a página `/mercado` consomem APIs públicas (CoinGecko, AwesomeAPI
e brapi.dev). Cripto e câmbio funcionam sem chave. As cotações da B3 usam o
brapi.dev: defina um token opcional em um arquivo `.env` para habilitar dados ao
vivo (sem token, é exibido um snapshot rotulado como "demonstração"):

​```
VITE_BRAPI_TOKEN=seu_token_aqui
​```

As cotações em planos gratuitos podem ter atraso (~15 min) — a interface rotula o
frescor de cada bloco.
```

- [ ] **Step 2: Ensure `.env` is gitignored**

Confirm `.gitignore` contains a line covering `.env` / `.env.local`. If absent, add:

```
.env
.env.local
```

- [ ] **Step 3: Confirm reduced-motion + focus pause on the ticker**

Verify `src/components/market/MarketTicker.tsx` container keeps `group-hover:[animation-play-state:paused]` and that the `@media (prefers-reduced-motion: reduce)` rule from Task 7 disables `.animate-marquee`. No code change needed if both are present.

- [ ] **Step 4: Full verification**

Run: `npx vitest run`
Expected: all test files PASS.
Run: `npm run lint`
Expected: no errors/warnings.
Run: `npm run build`
Expected: build succeeds.
Run: `npm run dev` and manually verify: ticker scrolls and pauses on hover; `/mercado` shows three sections with freshness badges; simulator supports new assets, goal mode, inflation, and the result shows the real return; theme toggle and all five languages render the new strings.

- [ ] **Step 5: Commit**

```bash
git add README.md .gitignore
git commit -m "Documenta token de mercado e finaliza acessibilidade do ticker"
```

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura do spec:** camada de dados (Tasks 1–6), ticker B3 (Task 7),
  `/mercado` + Home (Tasks 8–10), novos ativos (Tasks 14–15), retorno real
  (Task 12), meta (Task 13), IR/IOF (Tasks 11, 14, 18), UI/UX + a11y (Tasks 7,
  8, 17, 20), i18n (Task 19), deploy/token (Tasks 5, 20). Sem lacunas.
- **Placeholders:** nenhum passo deixa código/decisão em aberto; trechos "existing
  ... unchanged" referem-se a código já presente e mostrado no spec/arquivos.
- **Consistência de tipos:** `Quote`, `MarketResult`, `MarketSource`,
  `MarketStatus` usados uniformemente; `simulate(input, taxExempt, inflationRate?,
  flatTaxRate?)` e `resolveAnnualRate(type, rates, customRate?)` mantêm a mesma
  assinatura em todas as tasks que os consomem; `setCustomRate`/`setMode`/
  `setTarget` definidos na Task 16 e consumidos nas Tasks 9 e 17.
- **Dependência de ordem:** a Task 9 referencia `setCustomRate` (Task 16) — nota
  explícita no passo orienta a ordem; demais tasks são independentes dentro da fase.
