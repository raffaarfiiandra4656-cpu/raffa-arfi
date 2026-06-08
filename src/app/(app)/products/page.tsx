import { createClient } from '@/utils/supabase/server'
import { Plus, Search, Filter, MoreVertical, PackageOpen } from 'lucide-react'
import Link from 'next/link'

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
      .select('id, sku, name, current_stock, status, unit_cost, category:categories(name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      
    if (data) products = data
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Inventaris Produk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola katalog dan pantau stok barang real-time.</p>
        </div>
        {!isViewer && (
          <Link href="/products/new" className="hidden md:flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-semibold shadow-md shadow-indigo-200 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama produk atau SKU..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-950 border-0 rounded-2xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
          />
        </div>
        <button className="flex items-center justify-center w-12 h-12 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border-0 text-slate-600 dark:text-slate-300">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Product List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-zinc-950 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 shrink-0">
                  <PackageOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{product.name}</h3>
                  <p className="text-xs font-semibold text-slate-400">{product.sku} • {(product.category as any)?.name || 'Umum'}</p>
                </div>
              </div>
              <button className="text-slate-400 p-1">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50 dark:border-zinc-800/50">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Harga / Unit</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {product.unit_cost ? `Rp ${product.unit_cost.toLocaleString('id-ID')}` : '-'}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Stok</span>
                <div className={`px-2 py-0.5 rounded-md text-xs font-bold mt-0.5 ${
                  product.current_stock === 0 ? 'bg-red-100 text-red-600' :
                  product.current_stock < 20 ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {product.current_stock}
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-10 text-center">
            <p className="text-slate-400 font-medium text-sm">Belum ada produk yang ditambahkan.</p>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add Button */}
      {!isViewer && (
        <Link href="/products/new" className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-300 z-40 transition-transform active:scale-95">
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </div>
  )
}
