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
