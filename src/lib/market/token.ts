const KEY = 'investment-calculator:brapi-token'

export function getBrapiToken(): string {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored) return stored
  } catch {
    // ignore storage access errors
  }
  return import.meta.env.VITE_BRAPI_TOKEN ?? ''
}

export function setBrapiToken(value: string): void {
  try {
    const trimmed = value.trim()
    if (trimmed) {
      localStorage.setItem(KEY, trimmed)
    } else {
      localStorage.removeItem(KEY)
    }
  } catch {
    // ignore storage access errors
  }
}
