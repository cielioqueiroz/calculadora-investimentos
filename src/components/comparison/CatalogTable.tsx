import { INVESTMENT_TYPES } from '@/constants/investments'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/translations'
import type { InvestmentType } from '@/types'

function taxKey(type: InvestmentType): TranslationKey {
  if (type.taxExempt) return 'catalog.tax.exempt'
  if (type.flatTaxRate) return 'catalog.tax.flat'
  return 'catalog.tax.regressive'
}

export function CatalogTable() {
  const { t } = useTranslation()

  return (
    <section>
      <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {t('catalog.title')}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border/15 bg-card/40">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/15 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">
                {t('comparison.table.investment')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('catalog.category')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('catalog.risk')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('catalog.liquidity')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('catalog.tax')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('catalog.fgc')}
              </th>
            </tr>
          </thead>
          <tbody>
            {INVESTMENT_TYPES.map((type) => (
              <tr
                key={type.id}
                className="border-b border-border/10 align-top last:border-0"
              >
                <td className="max-w-xs px-3 py-3">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    {type.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {t(`investment.${type.id}.desc` as TranslationKey)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                  {t(`category.${type.category}` as TranslationKey)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                  {t(`risk.${type.risk}` as TranslationKey)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                  {t(`liquidity.${type.liquidity}` as TranslationKey)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                  {t(taxKey(type))}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                  {type.fgcProtected ? t('catalog.fgc.yes') : t('catalog.fgc.no')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
