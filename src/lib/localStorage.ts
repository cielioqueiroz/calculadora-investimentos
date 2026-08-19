import { z } from 'zod'
import type { SavedSimulation } from '@/types'

const STORAGE_KEY = 'investment-calculator:simulations'

const monthlyPointSchema = z.object({
  month: z.number(),
  invested: z.number(),
  interest: z.number(),
  grossBalance: z.number(),
})

const savedSimulationSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  input: z.object({
    investmentTypeId: z.string(),
    initialAmount: z.number(),
    monthlyContribution: z.number(),
    months: z.number(),
    annualRate: z.number(),
  }),
  result: z.object({
    investmentTypeId: z.string(),
    totalInvested: z.number(),
    grossBalance: z.number(),
    grossInterest: z.number(),
    taxRate: z.number(),
    taxAmount: z.number(),
    netBalance: z.number(),
    netInterest: z.number(),
    effectiveAnnualRate: z.number(),
    months: z.number(),
    inflationRate: z.number(),
    realNetBalance: z.number(),
    breakdown: z.array(monthlyPointSchema),
  }),
})

// Stored entries are replayed into charts and currency formatting, so anything
// that does not match the shape is dropped instead of trusted.
function read(): SavedSimulation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      const result = savedSimulationSchema.safeParse(item)
      return result.success ? [result.data] : []
    })
  } catch {
    return []
  }
}

function write(simulations: SavedSimulation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations))
  } catch (error) {
    console.error('Could not persist simulations to localStorage.', error)
  }
}

export function getSimulations(): SavedSimulation[] {
  return read().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getSimulation(id: string): SavedSimulation | undefined {
  return read().find((item) => item.id === id)
}

export function saveSimulation(simulation: SavedSimulation): SavedSimulation {
  const all = read()
  const index = all.findIndex((item) => item.id === simulation.id)
  if (index >= 0) {
    all[index] = simulation
  } else {
    all.push(simulation)
  }
  write(all)
  return simulation
}

export function deleteSimulation(id: string): void {
  write(read().filter((item) => item.id !== id))
}

export function clearSimulations(): void {
  write([])
}
