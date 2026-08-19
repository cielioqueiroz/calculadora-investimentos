import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { MarketTable } from '@/components/market/MarketTable'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'
import type { Quote } from '@/lib/market/types'

// The B3 feed also carries the Ibovespa index, which nobody buys directly.
const INDEX_SYMBOLS = ['^BVSP']

export function Market() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setParams = useSimulationStore((s) => s.setParams)
  const setMode = useSimulationStore((s) => s.setMode)

  function openInCalculator(investmentTypeId: string) {
    setMode('project')
    setParams({ investmentTypeId })
    navigate('/')
  }

  return (
    <div>
      <PageHeader title={t('market.title')} />
      <div className="space-y-8">
        <MarketTable
          source="forex"
          title={t('market.economies')}
          resolveInvestmentId={(quote: Quote) =>
            quote.symbol === 'USD' ? 'dolar' : null
          }
          onSimulate={openInCalculator}
        />
        <MarketTable
          source="crypto"
          title={t('market.crypto')}
          resolveInvestmentId={() => 'cripto'}
          onSimulate={openInCalculator}
        />
        <MarketTable
          source="b3"
          title={t('market.b3')}
          resolveInvestmentId={(quote: Quote) =>
            INDEX_SYMBOLS.includes(quote.symbol) ? 'etf' : 'acoes'
          }
          onSimulate={openInCalculator}
        />
      </div>
    </div>
  )
}
