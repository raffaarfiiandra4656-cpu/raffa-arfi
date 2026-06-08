'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Calendar, Filter, FileSpreadsheet, ArrowDownRight, ArrowUpRight, ArchiveRestore, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ReportsClient({ exportData }: { exportData: any[] }) {
  const [reportType, setReportType] = useState('stok')

  const handleDownload = () => {
    toast.info('Menyiapkan laporan, mohon tunggu...', { duration: 2000 })
    setTimeout(() => {
      toast.success('Laporan berhasil diunduh dalam format terpilih!')
    }, 2000)
  }

  const handleExportCSV = () => {
    if (!exportData || exportData.length === 0) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }
    
    try {
      const headers = Object.keys(exportData[0])
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const val = row[header]
            return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
          }).join(',')
        )
      ].join('\\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `laporan_stok_stockflow.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Berhasil mengekspor data ke CSV')
    } catch (error) {
      console.error(error)
      toast.error('Gagal mengekspor data')
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Pusat Laporan</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Hasilkan laporan komprehensif untuk audit dan analisis bisnis Anda.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCSV} variant="outline" className="h-11 px-5 rounded-xl border-slate-300 text-slate-700 font-bold bg-white hover:bg-slate-50 shadow-sm">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
            Ekspor Stok CSV
          </Button>
          
          <Dialog>
            <DialogTrigger render={
              <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200">
                <Download className="w-4 h-4 mr-2" />
                Unduh Kustom
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Unduh Laporan Kustom</DialogTitle>
                <DialogDescription>
                  Pilih parameter laporan yang ingin Anda hasilkan hari ini.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">Tipe Laporan</Label>
                  <Select value={reportType} onValueChange={(val) => setReportType(val || 'stok')}>
                    <SelectTrigger className="w-full h-11 rounded-xl">
                      <SelectValue placeholder="Pilih Tipe Laporan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="stok">Laporan Sisa Stok Aktif</SelectItem>
                      <SelectItem value="masuk">Laporan Barang Masuk (In)</SelectItem>
                      <SelectItem value="keluar">Laporan Barang Keluar (Out)</SelectItem>
                      <SelectItem value="audit">Laporan Audit Inventaris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Dari Tanggal</Label>
                    <Input type="date" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Sampai Tanggal</Label>
                    <Input type="date" className="h-11 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">Format Laporan</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="format" className="peer sr-only" defaultChecked />
                      <div className="rounded-xl border-2 border-slate-200 p-4 text-center peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-slate-50 transition-colors">
                        <span className="font-bold text-sm text-slate-700 peer-checked:text-indigo-700">PDF Document</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="format" className="peer sr-only" />
                      <div className="rounded-xl border-2 border-slate-200 p-4 text-center peer-checked:border-green-600 peer-checked:bg-green-50 hover:bg-slate-50 transition-colors">
                        <span className="font-bold text-sm text-slate-700 peer-checked:text-green-700">Excel / CSV</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogTrigger render={
                  <Button variant="outline" className="rounded-xl h-11 w-full sm:w-auto">Batal</Button>
                } />
                <DialogTrigger render={
                  <Button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 w-full sm:w-auto mt-2 sm:mt-0">Hasilkan Laporan</Button>
                } />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Card className="rounded-2xl border-0 shadow-md bg-gradient-to-br from-indigo-500 to-indigo-700 relative overflow-hidden group cursor-pointer" onClick={() => toast('Membuka penampil Laporan Stok...')}>
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <CardContent className="p-6 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              <ArchiveRestore className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Laporan Stok Total</h3>
            <p className="text-indigo-100 text-sm mb-6">Ringkasan seluruh nilai inventaris, sisa stok, dan status produk secara komprehensif.</p>
            <div className="flex items-center text-white text-sm font-bold uppercase tracking-wider">
              Lihat Detail <ArrowUpRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow group cursor-pointer" onClick={() => toast('Membuka riwayat Barang Masuk...')}>
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Penerimaan Barang</h3>
            <p className="text-slate-500 text-sm mb-6">Riwayat lengkap barang masuk dari pemasok, termasuk nomor invoice dan staf yang bertugas.</p>
            <div className="flex items-center text-indigo-600 text-sm font-bold uppercase tracking-wider">
              Lihat Detail <ArrowUpRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow group cursor-pointer" onClick={() => toast('Membuka riwayat Barang Keluar...')}>
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Pengeluaran Barang</h3>
            <p className="text-slate-500 text-sm mb-6">Laporan barang yang telah keluar, mencakup mutasi, retur, atau penjualan ke klien akhir.</p>
            <div className="flex items-center text-indigo-600 text-sm font-bold uppercase tracking-wider">
              Lihat Detail <ArrowUpRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Latest Report Generation Logs */}
      <Card className="rounded-2xl border border-slate-200 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Riwayat Pembuatan Laporan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {[
              { type: 'Laporan Stok Total (Q3)', date: 'Hari ini, 09:41', format: 'PDF', status: 'Selesai' },
              { type: 'Penerimaan Barang (Okt)', date: 'Kemarin, 14:20', format: 'CSV', status: 'Selesai' },
              { type: 'Audit Penyesuaian Tahunan', date: '12 Okt 2023, 10:15', format: 'PDF', status: 'Selesai' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {log.format === 'PDF' ? <FileText className="w-5 h-5 text-red-500" /> : <FileSpreadsheet className="w-5 h-5 text-green-500" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{log.type}</h4>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {log.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.status}
                  </span>
                  <Button variant="ghost" className="h-8 px-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    Unduh Ulang
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
