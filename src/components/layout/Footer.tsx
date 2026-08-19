import { useTranslation } from '@/i18n/useTranslation'

const REPO_URL = 'https://github.com/cielioqueiroz/calculadora-investimentos'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/15 bg-card/40">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-xs text-muted-foreground md:px-8">
        <p>{t('footer.disclaimer')}</p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-primary"
        >
          {t('footer.code')}
        </a>
      </div>
    </footer>
  )
}
