import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { addProduct } from '@/app/actions/products'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, PackagePlus } from 'lucide-react'

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id

  if (profile?.role === 'VIEWER') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk menambahkan produk.</p>
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Inventaris Produk</Link>
      </div>
    )
  }

  // Fetch categories, units, warehouses for dropdowns
  let categories: any[] = []
  let units: any[] = []
  let warehouses: any[] = []

  if (companyId) {
    const [cats, uns, whs] = await Promise.all([
      supabase.from('categories').select('id, name').eq('company_id', companyId),
      supabase.from('units').select('id, name').eq('company_id', companyId),
      supabase.from('warehouses').select('id, name').eq('company_id', companyId)
    ])
    categories = cats.data || []
    units = uns.data || []
    warehouses = whs.data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/products" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Tambah Produk Baru</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Masukkan informasi produk ke dalam inventaris.</p>
        </div>
      </div>
      
      <Card className="rounded-3xl border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 dark:from-indigo-900/20 to-transparent"></div>
        <CardHeader className="relative z-10 pb-2">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-4">
             <PackagePlus className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Informasi Dasar</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Detail utama dari produk Anda.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form action={addProduct as any} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-slate-600 font-bold ml-1">SKU (Kode Barang)</Label>
                <Input id="sku" name="sku" placeholder="Contoh: PRD-001" required className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-600 font-bold ml-1">Nama Produk</Label>
                <Input id="name" name="name" placeholder="Contoh: Telur Organik" required className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="category_id" className="text-slate-600 font-bold ml-1">Kategori</Label>
                <Select name="category_id">
                  <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50 py-6">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {categories.length > 0 ? categories.map(c => (
                      <SelectItem key={c.id} value={c.id} className="rounded-xl">{c.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada kategori</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 font-medium ml-1">Tambahkan di menu Master Data jika kosong.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_id" className="text-slate-600 font-bold ml-1">Unit Pengukuran</Label>
                <Select name="unit_id">
                  <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50 py-6">
                    <SelectValue placeholder="Pilih Unit" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {units.length > 0 ? units.map(u => (
                      <SelectItem key={u.id} value={u.id} className="rounded-xl">{u.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada unit</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
            </div>

            <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="current_stock" className="text-slate-600 font-bold ml-1">Stok Awal</Label>
                <Input id="current_stock" name="current_stock" type="number" min="0" defaultValue="0" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stock" className="text-slate-600 font-bold ml-1">Peringatan Stok Minimum</Label>
                <Input id="min_stock" name="min_stock" type="number" min="0" defaultValue="10" className="rounded-2xl border-slate-200 bg-slate-50 py-6" />
              </div>
            </div>

            {/* Mobile Sticky Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:mt-8 md:flex md:justify-end">
              <SubmitButton className="w-full md:w-auto py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all">
                Simpan Produk Baru
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
