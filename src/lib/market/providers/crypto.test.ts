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
