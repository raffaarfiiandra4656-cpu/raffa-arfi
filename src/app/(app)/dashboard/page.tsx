import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, TrendingUp, AlertTriangle, XCircle } from 'lucide-react'
import { DashboardChart } from './chart'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

  let totalProducts = 0
  let totalStock = 0
  let lowStockProducts = 0
  let outOfStockProducts = 0
  
  let chartData: any[] = []
  let recentActivities: any[] = []
  let aiInsights: string[] = []
  
  if (companyId) {
    const { data: products } = await supabase.from('products').select('*').eq('company_id', companyId)
    if (products) {
      totalProducts = products.length
      products.forEach((p) => {
        totalStock += p.current_stock
        if (p.status === 'Low Stock') {
           lowStockProducts++
           aiInsights.push(`⚡ Stok ${p.name} menipis (Sisa: ${p.current_stock}). Segera lakukan pemesanan ulang untuk menghindari kehabisan stok.`)
        }
        if (p.status === 'Out Of Stock') {
           outOfStockProducts++
           aiInsights.push(`❌ Stok ${p.name} habis total! Ini dapat mengganggu operasional.`)
        }
        
        // Use for chart
        chartData.push({ name: p.name.substring(0, 10), total: p.current_stock })
      })
    }

    const { data: activities } = await supabase
      .from('stock_transactions')
      .select('id, type, quantity, date, products(name)')
      .eq('company_id', companyId)
      .order('date', { ascending: false })
      .limit(5)
    
    if (activities) recentActivities = activities

    const { data: expiring } = await supabase
      .from('stock_transactions')
      .select('expiration_date, quantity, products(name)')
      .eq('company_id', companyId)
      .eq('type', 'IN')
      .not('expiration_date', 'is', null)
      .gte('expiration_date', new Date().toISOString())
      .order('expiration_date', { ascending: true })
      .limit(3)
      
    if (expiring && expiring.length > 0) {
       expiring.forEach(e => {
         aiInsights.push(`⚠️ Perhatian: ${e.quantity} unit ${e.products?.name} akan kedaluwarsa pada ${new Date(e.expiration_date).toLocaleDateString('id-ID')}.`)
       })
    }

    if (aiInsights.length === 0) {
       aiInsights.push("✅ Semua stok dalam kondisi aman. Tidak ada peringatan khusus saat ini.")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Stok Rendah</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Stok Habis</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Perbandingan Stok Produk</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center">
                  <div className={`mr-4 h-2 w-2 rounded-full ${act.type === 'IN' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {act.type === 'IN' ? 'Barang Masuk' : 'Barang Keluar'} - {act.products?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {act.type === 'IN' ? '+' : '-'}{act.quantity} unit pada {new Date(act.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-indigo-600 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            AI Insights & Rekomendasi
          </CardTitle>
        </CardHeader>
        <CardContent>
           <ul className="space-y-2">
             {aiInsights.map((insight, i) => (
               <li key={i} className="text-sm bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-md text-indigo-900 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900">
                 {insight}
               </li>
             ))}
           </ul>
        </CardContent>
      </Card>
    </div>
  )
}
