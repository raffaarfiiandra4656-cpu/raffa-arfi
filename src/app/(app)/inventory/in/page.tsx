import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { processStockIn } from '@/app/actions/inventory'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ArrowDownRight } from 'lucide-react'

export default async function StockInPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id

  if (profile?.role === 'VIEWER') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk melakukan barang masuk.</p>
        <Link href="/inventory" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Inventaris</Link>
      </div>
    )
  }

  let products: any[] = []
  let warehouses: any[] = []
  let suppliers: any[] = []

  if (companyId) {
    const [prods, whs, sups] = await Promise.all([
      supabase.from('products').select('id, name, sku').eq('company_id', companyId),
      supabase.from('warehouses').select('id, name').eq('company_id', companyId),
      supabase.from('suppliers').select('id, name').eq('company_id', companyId)
    ])
    products = prods.data || []
    warehouses = whs.data || []
    suppliers = sups.data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inventory" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Stok Masuk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat penambahan stok ke dalam inventaris.</p>
        </div>
      </div>
      
      <Card className="rounded-3xl border-0 shadow-lg shadow-emerald-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 dark:from-emerald-900/20 to-transparent"></div>
        <CardHeader className="relative z-10 pb-2">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-4">
             <ArrowDownRight className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Detail Barang Masuk</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Masukkan rincian stok yang diterima.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form action={processStockIn as any} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="product_id" className="text-slate-600 font-bold ml-1">Pilih Produk</Label>
              <Select name="product_id" required>
                <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50 py-6">
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {products.length > 0 ? products.map(p => (
                    <SelectItem key={p.id} value={p.id} className="rounded-xl">{p.sku} - {p.name}</SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>Tidak ada produk</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-600 font-bold ml-1">Jumlah (Kuantitas)</Label>
                <Input id="quantity" name="quantity" type="number" min="1" required placeholder="Contoh: 100" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_cost" className="text-slate-600 font-bold ml-1">Harga Satuan (Opsional)</Label>
                <Input id="unit_cost" name="unit_cost" type="number" min="0" step="0.01" placeholder="Contoh: 15000" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-2">
                <Label htmlFor="warehouse_id" className="text-slate-600 font-bold ml-1">Gudang Penyimpanan</Label>
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
              <div className="space-y-2">
                <Label htmlFor="supplier_id" className="text-slate-600 font-bold ml-1">Pemasok (Supplier)</Label>
                <Select name="supplier_id">
                  <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50 py-6">
                    <SelectValue placeholder="Pilih Pemasok" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {suppliers.length > 0 ? suppliers.map(s => (
                      <SelectItem key={s.id} value={s.id} className="rounded-xl">{s.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada pemasok</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="production_date" className="text-slate-600 font-bold ml-1">Tanggal Produksi</Label>
                <Input id="production_date" name="production_date" type="date" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration_date" className="text-slate-600 font-bold ml-1">Tanggal Kedaluwarsa</Label>
                <Input id="expiration_date" name="expiration_date" type="date" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-600 font-bold ml-1">Catatan Tambahan</Label>
              <Textarea id="notes" name="notes" placeholder="Catatan transaksi..." className="rounded-2xl border-slate-200 bg-slate-50 p-4 min-h-[100px]" />
            </div>

            {/* Mobile Sticky Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:mt-8 md:flex md:justify-end">
              <SubmitButton className="w-full md:w-auto py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all">
                Proses Stok Masuk
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
