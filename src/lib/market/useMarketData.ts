import { useEffect, useRef, useState } from 'react'
import type { MarketResult, MarketSource, Quote, Reading } from './types'
import { readCache, writeCache, SNAPSHOTS } from './snapshots'
import { fetchCrypto } from './providers/crypto'
import { fetchForex } from './providers/forex'
import { fetchB3 } from './providers/b3'

const FETCHERS: Record<MarketSource, (signal?: AbortSignal) => Promise<Reading>> = {
  crypto: fetchCrypto,
  forex: fetchForex,
  b3: fetchB3,
}

/** Beyond this age a reading is labelled delayed instead of live. */
const LIVE_WINDOW = 15 * 60_000

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
        const { data, updatedAt } = await FETCHERS[source](controller.signal)
        if (!active) return
        writeCache(source, data)
        // A snapshot carries its own timestamp: only recent data may claim to
        // be live, otherwise the badge would vouch for a stale price.
        const stamp = updatedAt ?? Date.now()
        const fresh = Date.now() - stamp < LIVE_WINDOW
        setResult({ data, status: fresh ? 'live' : 'stale', updatedAt: stamp })
      } catch {
        if (!active || controller.signal.aborted) return
        const cached = readCache(source)
        if (cached) setResult(cached)
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
