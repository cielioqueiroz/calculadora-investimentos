import type { SavedSimulation } from '@/types'

const STORAGE_KEY = 'investment-calculator:simulations'

function read(): SavedSimulation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SavedSimulation[]) : []
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
