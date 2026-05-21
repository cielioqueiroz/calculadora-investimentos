import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'
import type { ComparisonRow } from './types'

interface ComparisonChartProps {
  rows: ComparisonRow[]
}

function compactCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

export function ComparisonChart({ rows }: ComparisonChartProps) {
  const { t } = useTranslation()
  const data = rows.map((row) => ({
    name: row.type.shortName,
    netBalance: row.result.netBalance,
    color: row.type.color,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('comparison.chart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={compactCurrency}
                width={56}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.4)' }}
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  t('comparison.chart.net'),
                ]}
              />
              <Bar dataKey="netBalance" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="netBalance"
                  position="top"
                  formatter={(value) => compactCurrency(Number(value))}
                  fill="hsl(214 32% 91%)"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
