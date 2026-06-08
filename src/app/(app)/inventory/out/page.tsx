import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { processStockOut } from '@/app/actions/inventory'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ArrowUpRight } from 'lucide-react'

export default async function StockOutPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id

  if (profile?.role === 'VIEWER') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk melakukan barang keluar.</p>
        <Link href="/inventory" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Inventaris</Link>
      </div>
    )
  }

  let products: any[] = []
  let warehouses: any[] = []

  if (companyId) {
    const [prods, whs] = await Promise.all([
      supabase.from('products').select('id, name, sku, current_stock').eq('company_id', companyId).gt('current_stock', 0),
      supabase.from('warehouses').select('id, name').eq('company_id', companyId)
    ])
    products = prods.data || []
    warehouses = whs.data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inventory" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Stok Keluar</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat pengeluaran stok dari inventaris.</p>
        </div>
      </div>
      
      <Card className="rounded-3xl border-0 shadow-lg shadow-rose-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-50 dark:from-rose-900/20 to-transparent"></div>
        <CardHeader className="relative z-10 pb-2">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center mb-4">
             <ArrowUpRight className="w-7 h-7 text-rose-600 dark:text-rose-400" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Detail Barang Keluar</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Masukkan rincian stok yang dikeluarkan.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form action={processStockOut as any} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="product_id" className="text-slate-600 font-bold ml-1">Pilih Produk</Label>
              <Select name="product_id" required>
                <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50 py-6">
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {products.length > 0 ? products.map(p => (
                    <SelectItem key={p.id} value={p.id} className="rounded-xl">{p.sku} - {p.name} (Stok: {p.current_stock})</SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>Tidak ada produk dengan stok</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-600 font-bold ml-1">Jumlah (Kuantitas)</Label>
                <Input id="quantity" name="quantity" type="number" min="1" required placeholder="Contoh: 50" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="warehouse_id" className="text-slate-600 font-bold ml-1">Gudang Asal</Label>
                <Select name="warehouse_id">
                  <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50 py-6">
                    <SelectValue placeholder="Pilih Gudang" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {warehouses.length > 0 ? warehouses.map(w => (
                      <SelectItem key={w.id} value={w.id} className="rounded-xl">{w.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada gudang</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-slate-600 font-bold ml-1">Tujuan (Opsional)</Label>
              <Input id="destination" name="destination" placeholder="Contoh: Pelanggan A, Cabang B" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-600 font-bold ml-1">Catatan Tambahan</Label>
              <Textarea id="notes" name="notes" placeholder="Catatan transaksi (misal: Barang retur, penjualan, dll)..." className="rounded-2xl border-slate-200 bg-slate-50 p-4 min-h-[100px]" />
            </div>

            {/* Mobile Sticky Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:mt-8 md:flex md:justify-end">
              <SubmitButton className="w-full md:w-auto py-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-200 transition-all">
                Proses Stok Keluar
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
