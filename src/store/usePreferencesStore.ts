import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/translations'

export type Theme = 'light' | 'dark'

interface PreferencesState {
  theme: Theme
  locale: Locale
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLocale: (locale: Locale) => void
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
}

function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      locale: DEFAULT_LOCALE,
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
      setLocale: (locale) => {
        applyLocale(locale)
        set({ locale })
      },
    }),
    {
      name: 'investment-calculator:preferences',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
          applyLocale(state.locale)
        }
      },
    },
  ),
)
