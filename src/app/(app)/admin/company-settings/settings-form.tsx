'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { updateCompanySettings } from '@/app/actions/company'
import { toast } from 'sonner'

export function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const result = await updateCompanySettings(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Pengaturan disimpan!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Perusahaan</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company_slug">Company Slug (Identifier Unik)</Label>
        <Input id="company_slug" name="company_slug" defaultValue={initialData?.company_slug} required />
        <p className="text-sm text-muted-foreground">Digunakan untuk akses API atau sub-domain di masa depan.</p>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
    </form>
  )
}
