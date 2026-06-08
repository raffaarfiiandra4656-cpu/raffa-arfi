import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { addProduct } from '@/app/actions/products'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tambah Produk Baru</h2>
          <p className="text-muted-foreground">Masukkan informasi produk ke dalam inventaris.</p>
        </div>
        <Link href="/products">
          <Button variant="outline">Batal</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Detail utama dari produk Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addProduct as any} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input id="sku" name="sku" placeholder="Contoh: PRD-001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" name="name" placeholder="Contoh: Telur Organik" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori</Label>
                <Select name="category_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada kategori</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Tambahkan di menu Master Data jika kosong.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_id">Unit Pengukuran</Label>
                <Select name="unit_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.length > 0 ? units.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada unit</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="warehouse_id">Gudang Penyimpanan</Label>
                <Select name="warehouse_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Gudang" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.length > 0 ? warehouses.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada gudang</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_stock">Stok Awal</Label>
                <Input id="current_stock" name="current_stock" type="number" min="0" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stock">Peringatan Stok Minimum</Label>
                <Input id="min_stock" name="min_stock" type="number" min="0" defaultValue="10" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <SubmitButton>Simpan Produk</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
