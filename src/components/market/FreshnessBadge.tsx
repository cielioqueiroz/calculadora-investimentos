import { useTranslation } from '@/i18n/useTranslation'
import { timeAgo } from '@/lib/market/format'
import { cn } from '@/lib/utils'
import type { TranslationKey } from '@/i18n/translations'
import type { MarketStatus } from '@/lib/market/types'

interface FreshnessBadgeProps {
  status: MarketStatus
  updatedAt: number
}

export function FreshnessBadge({ status, updatedAt }: FreshnessBadgeProps) {
  const { t } = useTranslation()
  const ago = timeAgo(updatedAt)

  const label =
    status === 'live'
      ? ago.unit === 'now'
        ? t('market.fresh.now')
        : t('market.fresh.ago', {
            value: `${ago.value}${t(`market.unit.${ago.unit}` as TranslationKey)}`,
          })
      : status === 'stale'
        ? t('market.fresh.delayed')
        : t('market.fresh.demo')

  const dot =
    status === 'live'
      ? 'bg-success'
      : status === 'stale'
        ? 'bg-primary'
        : 'bg-muted-foreground'

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className={cn('h-1.5 w-1.5 rounded-full', dot, status === 'live' && 'animate-pulse')} />
      {label}
    </span>
  )
}
