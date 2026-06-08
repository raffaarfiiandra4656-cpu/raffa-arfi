"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { processStockIn } from '@/app/actions/inventory'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, CloudUpload, ListOrdered, BarChart2, CheckCircle2, RotateCcw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StockInForm({ products, warehouses, suppliers }: { products: any[], warehouses: any[], suppliers: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(12)
  const [price, setPrice] = useState<number>(42500000)

  // Auto calculate
  const totalValue = quantity * price

  return (
    <form action={processStockIn as any}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 p-5">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-600" />
                Rincian Barang & Vendor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="product_id" className="text-xs font-bold uppercase tracking-wider text-slate-500">Cari Produk</Label>
                  {/* Note: Replacing standard Input with Select just to keep original functionality, but styled to look like search if needed */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                    <Select name="product_id" required value={selectedProduct} onValueChange={(val) => setSelectedProduct(val || '')}>
                      <SelectTrigger className="w-full pl-9 h-11 rounded-lg border-slate-200 bg-white">
                        <SelectValue placeholder="Pilih Produk..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.sku} - {p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier_id" className="text-xs font-bold uppercase tracking-wider text-slate-500">Pemasok (Supplier)</Label>
                  <Select name="supplier_id">
                    <SelectTrigger className="w-full h-11 rounded-lg border-slate-200 bg-white">
                      <SelectValue placeholder="Pilih Pemasok..." />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah (Unit)</Label>
                  <Input 
                    id="quantity" 
                    name="quantity" 
                    type="number" 
                    min="1" 
                    required 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="h-11 rounded-lg border-slate-200 bg-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Satuan</Label>
                  <Select defaultValue="pcs">
                    <SelectTrigger className="w-full h-11 rounded-lg border-slate-200 bg-white">
                      <SelectValue placeholder="Pcs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal Kedatangan</Label>
                  <Input 
                    type="date" 
                    defaultValue="2023-11-24" 
                    className="h-11 rounded-lg border-slate-200 bg-white text-slate-600" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="unit_cost" className="text-xs font-bold uppercase tracking-wider text-slate-500">Harga Satuan (Rp)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">Rp</span>
                    <Input 
                      id="unit_cost" 
                      name="unit_cost" 
                      type="number" 
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="pl-9 h-11 rounded-lg border-slate-200 bg-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-slate-500">Catatan Internal</Label>
                  <Input 
                    id="notes" 
                    name="notes" 
                    placeholder="Contoh: Pengiriman batch pertama Q4..." 
                    className="h-11 rounded-lg border-slate-200 bg-white" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 border-dashed shadow-none bg-slate-50/50">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <CloudUpload className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Unggah Invoice Digital</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">Seret dan lepas file PDF, PNG, atau JPG (Maks. 10MB)</p>
              <Button type="button" variant="outline" className="bg-white border-slate-300 text-slate-700 font-semibold rounded-lg px-6">
                Pilih File
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-slate-50/50">
            <CardHeader className="pb-4 p-5 border-b border-slate-200 border-dashed">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                Ringkasan Input
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Total Unit</span>
                <span className="text-lg font-black text-slate-800">{quantity} Unit</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-200 border-dashed pb-6">
                <span className="text-sm font-semibold text-slate-500">Nilai Inventaris</span>
                <span className="text-lg font-black text-indigo-600">Rp {totalValue.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Estimasi Proses</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> 15-20 Menit
                </span>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-sm font-medium text-slate-600 italic">
                "Pastikan nomor seri (SN) sudah sesuai dengan fisik barang sebelum konfirmasi."
              </div>

              <div className="space-y-3 pt-2">
                <SubmitButton className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Konfirmasi Stok Masuk
                </SubmitButton>
                <Button type="button" variant="outline" className="w-full h-11 rounded-lg bg-white border-slate-300 text-slate-700 font-bold hover:bg-slate-50">
                  Simpan Draft
                </Button>
              </div>

            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Aktivitas Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-4">
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-indigo-600">
                  <h4 className="text-sm font-bold text-slate-800">Penerimaan iPhone 15 Pro</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 font-mono">50 Unit • 2 Jam yang lalu</p>
                </div>
                <div className="relative pl-4 border-l-2 border-slate-300">
                  <h4 className="text-sm font-bold text-slate-800">Draft: Kabel USB-C</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 font-mono">Belum dikonfirmasi • Kemarin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  )
}
