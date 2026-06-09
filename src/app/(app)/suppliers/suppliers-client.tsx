'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Filter, ListOrdered, Truck, Package, BadgeCheck, Clock, MessageSquare, Mail, MoreVertical, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from '@/components/ui/submit-button'
import { addSupplier, deleteSupplier } from '@/app/actions/master'

export function SuppliersClient({ suppliersData, isViewer }: { suppliersData: any[], isViewer: boolean }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalSuppliers = suppliersData.length
  const activeOrders = 0
  const verifiedPercent = totalSuppliers > 0 ? 100 : 0
  const deliveryTime = 0

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsLoading(false)
    }, 400)
  }

  const handleAction = async (action: string, supplierName: string, id?: string) => {
    if (action === 'chat') {
      toast.info(`Membuka jendela obrolan aman dengan ${supplierName}...`, { icon: '💬' })
    } else if (action === 'email') {
      toast.success(`Menyiapkan draft email untuk ${supplierName}...`, { icon: '📧' })
    } else if (action === 'edit') {
      toast(`Membuka form edit untuk ${supplierName}`)
    } else if (action === 'delete' && id) {
      if (confirm(`Anda yakin ingin menghapus pemasok ${supplierName}?`)) {
        const toastId = toast.loading(`Menghapus ${supplierName}...`)
        const res = await deleteSupplier(id)
        if (res?.error) {
          toast.error(`Gagal menghapus: ${res.error}`, { id: toastId })
        } else {
          toast.success(`${supplierName} berhasil dihapus`, { id: toastId })
        }
      }
    }
  }

  async function handleAddSupplier(formData: FormData) {
    const res = await addSupplier(formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Pemasok baru berhasil ditambahkan ke sistem!', { icon: '✨' })
      setIsAddingSupplier(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Daftar Pemasok</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola hubungan dan pantau performa pemasok global Anda.</p>
        </div>
        {!isViewer && (
          <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pemasok Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Pemasok Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail pemasok untuk ditambahkan ke daftar master.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddSupplier} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Perusahaan</Label>
                  <Input id="company" name="company" placeholder="Misal: PT Teknologi Cemerlang" className="h-11 rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kontak Person</Label>
                  <Input id="name" name="name" placeholder="Misal: Budi Santoso" className="h-11 rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Resmi</Label>
                  <Input id="email" name="email" type="email" placeholder="budi@perusahaan.com" className="h-11 rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nomor Telepon</Label>
                  <Input id="phone" name="phone" placeholder="Misal: 08123456789" className="h-11 rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</Label>
                  <Input id="address" name="address" placeholder="Misal: Jl. Sudirman No. 1" className="h-11 rounded-xl" required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddingSupplier(false)} className="rounded-xl h-11">Batal</Button>
                  <SubmitButton className="rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700">Simpan Pemasok</SubmitButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={() => toast('Menampilkan grafik total pemasok')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Truck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Pemasok</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{totalSuppliers}</h3>
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-[10px]">+0% Bulan ini</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={() => toast.warning('Menampilkan 0 pesanan aktif yang perlu diproses')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pesanan Aktif</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{activeOrders}</h3>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-[10px]">Normal</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={() => toast.success('Mengunduh laporan sertifikasi pemasok...')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <BadgeCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pemasok Terverifikasi</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{verifiedPercent}%</h3>
              <span className="text-xs font-bold text-indigo-600 ml-2">Kualitas Tinggi</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={() => toast('Menganalisa efisiensi logistik...')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Waktu Pengiriman</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-slate-800">Efektif</h3>
              <span className="text-xs font-medium text-slate-500">Rata-rata {deliveryTime} hari</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar & List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="animate-pulse font-bold text-indigo-600">Memuat data...</span>
          </div>
        )}

        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-700 font-semibold rounded-lg">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-xl">
                <DropdownMenuLabel>Filter Pemasok</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast('Filter: Hanya Terverifikasi diterapkan')}>Hanya Terverifikasi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast('Filter: Pesanan Aktif diterapkan')}>Sedang Ada Pesanan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast('Filter: Area Lokal diterapkan')}>Area Lokal (Indonesia)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast('Filter dihapus')}>Hapus Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-700 font-semibold rounded-lg">
                  <ListOrdered className="w-4 h-4 mr-2" />
                  Urutkan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-xl">
                <DropdownMenuLabel>Urutkan Berdasarkan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast('Diurutkan: A-Z')}>Nama Pemasok (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast('Diurutkan: Pesanan Terbanyak')}>Pesanan Terbanyak</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast('Diurutkan: Pembaruan Terakhir')}>Pembaruan Terakhir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
          <span className="text-sm font-medium text-slate-500">
            Menampilkan {totalSuppliers > 0 ? ((currentPage - 1) * 10) + 1 : 0}-{Math.min(currentPage * 10, totalSuppliers)} dari {totalSuppliers} pemasok
          </span>
        </div>

        {totalSuppliers > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Pemasok</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Kontak Person</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Telepon & Alamat</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliersData.slice((currentPage - 1) * 10, currentPage * 10).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                          <Truck className="w-6 h-6 opacity-80" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toast(`Membuka profil ${s.company}`)}>{s.company}</h4>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{s.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <h4 className="text-sm font-medium text-slate-800">{s.name}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{s.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <h4 className="text-sm font-medium text-slate-800">{s.phone || '-'}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5 max-w-[200px] truncate">{s.address || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => handleAction('chat', s.company)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAction('email', s.company)} className="w-8 h-8 rounded-lg bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-600 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors ml-1">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-48">
                            <DropdownMenuItem onClick={() => handleAction('edit', s.company)}>Edit Detail Pemasok</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast(`Membuka riwayat pesanan ${s.company}`)}>Riwayat Pesanan</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction('delete', s.company, s.id)} className="text-red-600">Hapus Pemasok</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center shadow-sm mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Pemasok</h3>
            <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm text-center">Anda belum menambahkan data pemasok (supplier). Klik "Tambah Pemasok Baru" untuk memulai.</p>
          </div>
        )}

        {/* Pagination */}
        {totalSuppliers > 10 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-9 bg-white border-slate-200 text-slate-600 font-semibold rounded-lg">
              &lt; Sebelumnya
            </Button>
            <div className="flex items-center gap-1">
              {[1].map(page => (
                <Button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? 'default' : 'ghost'} 
                  className={`w-8 h-8 rounded-lg p-0 text-sm font-bold ${currentPage === page ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600'}`}>
                  {page}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * 10 >= totalSuppliers}
              className="h-9 bg-white border-slate-200 text-slate-600 font-semibold rounded-lg">
              Berikutnya &gt;
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}
