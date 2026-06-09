'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Scale, Edit2, Trash2, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useRef } from 'react'
import { SubmitButton } from '@/components/ui/submit-button'
import { addUnit, deleteUnit } from '@/app/actions/master'

export function UnitsClient({ units, isViewer }: { units: any[], isViewer: boolean }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  
  const handleAction = async (action: string, name: string, id?: string) => {
    if (action === 'delete' && id) {
      if (confirm(`Anda yakin ingin menghapus satuan ${name}?`)) {
        const toastId = toast.loading(`Menghapus ${name}...`)
        const res = await deleteUnit(id)
        if (res?.error) {
          toast.error(`Gagal menghapus: ${res.error}`, { id: toastId })
        } else {
          toast.success(`Satuan ${name} berhasil dihapus`, { id: toastId })
        }
      }
    } else {
      toast.success(`${action} untuk satuan ${name} berhasil`)
    }
  }

  async function handleSubmit(formData: FormData) {
    const res = await addUnit(formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Satuan baru berhasil ditambahkan!')
      formRef.current?.reset()
      setOpen(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Satuan Unit</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola standar pengukuran untuk inventaris Anda.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isViewer && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 rounded-lg font-semibold shadow-sm flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Satuan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <form action={handleSubmit} ref={formRef}>
                  <DialogHeader>
                    <DialogTitle>Buat Satuan Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan nama satuan dan singkatannya.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="uname" className="text-xs font-bold text-slate-500">Nama Satuan</Label>
                      <Input id="uname" name="name" placeholder="Contoh: Kilogram" required className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uabbr" className="text-xs font-bold text-slate-500">Singkatan (Kode)</Label>
                      <Input id="uabbr" name="abbreviation" placeholder="Contoh: kg" required className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" className="rounded-xl h-11 w-full sm:w-auto" onClick={() => setOpen(false)}>Batal</Button>
                    <SubmitButton className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 w-full sm:w-auto mt-2 sm:mt-0">Simpan Satuan</SubmitButton>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {units.length > 0 ? units.map((u: any) => (
          <Card key={u.id} className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-emerald-300 transition-colors">
            <CardContent className="p-5 flex-1 relative">
              {!isViewer && (
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleAction('Edit', u.name)}>Edit Satuan</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAction('delete', u.name, u.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                        Hapus Satuan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="flex flex-col items-center justify-center text-center gap-2 mb-2 pt-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                  <Scale className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">{u.name}</h4>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-mono font-bold text-sm border-0">{u.abbreviation}</Badge>
              </div>
              
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <FolderOpen className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Satuan</h3>
            <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm text-center">Anda belum menambahkan satuan produk.</p>
          </div>
        )}
      </div>

    </div>
  )
}
