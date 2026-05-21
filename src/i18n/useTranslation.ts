import { useCallback } from 'react'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import {
  DEFAULT_LOCALE,
  TRANSLATIONS,
  type Locale,
  type TranslationKey,
} from './translations'

type Vars = Record<string, string | number>

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}

export function useTranslation() {
  const locale = usePreferencesStore((s) => s.locale)

  const t = useCallback(
    (key: TranslationKey, vars?: Vars): string => {
      const dict = TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE]
      return interpolate(dict[key] ?? key, vars)
    },
    [locale],
  )

  const formatMonths = useCallback(
    (months: number): string => {
      const dict = TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE]
      const years = Math.floor(months / 12)
      const remaining = months % 12
      const parts: string[] = []
      if (years > 0)
        parts.push(
          `${years} ${years === 1 ? dict['duration.year'] : dict['duration.years']}`,
        )
      if (remaining > 0)
        parts.push(
          `${remaining} ${remaining === 1 ? dict['duration.month'] : dict['duration.months']}`,
        )
      return parts.join(dict['duration.and']) || `0 ${dict['duration.months']}`
    },
    [locale],
  )

  return { t, locale: locale as Locale, formatMonths }
}
