'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Info, ShoppingCart, Download } from 'lucide-react'
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

export function AnalyticsClient() {
  const dummyTableData = [
    { id: 1, name: 'MacBook Air M2', sku: 'LAP-001', stock: 12, daysLeft: 3, order: 50, vendor: 'Apple Inc.', prio: 'SANGAT TINGGI', prioColor: 'red', est: '12 Okt 2023' },
    { id: 2, name: 'iPad Pro 11"', sku: 'TAB-842', stock: 28, daysLeft: 7, order: 30, vendor: 'Apple Inc.', prio: 'MEDIUM', prioColor: 'amber', est: '15 Okt 2023' },
    { id: 3, name: 'Magic Keyboard', sku: 'ACC-899', stock: 5, daysLeft: 2, order: 100, vendor: 'Logitech', prio: 'KRITIKAL', prioColor: 'red', est: '10 Okt 2023' },
  ]

  const handleOrder = (productName: string) => {
    toast.success(`Purchase Order (PO) otomatis untuk ${productName} berhasil dibuat dan dikirim ke vendor!`)
  }

  const handleDownload = () => {
    toast.info('Menyiapkan laporan PDF...', { duration: 2000 })
    setTimeout(() => {
      toast.success('Laporan AI berhasil diunduh.')
    }, 2000)
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Banner (Critical AI Prediction) */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-200 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => toast('Membuka detail analitik prediksi kritikal')}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent skew-x-12 transform translate-x-8"></div>
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Prediksi AI Kritikal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Stok Habis Terdeteksi: SKU-9042</h2>
            <p className="text-indigo-100 font-medium text-sm md:text-base max-w-2xl">
              Permintaan melonjak 45% di wilayah Jakarta Utara. Stok saat ini diperkirakan habis dalam 72 jam ke depan tanpa restock segera.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={(e) => { e.stopPropagation(); toast.success('Membuat pesanan kilat untuk SKU-9042...') }} className="bg-white text-indigo-700 hover:bg-slate-50 font-bold px-6 h-11 rounded-xl shadow-sm">
              Pesan Sekarang
            </Button>
            <Button onClick={(e) => { e.stopPropagation(); toast('Membuka detail matriks permintaan') }} variant="outline" className="border-indigo-300 text-white hover:bg-indigo-500/50 hover:text-white bg-transparent font-bold px-6 h-11 rounded-xl">
              Lihat Detail
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: 4 Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Donut Chart Probabilitas */}
        <Card className="rounded-2xl border border-slate-200 shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast('Membuka rincian AI Model (Confidence Score)')}>
          <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">Probabilitas Stok Habis</CardTitle>
            <Info className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col justify-center items-center relative">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-600" strokeWidth="4" strokeDasharray="82, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">82%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Keyakinan AI</span>
              </div>
            </div>
            <div className="w-full border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Tren Terakhir</span>
              <span className="text-xs font-bold text-red-600">+12% vs Minggu Lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Bar Chart Kurva */}
        <Card className="rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast('Membuka histori data penawaran & permintaan')}>
          <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">Kurva Penawaran & Permintaan</CardTitle>
              <p className="text-xs font-medium text-slate-500 mt-1">Estimasi stok 14 hari kedepan</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600"></span><span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Stok</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-200"></span><span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Prediksi</span></div>
            </div>
          </CardHeader>
          <CardContent className="p-5 h-[240px] flex items-end justify-between gap-2 mt-4">
            {[60, 45, 65, 40, 50, 70, 75].map((val, i) => (
              <div key={i} className="w-full flex flex-col justify-end items-center h-full gap-1">
                <div className="w-full bg-indigo-100 rounded-t-sm" style={{ height: `${100 - val}%` }}></div>
                <div className="w-full bg-indigo-600 rounded-b-sm" style={{ height: `${val}%` }}></div>
                <span className="text-xs font-bold text-slate-500 mt-2">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 3: Donut Chart Analisis Perputaran */}
        <Card className="rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast('Membuka rincian ABC Analysis')}>
          <CardHeader className="p-5 pb-0">
            <CardTitle className="text-sm font-bold text-slate-800">Analisis Perputaran</CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className="text-indigo-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-600" strokeWidth="4" strokeDasharray="65, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-indigo-600 tracking-tighter">4.2x</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                <span>Cepat (A)</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                <span>Sedang (B)</span>
                <span className="font-bold">25%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                <span>Lambat (C)</span>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </CardContent>
          <div className="px-5 pb-5 pt-0 mt-auto text-xs font-medium italic text-slate-500">
            Target: 4.5x. Perlu optimasi pada kategori C.
          </div>
        </Card>

        {/* Card 4: Produk Performa Terbaik */}
        <Card className="rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">Produk Performa Terbaik</CardTitle>
            <span onClick={() => toast('Mengalihkan ke halaman Top Products...')} className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline">Lihat Semua</span>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Smart Watch Pro X', sold: '1,240', trend: '+18.5%' },
                { name: 'Noise Cancel Headphone', sold: '982', trend: '+12.2%' },
                { name: 'Classic Chronograph', sold: '754', trend: '+8.9%' },
                { name: 'InstaCam Neo', sold: '620', trend: '+5.4%' },
              ].map((p, i) => (
                <div key={i} onClick={() => toast(`Membuka rincian penjualan ${p.name}`)} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Terjual: {p.sold} unit</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xs font-bold text-indigo-600">{p.trend}</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-0.5">Mingguan</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <div onClick={() => toast.success('Membuat laporan performa otomatis...')} className="absolute bottom-4 right-4 w-10 h-10 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Table: Rekomendasi Restock AI */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Rekomendasi Restock AI</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Berdasarkan pola penjualan dan waktu pengiriman vendor</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button onClick={() => toast.success('5 PO otomatis sedang diproses di latar belakang')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex-1 md:flex-none">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Proses Semua
            </Button>
            <Button onClick={handleDownload} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg flex-1 md:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Ekspor PDF
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Informasi Produk</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Stok Saat Ini</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Saran Order</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Prioritas</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider">Estimasi Tiba</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-800 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyTableData.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 shrink-0"></div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{r.name}</h4>
                        <p className="text-[10px] font-mono font-medium text-slate-500 mt-0.5">{r.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-red-600">{r.stock} Unit</div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Sisa {r.daysLeft} hari</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-slate-800">{r.order} Unit</div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Penyedia: {r.vendor}</div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={`border-0 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider ${r.prioColor === 'red' ? 'bg-red-50 text-red-700 hover:bg-red-50' : 'bg-amber-50 text-amber-700 hover:bg-amber-50'}`}>
                      {r.prio}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-700">
                    {r.est}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Dialog>
                      <DialogTrigger 
                        render={
                          <Button className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold">
                            Pesan
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Pemesanan Otomatis</DialogTitle>
                          <DialogDescription>
                            Sistem AI merekomendasikan pemesanan {r.order} unit {r.name} dari vendor {r.vendor}. Anda yakin ingin membuat Draft Purchase Order?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-4">
                          <Button variant="outline" className="rounded-xl h-11">Batal</Button>
                          <Button onClick={() => handleOrder(r.name)} className="rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700">Setujui & Buat PO</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
