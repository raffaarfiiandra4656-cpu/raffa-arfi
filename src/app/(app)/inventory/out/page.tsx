import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { processStockOut } from '@/app/actions/inventory'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ArrowUpRight } from 'lucide-react'
import { StockOutForm } from './stock-out-form'

export default async function StockOutPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id

  if (profile?.role === 'VIEWER') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk melakukan barang keluar.</p>
        <Link href="/inventory" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Inventaris</Link>
      </div>
    )
  }

  let products: any[] = []
  let warehouses: any[] = []

  if (companyId) {
    const [prods, whs] = await Promise.all([
      supabase.from('products').select('id, name, sku, current_stock').eq('company_id', companyId).gt('current_stock', 0),
      supabase.from('warehouses').select('id, name').eq('company_id', companyId)
    ])
    products = prods.data || []
    warehouses = whs.data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inventory" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Stok Keluar</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat pengeluaran stok dari inventaris.</p>
        </div>
      </div>
      
      <Card className="rounded-3xl border-0 shadow-lg shadow-rose-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-50 dark:from-rose-900/20 to-transparent"></div>
        <CardHeader className="relative z-10 pb-2">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center mb-4">
             <ArrowUpRight className="w-7 h-7 text-rose-600 dark:text-rose-400" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Detail Barang Keluar</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Masukkan rincian stok yang dikeluarkan.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <StockOutForm products={products} warehouses={warehouses} />
        </CardContent>
      </Card>
    </div>
  )
}
