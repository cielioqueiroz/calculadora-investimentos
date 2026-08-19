import { usePreferencesStore } from '@/store/usePreferencesStore'
import { useTranslation } from '@/i18n/useTranslation'
import { LOCALES } from '@/i18n/translations'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = usePreferencesStore((s) => s.locale)
  const setLocale = usePreferencesStore((s) => s.setLocale)
  const { t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="flex items-center rounded-md border border-border/25 p-0.5"
    >
      {LOCALES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code)}
          aria-pressed={locale === item.code}
          title={item.label}
          className={cn(
            'rounded px-2 py-1 text-xs font-medium tabular-nums transition-colors',
            locale === item.code
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {item.short}
        </button>
      ))}
    </div>
  )
}
