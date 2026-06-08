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
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inventory" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Stok Masuk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat penambahan stok ke dalam inventaris.</p>
        </div>
      </div>
      
      <Card className="rounded-3xl border-0 shadow-lg shadow-emerald-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 dark:from-emerald-900/20 to-transparent"></div>
        <CardHeader className="relative z-10 pb-2">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-4">
             <ArrowDownRight className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Detail Barang Masuk</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Masukkan rincian stok yang diterima.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <StockInForm products={products} warehouses={warehouses} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
