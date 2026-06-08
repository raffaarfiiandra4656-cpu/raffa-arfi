'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Filter, ListOrdered, Truck, Package, BadgeCheck, Clock, MessageSquare, Mail, MoreVertical } from 'lucide-react'
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

export function SuppliersClient({ suppliersData, isViewer }: { suppliersData: any[], isViewer: boolean }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Dummy values based on mockup if there is no data
  const totalSuppliers = suppliersData.length || 128
  const activeOrders = 42
  const verifiedPercent = 96
  const deliveryTime = 3.2

  const dummySuppliers = [
    { id: 1, name: 'IndoTech Electronics', loc: 'Jakarta, Indonesia', contact: 'Bambang Susilo', email: 'bambang.s@indotech.com', orders: 12, orderColor: 'indigo', lastUpd: '2 Jam yang lalu', updType: 'Pembaruan Inventaris', bg: 'bg-slate-100' },
    { id: 2, name: 'Global Logistics Co.', loc: 'Surabaya, Indonesia', contact: 'Siti Aminah', email: 'siti.aminah@global.id', orders: 5, orderColor: 'slate', lastUpd: '1 Hari yang lalu', updType: 'Konfirmasi Faktur', bg: 'bg-slate-800 text-white' },
    { id: 3, name: 'Majestic Parts LTD', loc: 'Semarang, Indonesia', contact: 'Andi Wijaya', email: 'andi.w@majestic.co.id', orders: 2, orderColor: 'red', lastUpd: '3 Jam yang lalu', updType: 'Status Pengiriman', bg: 'bg-zinc-800 text-white' },
    { id: 4, name: 'CloudBase Solutions', loc: 'Bandung, Indonesia', contact: 'Dewi Sari', email: 'dewi.s@cloudbase.com', orders: 0, orderColor: 'slate', lastUpd: '5 Hari yang lalu', updType: 'Review Kontrak', bg: 'bg-teal-800 text-white' },
  ]

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsLoading(false)
      toast.success(`Menampilkan halaman ${page}`)
    }, 400)
  }

  const handleAction = (action: string, supplierName: string) => {
    if (action === 'chat') {
      toast.info(`Membuka jendela obrolan aman dengan ${supplierName}...`, { icon: '💬' })
    } else if (action === 'email') {
      toast.success(`Menyiapkan draft email untuk ${supplierName}...`, { icon: '📧' })
    } else if (action === 'edit') {
      toast(`Membuka form edit untuk ${supplierName}`)
    } else if (action === 'delete') {
      toast.error(`Sistem menolak: Anda tidak memiliki akses untuk menghapus ${supplierName}`)
    }
  }

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Pemasok baru berhasil ditambahkan ke sistem!', { icon: '✨' })
    setIsAddingSupplier(false)
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
            <DialogTrigger 
              render={
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pemasok Baru
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Pemasok Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail pemasok untuk ditambahkan ke daftar master.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSupplier} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Perusahaan</Label>
                  <Input id="name" placeholder="Misal: PT Teknologi Cemerlang" className="h-11 rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kontak Person</Label>
                  <Input id="contact" placeholder="Misal: Budi Santoso" className="h-11 rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Resmi</Label>
                  <Input id="email" type="email" placeholder="budi@perusahaan.com" className="h-11 rounded-xl" required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddingSupplier(false)} className="rounded-xl h-11">Batal</Button>
                  <Button type="submit" className="rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700">Simpan Pemasok</Button>
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
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-[10px]">+12% Bulan ini</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={() => toast.warning('Menampilkan 42 pesanan aktif yang perlu diproses')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pesanan Aktif</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{activeOrders}</h3>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-[10px]">Urgent</Badge>
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
              <DropdownMenuTrigger 
                render={
                  <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-700 font-semibold rounded-lg">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                }
              />
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
              <DropdownMenuTrigger 
                render={
                  <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-700 font-semibold rounded-lg">
                    <ListOrdered className="w-4 h-4 mr-2" />
                    Urutkan
                  </Button>
                }
              />
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
            Menampilkan {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalSuppliers)} dari {totalSuppliers} pemasok
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Pemasok</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Kontak Person</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Pesanan Aktif</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Pembaruan Terakhir</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummySuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${s.bg}`}>
                        <Truck className="w-6 h-6 opacity-80" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toast(`Membuka profil ${s.name}`)}>{s.name}</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{s.loc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <h4 className="text-sm font-medium text-slate-800">{s.contact}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{s.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.orderColor === 'indigo' ? 'bg-indigo-500' : s.orderColor === 'red' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${s.orderColor === 'indigo' ? 'text-indigo-600' : s.orderColor === 'red' ? 'text-red-600' : 'text-slate-700'}`}>{s.orders}</span>
                        <span className="text-xs font-medium text-slate-500 -mt-1">{s.orders === 0 ? 'Pesanan' : s.orderColor === 'red' ? 'Tertunda' : 'Pesanan'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-slate-800">{s.lastUpd}</p>
                    <p className="text-xs font-bold text-slate-400 font-mono tracking-tight mt-0.5">{s.updType}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleAction('chat', s.name)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction('email', s.name)} className="w-8 h-8 rounded-lg bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          render={
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors ml-1">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end" className="rounded-xl w-48">
                          <DropdownMenuItem onClick={() => handleAction('edit', s.name)}>Edit Detail Pemasok</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast(`Membuka riwayat pesanan ${s.name}`)}>Riwayat Pesanan</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction('delete', s.name)} className="text-red-600">Hapus Pemasok</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-9 bg-white border-slate-200 text-slate-600 font-semibold rounded-lg">
            &lt; Sebelumnya
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(page => (
              <Button 
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? 'default' : 'ghost'} 
                className={`w-8 h-8 rounded-lg p-0 text-sm font-bold ${currentPage === page ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600'}`}>
                {page}
              </Button>
            ))}
            <span className="text-slate-400 px-1">...</span>
            <Button 
              onClick={() => handlePageChange(13)}
              variant={currentPage === 13 ? 'default' : 'ghost'} 
              className={`w-8 h-8 rounded-lg p-0 text-sm font-bold ${currentPage === 13 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600'}`}>
              13
            </Button>
          </div>
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(Math.min(13, currentPage + 1))}
            disabled={currentPage === 13}
            className="h-9 bg-white border-slate-200 text-slate-600 font-semibold rounded-lg">
            Berikutnya &gt;
          </Button>
        </div>
      </div>

    </div>
  )
}
