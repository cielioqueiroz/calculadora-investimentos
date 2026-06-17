import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MarketSection } from '@/components/market/MarketSection'
import { B3LiveGate } from '@/components/market/B3LiveGate'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function Market() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setParams = useSimulationStore((s) => s.setParams)
  const setMode = useSimulationStore((s) => s.setMode)
  const [b3Key, setB3Key] = useState(0)

  function simulateCrypto() {
    setMode('project')
    setParams({ investmentTypeId: 'cripto' })
    navigate('/simulador')
  }

  return (
    <div className="space-y-10">
      <PageHeader title={t('market.title')} description={t('market.subtitle')} />
      <MarketSection source="forex" title={t('market.economies')} />
      <MarketSection
        source="crypto"
        title={t('market.crypto')}
        onSimulate={simulateCrypto}
      />
      <div className="space-y-3">
        <B3LiveGate onActivate={() => setB3Key((k) => k + 1)} />
        <MarketSection key={b3Key} source="b3" title={t('market.b3')} />
      </div>
    </div>
  )
}
