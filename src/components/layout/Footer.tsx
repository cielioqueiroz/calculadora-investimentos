import { useTranslation } from '@/i18n/useTranslation'

const PORTFOLIO_URL = 'https://cielio-portfolio.vercel.app'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/15 bg-card/40 text-xs text-muted-foreground">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-3 md:px-8">
        <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-4">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>{t('footer.createdBy')}</span>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Ciélio Queiroz
            </a>
          </p>
          <p className="md:text-right">{t('footer.disclaimer')}</p>
        </div>
        <p className="mt-2 border-t border-border/10 pt-2 text-[11px] opacity-70">
          {t('footer.rights', { year })}
        </p>
      </div>
    </footer>
  )
}
