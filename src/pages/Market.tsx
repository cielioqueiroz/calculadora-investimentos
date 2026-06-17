import { PageHeader } from '@/components/shared/PageHeader'
import { MarketSection } from '@/components/market/MarketSection'
import { useTranslation } from '@/i18n/useTranslation'

export function Market() {
  const { t } = useTranslation()

  return (
    <div className="space-y-10">
      <PageHeader title={t('market.title')} description={t('market.subtitle')} />
      <MarketSection source="forex" title={t('market.economies')} />
      <MarketSection source="crypto" title={t('market.crypto')} />
      <MarketSection source="b3" title={t('market.b3')} />
    </div>
  )
}
