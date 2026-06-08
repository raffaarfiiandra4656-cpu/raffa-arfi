'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createInvitation } from '@/app/actions/invitations'
import { toast } from 'sonner'

export function CreateInviteButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const result = await createInvitation(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Undangan berhasil dibuat!')
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" /> Buat Undangan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Undang Anggota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" name="email" type="email" placeholder="email@contoh.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select name="role" defaultValue="STAFF">
              <SelectTrigger>
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN (Manajer)</SelectItem>
                <SelectItem value="STAFF">STAFF (Pekerja)</SelectItem>
                <SelectItem value="VIEWER">VIEWER (Hanya Lihat)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Undang'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
