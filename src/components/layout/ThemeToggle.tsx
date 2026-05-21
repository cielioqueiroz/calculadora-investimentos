import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { useTranslation } from '@/i18n/useTranslation'

export function ThemeToggle() {
  const theme = usePreferencesStore((s) => s.theme)
  const toggleTheme = usePreferencesStore((s) => s.toggleTheme)
  const { t } = useTranslation()

  const isDark = theme === 'dark'
  const label = isDark ? t('theme.toLight') : t('theme.toDark')

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
