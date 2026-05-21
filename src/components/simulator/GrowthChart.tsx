import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'
import type { MonthlyPoint } from '@/types'

interface GrowthChartProps {
  data: MonthlyPoint[]
}

function compactCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

export function GrowthChart({ data }: GrowthChartProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('chart.growth.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${value}${t('chart.monthSuffix')}`}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={compactCurrency}
                width={56}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  color: 'hsl(var(--popover-foreground))',
                }}
                labelFormatter={(label) => t('chart.monthLabel', { n: label })}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === 'grossBalance'
                    ? t('chart.growth.gross')
                    : t('chart.growth.invested'),
                ]}
              />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="#818CF8"
                strokeWidth={2}
                fill="url(#fillInvested)"
              />
              <Area
                type="monotone"
                dataKey="grossBalance"
                stroke="#FFD700"
                strokeWidth={2}
                fill="url(#fillBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            {t('chart.growth.gross')}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#818CF8]" />
            {t('chart.growth.invested')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
