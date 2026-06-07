import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { processStockOut } from '@/app/actions/inventory'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default async function StockOutPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

  let products = []
  let warehouses = []

  if (companyId) {
    const [prods, whs] = await Promise.all([
      supabase.from('products').select('id, name, sku, current_stock').eq('company_id', companyId).gt('current_stock', 0),
      supabase.from('warehouses').select('id, name').eq('company_id', companyId)
    ])
    products = prods.data || []
    warehouses = whs.data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Barang Keluar (Stock Out)</h2>
          <p className="text-muted-foreground">Catat pengeluaran stok dari inventaris.</p>
        </div>
        <Link href="/inventory">
          <Button variant="outline">Batal</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detail Barang Keluar</CardTitle>
          <CardDescription>Masukkan rincian stok yang dikeluarkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={processStockOut} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="product_id">Pilih Produk</Label>
              <Select name="product_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>
                <SelectContent>
                  {products.length > 0 ? products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.sku} - {p.name} (Stok: {p.current_stock})</SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>Tidak ada produk dengan stok</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah (Kuantitas)</Label>
                <Input id="quantity" name="quantity" type="number" min="1" required placeholder="Contoh: 50" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="warehouse_id">Gudang Asal</Label>
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

            <div className="space-y-2">
              <Label htmlFor="destination">Tujuan (Opsional)</Label>
              <Input id="destination" name="destination" placeholder="Contoh: Pelanggan A, Cabang B" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea id="notes" name="notes" placeholder="Catatan transaksi (misal: Barang retur, penjualan, dll)..." />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="destructive">Proses Stock Out</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
