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
  it('returns hours under a day', () => {
    const now = 100_000_000
    expect(timeAgo(now - 7_200_000, now)).toEqual({ unit: 'h', value: 2 })
  })
  it('reports days instead of a huge hour count', () => {
    const now = 1_000_000_000
    expect(timeAgo(now - 3 * 86_400_000, now)).toEqual({ unit: 'd', value: 3 })
  })
})
