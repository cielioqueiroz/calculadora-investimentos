import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useId } from 'react'

interface SparklineProps {
  data: number[]
  up: boolean
  height?: number
}

export function Sparkline({ data, up, height = 40 }: SparklineProps) {
  const id = useId().replace(/[:]/g, '')
  const color = up ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
  const points = data.map((value, index) => ({ index, value }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
