import { createClient } from '@/utils/supabase/server'
import { Plus, Search, Filter, MoreVertical, PackageOpen, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let products: any[] = []
  if (companyId) {
    const { data } = await supabase
      .from('products')
      .select('id, sku, name, current_stock, status, unit_cost, created_at, category:categories(name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      
    if (data) products = data
  }

  // Helper to format date roughly
  const getTimeAgo = (dateStr: string) => {
     const diffHrs = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60))
     if (diffHrs < 24) return `${Math.max(1, diffHrs)} jam lalu`
     return `${Math.floor(diffHrs / 24)} hari lalu`
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Manajemen Produk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau dan kelola inventaris barang secara real-time.</p>
        </div>
        {!isViewer && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none border-slate-300 text-slate-700 hover:bg-slate-50 h-10 rounded-lg font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Ekspor CSV
            </Button>
            <Link href="/products/new" className="flex-1 md:flex-none">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari Nama Produk, SKU, atau Kode..." 
            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none min-w-[140px]">
            <option>Semua Kategori</option>
            <option>Elektronik</option>
            <option>Gaya Hidup</option>
          </select>
          <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none min-w-[140px]">
            <option>Semua Gudang</option>
          </select>
          <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none min-w-[140px]">
            <option>Semua Status</option>
          </select>
          <Button variant="outline" className="h-10 w-10 p-0 border-slate-200 text-indigo-600 rounded-lg">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Produk</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">SKU</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Kategori</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider w-48">Level Stok</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Harga (Rp)</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                // Hardcode max stock to 100 for visual effect
                const maxStock = Math.max(100, product.current_stock * 2)
                const percentage = Math.min(100, Math.round((product.current_stock / maxStock) * 100))
                
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                          <PackageOpen className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{product.name}</span>
                          <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Terakhir update: {getTimeAgo(product.created_at)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{product.sku}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="bg-slate-100 border-0 text-slate-700 font-bold px-2.5 py-1">
                        {(product.category as any)?.name || 'Umum'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                        <span>{product.current_stock} / {maxStock}</span>
                        <span className={percentage < 20 ? 'text-red-500' : 'text-indigo-600'}>{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${percentage < 20 ? 'bg-amber-500' : percentage === 0 ? 'bg-red-500' : 'bg-indigo-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-bold text-slate-800">
                        {product.unit_cost ? product.unit_cost.toLocaleString('id-ID') : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={`border-0 font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                        product.current_stock === 0 ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        product.current_stock < 20 ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' :
                        'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                      }`}>
                        {product.current_stock === 0 ? 'Habis' : product.current_stock < 20 ? 'Stok Rendah' : 'Tersedia'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">Belum ada produk yang ditambahkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Menampilkan 1 - {Math.min(10, products.length)} dari {products.length} produk</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white p-0 text-xs font-bold">1</Button>
            {products.length > 10 && (
               <>
                 <Button variant="ghost" className="w-8 h-8 rounded-lg text-slate-600 p-0 text-xs font-bold">2</Button>
                 <Button variant="ghost" className="w-8 h-8 rounded-lg text-slate-600 p-0 text-xs font-bold">3</Button>
                 <span className="text-slate-400 px-1">...</span>
               </>
            )}
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
