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
