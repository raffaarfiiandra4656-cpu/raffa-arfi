"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { processStockOut } from '@/app/actions/inventory'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BarcodeScanner } from '@/components/barcode-scanner'
import { useState } from 'react'

export function StockOutForm({ products, warehouses }: { products: any[], warehouses: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")

  const handleScan = (sku: string) => {
    // Find product by exact sku or barcode
    const product = products.find(p => p.sku === sku)
    if (product) {
      setSelectedProduct(product.id)
    }
  }

  return (
    <form action={processStockOut as any} className="space-y-5">
      
      <div className="space-y-2">
        <Label className="text-slate-600 font-bold ml-1">Scan Barcode (Opsional)</Label>
        <BarcodeScanner onScan={handleScan} label="Scan Barcode / SKU" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product_id" className="text-slate-600 font-bold ml-1">Pilih Produk</Label>
        <Select name="product_id" required value={selectedProduct} onValueChange={(val) => setSelectedProduct(val || '')}>
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
  )
}
