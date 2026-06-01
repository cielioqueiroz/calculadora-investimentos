import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { getInvestmentType } from '@/constants/investments'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'
import type { SavedSimulation } from '@/types'

interface HistoryCardProps {
  simulation: SavedSimulation
}

export function HistoryCard({ simulation }: HistoryCardProps) {
  const navigate = useNavigate()
  const removeSimulation = useSimulationStore((s) => s.removeSimulation)
  const loadFromHistory = useSimulationStore((s) => s.loadFromHistory)
  const { t, locale, formatMonths } = useTranslation()

  const type = getInvestmentType(simulation.input.investmentTypeId)
  const createdAt = new Date(simulation.createdAt).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  function handleOpen() {
    loadFromHistory(simulation)
    navigate('/simulador')
  }

  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">
              {simulation.name}
            </h3>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
          {type && (
            <Badge variant="outline" className="shrink-0">
              {type.shortName}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">
              {t('history.card.period')}
            </p>
            <p className="font-medium text-foreground">
              {formatMonths(simulation.input.months)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('history.card.invested')}
            </p>
            <p className="font-medium text-foreground">
              {formatCurrency(simulation.result.totalInvested)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('history.card.interest')}
            </p>
            <p className="font-medium text-success">
              {formatCurrency(simulation.result.netInterest)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('history.card.final')}
            </p>
            <p className="font-semibold text-primary">
              {formatCurrency(simulation.result.netBalance)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border/15 pt-3">
          <Button variant="ghost" size="sm" onClick={handleOpen}>
            {t('history.card.open')}
            <ArrowUpRight />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeSimulation(simulation.id)}
            aria-label={t('history.card.delete')}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
