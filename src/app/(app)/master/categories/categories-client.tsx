'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Tag, Edit2, Trash2, FolderOpen } from 'lucide-react'
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
import Link from 'next/link'
import { useState, useRef } from 'react'
import { SubmitButton } from '@/components/ui/submit-button'
import { addCategory, deleteCategory } from '@/app/actions/master'

export function CategoriesClient({ categories, isViewer }: { categories: any[], isViewer: boolean }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  
  const handleAction = async (action: string, name: string, id?: string) => {
    if (action === 'delete' && id) {
      if (confirm(`Anda yakin ingin menghapus kategori ${name}?`)) {
        const toastId = toast.loading(`Menghapus ${name}...`)
        const res = await deleteCategory(id)
        if (res?.error) {
          toast.error(`Gagal menghapus: ${res.error}`, { id: toastId })
        } else {
          toast.success(`Kategori ${name} berhasil dihapus`, { id: toastId })
        }
      }
    } else {
      toast.success(`${action} untuk kategori ${name} berhasil`)
    }
  }

  async function handleSubmit(formData: FormData) {
    const res = await addCategory(formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Kategori baru berhasil ditambahkan!')
      formRef.current?.reset()
      setOpen(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Kategori Produk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Klasifikasikan inventaris Anda untuk pencarian yang lebih cepat.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isViewer && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <form action={handleSubmit} ref={formRef}>
                  <DialogHeader>
                    <DialogTitle>Buat Kategori Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan nama dan deskripsi kategori untuk pengelompokan produk.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cname" className="text-xs font-bold text-slate-500">Nama Kategori</Label>
                      <Input id="cname" name="name" placeholder="Contoh: Elektronik" required className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cdesc" className="text-xs font-bold text-slate-500">Deskripsi (Opsional)</Label>
                      <Input id="cdesc" name="description" placeholder="Contoh: Gadget dan aksesoris komputer" className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" className="rounded-xl h-11 w-full sm:w-auto" onClick={() => setOpen(false)}>Batal</Button>
                    <SubmitButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 w-full sm:w-auto mt-2 sm:mt-0">Simpan Kategori</SubmitButton>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? categories.map((c: any) => (
          <Card key={c.id} className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-300 transition-colors">
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
                      <DropdownMenuItem onClick={() => handleAction('Edit', c.name)}>Edit Kategori</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAction('delete', c.name, c.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                        Hapus Kategori
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4 pr-10">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{c.name}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">{c.description || 'Tidak ada deskripsi'}</p>
                </div>
              </div>
              
            </CardContent>
            <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Produk</span>
              <Badge className="bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">{c.itemCount || 0} Item</Badge>
            </div>
          </Card>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <FolderOpen className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Kategori</h3>
            <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm text-center">Anda belum menambahkan kategori produk. Tambahkan kategori pertama Anda untuk mengelompokkan inventaris.</p>
          </div>
        )}
      </div>

    </div>
  )
}
