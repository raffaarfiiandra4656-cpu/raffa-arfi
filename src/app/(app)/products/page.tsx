import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from './data-table'
import { columns } from './columns'
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
      .select('id, sku, name, current_stock, status, category:categories(name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      
    if (data) products = data
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventaris Produk</h2>
          <p className="text-muted-foreground mt-1">Kelola katalog dan pantau stok barang secara real-time.</p>
        </div>
        {!isViewer && (
          <Link href="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Produk
            </Button>
          </Link>
        )}
      </div>
      
      <DataTable columns={columns} data={products} />
    </div>
  )
}
