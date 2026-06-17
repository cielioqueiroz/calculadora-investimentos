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
