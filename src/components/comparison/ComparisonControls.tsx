import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { INVESTMENT_TYPES } from '@/constants/investments'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function ComparisonControls() {
  const params = useSimulationStore((s) => s.params)
  const setParams = useSimulationStore((s) => s.setParams)
  const comparisonIds = useSimulationStore((s) => s.comparisonIds)
  const toggleComparison = useSimulationStore((s) => s.toggleComparison)
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('comparison.controls.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cmp-initial">{t('comparison.controls.initial')}</Label>
            <Input
              id="cmp-initial"
              type="number"
              min={0}
              step={100}
              value={params.initialAmount}
              onChange={(e) =>
                setParams({ initialAmount: Math.max(0, Number(e.target.value)) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cmp-monthly">{t('comparison.controls.monthly')}</Label>
            <Input
              id="cmp-monthly"
              type="number"
              min={0}
              step={50}
              value={params.monthlyContribution}
              onChange={(e) =>
                setParams({
                  monthlyContribution: Math.max(0, Number(e.target.value)),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cmp-months">{t('comparison.controls.period')}</Label>
            <Input
              id="cmp-months"
              type="number"
              min={1}
              max={600}
              value={params.months}
              onChange={(e) =>
                setParams({
                  months: Math.min(600, Math.max(1, Number(e.target.value))),
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('comparison.controls.selected')}</Label>
          <div className="flex flex-wrap gap-2">
            {INVESTMENT_TYPES.map((type) => {
              const active = comparisonIds.includes(type.id)
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleComparison(type.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name}
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
