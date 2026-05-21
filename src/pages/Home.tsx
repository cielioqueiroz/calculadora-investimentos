import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Calculator,
  GitCompareArrows,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { INVESTMENT_TYPES } from '@/constants/investments'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/translations'

export function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Calculator,
      title: t('home.features.simulate.title'),
      description: t('home.features.simulate.desc'),
    },
    {
      icon: GitCompareArrows,
      title: t('home.features.compare.title'),
      description: t('home.features.compare.desc'),
    },
    {
      icon: ShieldCheck,
      title: t('home.features.info.title'),
      description: t('home.features.info.desc'),
    },
  ]

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background p-8 md:p-12">
        <Badge variant="default" className="mb-4">
          <Sparkles className="mr-1 h-3 w-3" />
          {t('home.badge')}
        </Badge>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
          {t('home.hero.title')}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {t('home.hero.subtitle')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/simulador">
              {t('home.hero.ctaPrimary')}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/comparar">{t('home.hero.ctaSecondary')}</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardContent className="space-y-3 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {t('home.types.title')}
          </h2>
          <Button asChild variant="link" className="text-primary">
            <Link to="/comparar">
              {t('home.types.compareAll')}
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INVESTMENT_TYPES.map((type) => (
            <Card key={type.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <h3 className="font-semibold text-foreground">
                      {type.name}
                    </h3>
                  </div>
                  {type.taxExempt ? (
                    <Badge variant="success">{t('home.card.exempt')}</Badge>
                  ) : (
                    <Badge variant="secondary">{t('home.card.taxed')}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(`investment.${type.id}.desc` as TranslationKey)}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="rounded bg-background/60 px-2 py-1">
                    {t(`category.${type.category}` as TranslationKey)}
                  </span>
                  <span className="rounded bg-background/60 px-2 py-1">
                    {t('home.card.risk', {
                      risk: t(`risk.${type.risk}` as TranslationKey),
                    })}
                  </span>
                  <span className="rounded bg-background/60 px-2 py-1">
                    {t('home.card.liquidity', {
                      value: t(`liquidity.${type.liquidity}` as TranslationKey),
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
