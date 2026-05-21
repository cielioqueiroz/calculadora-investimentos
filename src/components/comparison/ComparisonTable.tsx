import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'
import type { ComparisonRow } from './types'

interface ComparisonTableProps {
  rows: ComparisonRow[]
}

export function ComparisonTable({ rows }: ComparisonTableProps) {
  const { t } = useTranslation()
  const best = rows.reduce<ComparisonRow | null>((top, row) => {
    if (!top || row.result.netBalance > top.result.netBalance) return row
    return top
  }, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('comparison.table.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3 font-medium">
                  {t('comparison.table.investment')}
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  {t('comparison.table.rate')}
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  {t('comparison.table.gross')}
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  {t('comparison.table.tax')}
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  {t('comparison.table.net')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isBest = best?.type.id === row.type.id
                return (
                  <tr
                    key={row.type.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: row.type.color }}
                        />
                        <span className="font-medium text-foreground">
                          {row.type.name}
                        </span>
                        {isBest && (
                          <Badge variant="success">
                            {t('comparison.table.best')}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right text-muted-foreground">
                      {formatPercent(row.result.effectiveAnnualRate)}
                    </td>
                    <td className="px-6 py-3.5 text-right text-muted-foreground">
                      {formatCurrency(row.result.grossBalance)}
                    </td>
                    <td className="px-6 py-3.5 text-right text-destructive">
                      {row.result.taxAmount > 0
                        ? `- ${formatCurrency(row.result.taxAmount)}`
                        : t('comparison.table.exempt')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-primary">
                      {formatCurrency(row.result.netBalance)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
