import { useState } from 'react'
import { Save } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useTranslation } from '@/i18n/useTranslation'

export function SaveSimulationDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const persistCurrent = useSimulationStore((s) => s.persistCurrent)
  const { t } = useTranslation()

  function handleSave() {
    persistCurrent(name.trim() || t('history.unnamed'))
    setName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Save />
          {t('simulator.save')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('save.title')}</DialogTitle>
          <DialogDescription>{t('save.desc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="simulation-name">{t('save.nameLabel')}</Label>
          <Input
            id="simulation-name"
            placeholder={t('save.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
