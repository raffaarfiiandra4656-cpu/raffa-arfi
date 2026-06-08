'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, MapPin, Activity, Edit2, Trash2 } from 'lucide-react'
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

export function WarehousesClient({ warehouses, totalSKU, totalValue, isViewer }: { warehouses: any[], totalSKU: number, totalValue: number, isViewer: boolean }) {
  
  const avgOccupancy = 74.2

  const dummyLocations = [
    { id: '1', name: 'JKT-01 Cakung', loc: 'Jakarta Timur, DKI Jakarta', util: 88, sku: 452, val: '1.4M', status: 'AKTIF', color: 'indigo' },
    { id: '2', name: 'SBY-04 Rungkut', loc: 'Surabaya, Jawa Timur', util: 94, sku: 320, val: '840jt', status: 'HAMPIR PENUH', color: 'amber' },
    { id: '3', name: 'MED-02 Belawan', loc: 'Medan, Sumatera Utara', util: 42, sku: 188, val: '560jt', status: 'AKTIF', color: 'emerald' },
  ]

  const handleAction = (action: string, name: string) => {
    toast.success(`${action} untuk ${name} berhasil dijalankan`)
  }

  return (
    <div className="space-y-8 pb-12 font-sans max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Manajemen Gudang</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau utilisasi kapasitas dan stok inventaris di seluruh lokasi.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari gudang..." 
              className="w-full pl-9 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>
          {!isViewer && (
            <Dialog>
              <DialogTrigger render={
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Gudang Baru
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Registrasi Gudang Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi lengkap mengenai lokasi penyimpanan baru Anda.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="wname" className="text-xs font-bold text-slate-500">Nama Gudang / Kode</Label>
                    <Input id="wname" placeholder="Contoh: BDG-01 Pasteur" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wloc" className="text-xs font-bold text-slate-500">Alamat Lengkap</Label>
                    <Input id="wloc" placeholder="Contoh: Jl. Pasteur No.12, Bandung" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wcap" className="text-xs font-bold text-slate-500">Kapasitas Maksimal (Unit)</Label>
                    <Input id="wcap" type="number" placeholder="5000" className="h-11 rounded-xl" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogTrigger render={
                    <Button variant="outline" className="rounded-xl h-11 w-full sm:w-auto">Batal</Button>
                  } />
                  <DialogTrigger render={
                    <Button onClick={() => toast.success('Gudang baru berhasil ditambahkan!')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 w-full sm:w-auto mt-2 sm:mt-0">Simpan Gudang</Button>
                  } />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast('Memuat detail sebaran wilayah...')}>
          <CardContent className="p-5">
            <p className="text-sm font-bold text-slate-500 mb-1">Total Gudang</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{warehouses.length || 12}</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Nasional</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast('Membuka kurva utilisasi...')}>
          <CardContent className="p-5">
            <p className="text-sm font-bold text-slate-500 mb-1">Okupansi Rata-rata</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{avgOccupancy}%</h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Optimal</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-bold text-slate-500 mb-1">Total SKU Terdaftar</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">{totalSKU.toLocaleString('id-ID')}</h3>
              <span className="text-xs font-bold text-slate-500">Item</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-bold text-slate-500 mb-1">Nilai Inventaris Total</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">Rp {(totalValue > 0 ? totalValue : 4200000000).toLocaleString('id-ID')}</h3>
              <span className="text-xs font-bold text-slate-500">Total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Locations */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Daftar Lokasi Aktif</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {dummyLocations.map((w, i) => {
            const dbW = warehouses[i]
            const name = dbW ? dbW.name : w.name
            const loc = dbW ? (dbW.location || w.loc) : w.loc
            
            return (
              <Card key={w.id} className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-300 transition-colors">
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
                          <DropdownMenuItem onClick={() => handleAction('Edit', name)}>Edit Detail</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Manajemen Kapasitas', name)}>Manajemen Kapasitas</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast.error('Hapus ditolak: Gudang masih memiliki stok aktif!')} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                            Hapus Gudang
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4 pr-10">
                    <div>
                      <h4 className="text-lg font-bold text-indigo-700">{name}</h4>
                      <div className="flex items-start text-xs font-medium text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 mt-0.5 shrink-0" />
                        <span>{loc}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`border-0 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                      w.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {w.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-slate-500">Utilitas Kapasitas</span>
                      <span className="text-slate-800">{w.util}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${w.util > 90 ? 'bg-amber-600' : 'bg-indigo-600'}`}
                        style={{ width: `${w.util}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jumlah SKU</p>
                      <p className="text-sm font-bold text-slate-800">{w.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Nilai</p>
                      <p className="text-sm font-bold text-slate-800">Rp {w.val}</p>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                  <Button onClick={() => handleAction('Membuka laporan detail untuk', name)} variant="outline" className="w-full bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 font-semibold rounded-xl">
                    Lihat Detail Gudang
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Bottom Layout: Map and Activity */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Distribusi Gudang Nasional</h3>
          <p className="text-xs font-medium text-slate-500 mb-4">Visualisasi jangkauan operasional di seluruh wilayah Indonesia.</p>
          <div className="bg-slate-100 rounded-3xl h-[300px] w-full flex items-center justify-center border border-slate-200 overflow-hidden relative" onClick={() => toast('Memuat integrasi Google Maps...')}>
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-slate-400/20 mix-blend-multiply flex items-center justify-center cursor-crosshair">
               <span className="text-slate-500 font-bold uppercase tracking-widest text-sm">[Peta Wilayah Indonesia Interaktif]</span>
            </div>
            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-slate-200">
                <button onClick={(e) => { e.stopPropagation(); toast('Zoom In') }} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold border-b border-slate-100">+</button>
                <button onClick={(e) => { e.stopPropagation(); toast('Zoom Out') }} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold border-b border-slate-100">-</button>
                <button onClick={(e) => { e.stopPropagation(); toast('Center Location') }} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"><Activity className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Log Aktivitas Terbaru</h3>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-5 text-xs font-bold text-slate-600">Waktu</th>
                    <th className="py-3 px-5 text-xs font-bold text-slate-600">Gudang</th>
                    <th className="py-3 px-5 text-xs font-bold text-slate-600">Aktivitas</th>
                    <th className="py-3 px-5 text-xs font-bold text-slate-600">SKU</th>
                    <th className="py-3 px-5 text-xs font-bold text-slate-600 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => toast('Detail transaksi JKT-01 dibuka')}>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">14:20 WIB</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">JKT-01 Cakung</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-800">Penerimaan Barang</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">Logitech MX Master 3S</td>
                    <td className="py-3 px-5 text-center"><Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-0 font-bold text-[9px] uppercase">Selesai</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => toast('Detail transaksi SBY-04 dibuka')}>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">11:05 WIB</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">SBY-04 Rungkut</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-800">Pengeluaran Stok</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">Dell XPS 15 9520</td>
                    <td className="py-3 px-5 text-center"><Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-0 font-bold text-[9px] uppercase">Selesai</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => toast('Detail transaksi MED-02 dibuka')}>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">09:45 WIB</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">MED-02 Belawan</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-800">Penyesuaian Stok</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">Samsung T7 SSD 1TB</td>
                    <td className="py-3 px-5 text-center"><Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-0 font-bold text-[9px] uppercase">Tertunda</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
