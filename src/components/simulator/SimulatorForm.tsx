import { useMemo } from 'react'
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
import { formatPercent } from '@/lib/utils'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/translations'

const PERIOD_PRESETS = [12, 24, 36, 60, 120]

export function SimulatorForm() {
  const params = useSimulationStore((s) => s.params)
  const marketRates = useSimulationStore((s) => s.marketRates)
  const setParams = useSimulationStore((s) => s.setParams)
  const { t } = useTranslation()

  const selectedType = getInvestmentType(params.investmentTypeId)

  const annualRate = useMemo(
    () => (selectedType ? resolveAnnualRate(selectedType, marketRates) : 0),
    [selectedType, marketRates],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('simulator.form.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
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
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background/50 p-3">
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

        <div className="space-y-2">
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
        </div>

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
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {preset >= 12
                  ? `${preset / 12}${t('preset.yearSuffix')}`
                  : `${preset}${t('preset.monthSuffix')}`}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
