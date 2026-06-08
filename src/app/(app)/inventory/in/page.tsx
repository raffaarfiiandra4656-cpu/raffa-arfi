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
import { StockInForm } from './stock-in-form'

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
    <div className="space-y-6 pb-24 font-sans">
      <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">
        <div>
          <div className="flex items-center text-sm font-semibold text-slate-500 mb-2">
            <Link href="/inventory" className="hover:text-indigo-600 transition-colors">Inventaris</Link>
            <span className="mx-2">›</span>
            <span className="text-indigo-600 font-bold">Input Stok Masuk</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Penerimaan Stok Barang</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat barang masuk secara presisi untuk menjaga akurasi inventaris Anda.</p>
        </div>
      </div>
      
      <StockInForm products={products} warehouses={warehouses} suppliers={suppliers} />
    </div>
  )
}
