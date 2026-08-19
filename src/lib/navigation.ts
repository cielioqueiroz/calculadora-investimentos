import { Calculator, GitCompareArrows, History, LineChart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TranslationKey } from '@/i18n/translations'

export interface NavItem {
  to: string
  labelKey: TranslationKey
  icon: LucideIcon
  end: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.calculator', icon: Calculator, end: true },
  { to: '/mercado', labelKey: 'nav.market', icon: LineChart, end: false },
  { to: '/comparar', labelKey: 'nav.compare', icon: GitCompareArrows, end: false },
  { to: '/historico', labelKey: 'nav.history', icon: History, end: false },
]
