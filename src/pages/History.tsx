import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { HistoryCard } from '@/components/history/HistoryCard'
import { Button } from '@/components/ui/button'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function History() {
  const history = useSimulationStore((s) => s.history)
  const loadHistory = useSimulationStore((s) => s.loadHistory)
  const { t } = useTranslation()

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return (
    <div>
      <PageHeader
        title={t('history.title')}
        description={t('history.subtitle')}
      />

      {history.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={t('history.empty.title')}
          description={t('history.empty.desc')}
          action={
            <Button asChild>
              <Link to="/simulador">{t('history.empty.action')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {history.map((simulation) => (
            <HistoryCard key={simulation.id} simulation={simulation} />
          ))}
        </div>
      )}
    </div>
  )
}
