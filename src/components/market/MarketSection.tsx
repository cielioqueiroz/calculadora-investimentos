import { motion } from 'motion/react'
import { useMarketData } from '@/lib/market/useMarketData'
import { QuoteCard } from './QuoteCard'
import { FreshnessBadge } from './FreshnessBadge'
import { scaleIn, staggerContainer } from '@/lib/animations'
import type { MarketSource, Quote } from '@/lib/market/types'

interface MarketSectionProps {
  source: MarketSource
  title: string
  onSimulate?: (quote: Quote) => void
}

export function MarketSection({ source, title, onSimulate }: MarketSectionProps) {
  const { data, status, updatedAt, loading } = useMarketData(source)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        <FreshnessBadge status={status} updatedAt={updatedAt} />
      </div>
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {loading && status === 'snapshot'
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg border border-border/15 bg-card/40"
              />
            ))
          : data.map((quote) => (
              <motion.div key={quote.symbol} variants={scaleIn} whileHover={{ y: -4 }}>
                <QuoteCard quote={quote} onSimulate={onSimulate} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  )
}
