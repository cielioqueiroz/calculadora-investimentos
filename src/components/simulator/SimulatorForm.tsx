import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { INVESTMENT_TYPES, getInvestmentType } from '@/constants/investments'
import { resolveAnnualRate } from '@/lib/calculations'
import { cn, formatPercent } from '@/lib/utils'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/translations'

const PERIOD_PRESETS = [12, 24, 36, 60, 120]

export function SimulatorForm() {
  const params = useSimulationStore((s) => s.params)
  const marketRates = useSimulationStore((s) => s.marketRates)
  const setParams = useSimulationStore((s) => s.setParams)
  const setCustomRate = useSimulationStore((s) => s.setCustomRate)
  const setMode = useSimulationStore((s) => s.setMode)
  const setTarget = useSimulationStore((s) => s.setTarget)
  const { t } = useTranslation()

  const selectedType = getInvestmentType(params.investmentTypeId)

  const annualRate = useMemo(
    () =>
      selectedType
        ? resolveAnnualRate(selectedType, marketRates, params.customRate)
        : 0,
    [selectedType, marketRates, params.customRate],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('simulator.form.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-2 rounded-md bg-secondary p-1">
          {(['project', 'goal'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMode(mode)}
              className={cn(
                'rounded px-3 py-1.5 text-sm font-medium transition-colors',
                params.mode === mode
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {mode === 'project'
                ? t('simulator.mode.project')
                : t('simulator.mode.goal')}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment-type">{t('simulator.form.type')}</Label>
          <Select
            value={params.investmentTypeId}
            onValueChange={(value) => setParams({ investmentTypeId: value })}
          >
            <SelectTrigger id="investment-type">
              <SelectValue placeholder={t('simulator.form.typePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {INVESTMENT_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedType && (
          <div className="space-y-2 rounded-md border border-border/15 bg-background/50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                {t('simulator.badge.perYear', {
                  rate: formatPercent(annualRate),
                })}
              </Badge>
              <Badge variant="outline">
                {t('simulator.badge.risk', {
                  risk: t(`risk.${selectedType.risk}` as TranslationKey),
                })}
              </Badge>
              {selectedType.taxExempt ? (
                <Badge variant="success">{t('simulator.badge.exempt')}</Badge>
              ) : (
                <Badge variant="secondary">{t('simulator.badge.taxed')}</Badge>
              )}
              {selectedType.fgcProtected && <Badge variant="outline">FGC</Badge>}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t(`investment.${selectedType.id}.desc` as TranslationKey)}
            </p>
          </div>
        )}

        {selectedType?.rateBasis === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="custom-rate">{t('simulator.form.expectedRate')}</Label>
            <Input
              id="custom-rate"
              type="number"
              step={0.5}
              value={params.customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
            />
            <p className="text-xs text-destructive">
              {t('simulator.form.volatilityWarning')}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="initial-amount">{t('simulator.form.initial')}</Label>
          <Input
            id="initial-amount"
            type="number"
            min={0}
            step={100}
            value={params.initialAmount}
            onChange={(e) =>
              setParams({ initialAmount: Math.max(0, Number(e.target.value)) })
            }
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {params.mode === 'project' ? (
            <motion.div
              key="monthly"
              className="space-y-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="monthly">{t('simulator.form.monthly')}</Label>
              <Input
                id="monthly"
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
            </motion.div>
          ) : (
            <motion.div
              key="target"
              className="space-y-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="target">{t('simulator.form.target')}</Label>
              <Input
                id="target"
                type="number"
                min={0}
                step={1000}
                value={params.targetAmount}
                onChange={(e) => setTarget(Math.max(0, Number(e.target.value)))}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Label htmlFor="months">{t('simulator.form.period')}</Label>
          <Input
            id="months"
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
          <div className="flex flex-wrap gap-2 pt-1">
            {PERIOD_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setParams({ months: preset })}
                className="rounded-md border border-border/15 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {preset >= 12
                  ? `${preset / 12}${t('preset.yearSuffix')}`
                  : `${preset}${t('preset.monthSuffix')}`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inflation">{t('simulator.form.inflation')}</Label>
          <Input
            id="inflation"
            type="number"
            min={0}
            step={0.1}
            value={params.inflationRate}
            onChange={(e) =>
              setParams({ inflationRate: Math.max(0, Number(e.target.value)) })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
