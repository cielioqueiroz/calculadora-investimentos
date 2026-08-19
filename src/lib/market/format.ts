import type { Locale } from '@/i18n/translations'

const LOCALE_TAG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

function tag(locale: string): string {
  return LOCALE_TAG[locale as Locale] ?? 'pt-BR'
}

export function formatPrice(
  value: number,
  currency: 'BRL' | 'USD',
  locale: string,
): string {
  const safe = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat(tag(locale), {
    style: 'currency',
    currency,
  }).format(safe)
}

export function formatSignedPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  const body = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe)
  const sign = safe > 0 ? '+' : ''
  return `${sign}${body}%`
}

export function formatCompact(value: number, locale: string): string {
  const safe = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat(tag(locale), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safe)
}

export function timeAgo(
  epochMs: number,
  now: number = Date.now(),
): { unit: 'now' | 's' | 'm' | 'h' | 'd'; value: number } {
  const seconds = Math.max(0, Math.floor((now - epochMs) / 1000))
  if (seconds < 5) return { unit: 'now', value: 0 }
  if (seconds < 60) return { unit: 's', value: seconds }
  if (seconds < 3600) return { unit: 'm', value: Math.floor(seconds / 60) }
  if (seconds < 86400) return { unit: 'h', value: Math.floor(seconds / 3600) }
  return { unit: 'd', value: Math.floor(seconds / 86400) }
}
