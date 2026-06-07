import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { processStockIn } from '@/app/actions/inventory'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default async function StockInPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

  let products = []
  let warehouses = []
  let suppliers = []

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Barang Masuk (Stock In)</h2>
          <p className="text-muted-foreground">Catat penambahan stok ke dalam inventaris.</p>
        </div>
        <Link href="/inventory">
          <Button variant="outline">Batal</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detail Barang Masuk</CardTitle>
          <CardDescription>Masukkan rincian stok yang diterima.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={processStockIn} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="product_id">Pilih Produk</Label>
              <Select name="product_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>
                <SelectContent>
                  {products.length > 0 ? products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.sku} - {p.name}</SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>Tidak ada produk</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah (Kuantitas)</Label>
                <Input id="quantity" name="quantity" type="number" min="1" required placeholder="Contoh: 100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_cost">Harga Satuan (Opsional)</Label>
                <Input id="unit_cost" name="unit_cost" type="number" min="0" step="0.01" placeholder="Contoh: 15000" />
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
              <div className="space-y-2">
                <Label htmlFor="supplier_id">Pemasok (Supplier)</Label>
                <Select name="supplier_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Pemasok" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.length > 0 ? suppliers.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>Tidak ada pemasok</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="production_date">Tanggal Produksi (Opsional)</Label>
                <Input id="production_date" name="production_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration_date">Tanggal Kedaluwarsa (Opsional)</Label>
                <Input id="expiration_date" name="expiration_date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea id="notes" name="notes" placeholder="Catatan transaksi..." />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Proses Stock In</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
