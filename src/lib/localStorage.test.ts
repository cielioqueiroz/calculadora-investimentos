import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearSimulations,
  deleteSimulation,
  getSimulation,
  getSimulations,
  saveSimulation,
} from './localStorage'
import { simulate } from './calculations'
import type { SavedSimulation } from '@/types'

function makeSimulation(
  id: string,
  createdAt: string,
  name = 'Sim',
): SavedSimulation {
  const input = {
    investmentTypeId: 'cdb',
    initialAmount: 1000,
    monthlyContribution: 100,
    months: 12,
    annualRate: 10,
  }
  return { id, name, createdAt, input, result: simulate(input, false) }
}

describe('localStorage repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(getSimulations()).toEqual([])
  })

  it('saves and retrieves a simulation by id', () => {
    const sim = makeSimulation('a', '2026-01-01T00:00:00.000Z')
    saveSimulation(sim)
    expect(getSimulation('a')).toEqual(sim)
    expect(getSimulations()).toHaveLength(1)
  })

  it('returns simulations sorted by creation date descending', () => {
    saveSimulation(makeSimulation('old', '2026-01-01T00:00:00.000Z'))
    saveSimulation(makeSimulation('new', '2026-05-01T00:00:00.000Z'))
    expect(getSimulations().map((s) => s.id)).toEqual(['new', 'old'])
  })

  it('updates an existing simulation instead of duplicating it', () => {
    saveSimulation(makeSimulation('a', '2026-01-01T00:00:00.000Z', 'First'))
    saveSimulation(makeSimulation('a', '2026-01-01T00:00:00.000Z', 'Updated'))
    expect(getSimulations()).toHaveLength(1)
    expect(getSimulation('a')?.name).toBe('Updated')
  })

  it('deletes a single simulation', () => {
    saveSimulation(makeSimulation('a', '2026-01-01T00:00:00.000Z'))
    saveSimulation(makeSimulation('b', '2026-02-01T00:00:00.000Z'))
    deleteSimulation('a')
    expect(getSimulations().map((s) => s.id)).toEqual(['b'])
  })

  it('clears every simulation', () => {
    saveSimulation(makeSimulation('a', '2026-01-01T00:00:00.000Z'))
    clearSimulations()
    expect(getSimulations()).toEqual([])
  })

  it('recovers gracefully from corrupted data', () => {
    localStorage.setItem('investment-calculator:simulations', '{ not json')
    expect(getSimulations()).toEqual([])
  })
})
