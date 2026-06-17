import { useState } from 'react'
import { Radio } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getBrapiToken, setBrapiToken } from '@/lib/market/token'
import { useTranslation } from '@/i18n/useTranslation'

interface B3LiveGateProps {
  onActivate: () => void
}

export function B3LiveGate({ onActivate }: B3LiveGateProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  if (getBrapiToken()) return null

  function activate() {
    setBrapiToken(value)
    onActivate()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/15 bg-background/40 p-3 text-sm">
      <Radio className="h-4 w-4 shrink-0 text-primary" />
      <span className="text-muted-foreground">{t('market.b3.tokenHelp')}</span>
      <a
        href="https://brapi.dev"
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline"
      >
        brapi.dev
      </a>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('market.b3.tokenPlaceholder')}
        className="h-9 max-w-[220px]"
      />
      <Button size="sm" onClick={activate} disabled={!value.trim()}>
        {t('market.b3.tokenSave')}
      </Button>
    </div>
  )
}
