'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Tag, Edit2, Trash2 } from 'lucide-react'
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

export function CategoriesClient({ categories, isViewer }: { categories: any[], isViewer: boolean }) {
  
  const handleAction = (action: string, name: string) => {
    toast.success(`${action} untuk kategori ${name} berhasil`)
  }

  const dummyCategories = categories.length > 0 ? categories : [
    { id: 1, name: 'Elektronik', description: 'Gadget, komputer, dan aksesoris', itemCount: 124 },
    { id: 2, name: 'Perabot Rumah', description: 'Furniture dan dekorasi ruangan', itemCount: 45 },
    { id: 3, name: 'Pakaian', description: 'Baju, celana, dan aksesoris fashion', itemCount: 88 },
  ]

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
            <Dialog>
              <DialogTrigger render={
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kategori
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Buat Kategori Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan nama dan deskripsi kategori untuk pengelompokan produk.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cname" className="text-xs font-bold text-slate-500">Nama Kategori</Label>
                    <Input id="cname" placeholder="Contoh: Elektronik" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cdesc" className="text-xs font-bold text-slate-500">Deskripsi (Opsional)</Label>
                    <Input id="cdesc" placeholder="Contoh: Gadget dan aksesoris komputer" className="h-11 rounded-xl" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogTrigger render={
                    <Button variant="outline" className="rounded-xl h-11 w-full sm:w-auto">Batal</Button>
                  } />
                  <DialogTrigger render={
                    <Button onClick={() => toast.success('Kategori baru berhasil ditambahkan!')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 w-full sm:w-auto mt-2 sm:mt-0">Simpan Kategori</Button>
                  } />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyCategories.map((c: any) => (
          <Card key={c.id} className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-300 transition-colors">
            <CardContent className="p-5 flex-1 relative">
              {!isViewer && (
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    } />
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleAction('Edit', c.name)}>Edit Kategori</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toast.error(`Hapus ditolak: Terdapat ${c.itemCount || 0} produk dalam kategori ini!`)} className="text-red-600 focus:bg-red-50 focus:text-red-700">
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
              <Badge className="bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">{c.itemCount || Math.floor(Math.random() * 100) + 10} Item</Badge>
            </div>
          </Card>
        ))}
      </div>

    </div>
  )
}
