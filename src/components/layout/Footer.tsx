import { useTranslation } from '@/i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-1 px-4 py-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          <span className="font-semibold text-foreground">InvestCalc</span>
          <span className="mx-1.5 opacity-40">·</span>
          {t('footer.rights', { year })}
        </p>
        <p className="md:max-w-md md:text-right">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  )
}
