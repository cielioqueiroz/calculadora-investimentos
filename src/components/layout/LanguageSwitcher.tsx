import { Languages } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { useTranslation } from '@/i18n/useTranslation'
import { LOCALES, type Locale } from '@/i18n/translations'

export function LanguageSwitcher() {
  const locale = usePreferencesStore((s) => s.locale)
  const setLocale = usePreferencesStore((s) => s.setLocale)
  const { t } = useTranslation()

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger
        className="h-10 w-auto gap-2 border-none bg-transparent px-2 hover:bg-accent focus:ring-0 focus:ring-offset-0"
        aria-label={t('language.label')}
      >
        <Languages className="h-4 w-4 opacity-70" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {LOCALES.map((item) => (
          <SelectItem key={item.code} value={item.code}>
            <span className="flex items-center gap-2">
              <span aria-hidden>{item.flag}</span>
              {item.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
