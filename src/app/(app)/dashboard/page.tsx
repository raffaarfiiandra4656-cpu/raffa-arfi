import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, TrendingUp, AlertTriangle, XCircle, ArrowUpRight, ArrowDownRight, Plus, ArchiveRestore, Sparkles } from 'lucide-react'
import { DashboardChart } from './chart'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role, full_name').eq('id', user.id).single()
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

    if (aiInsights.length === 0) {
       aiInsights.push("✅ Semua stok dalam kondisi aman. Lanjutkan performa baik ini!")
    }
  }

  // Greeting based on time (Jakarta time approximation for server rendered)
  const hour = new Date().getUTCHours() + 7 // UTC+7
  let greeting = "Selamat Malam"
  if (hour >= 5 && hour < 12) greeting = "Selamat Pagi"
  else if (hour >= 12 && hour < 15) greeting = "Selamat Siang"
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore"

  return (
    <div className="space-y-6 pb-6">
      
      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {greeting}, <span className="text-indigo-600">{profile?.full_name?.split(' ')[0] || 'User'}!</span> 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Berikut ringkasan operasional gudang Anda hari ini.</p>
      </div>
      
      {/* Main Metrics (Very Rounded Cards) */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="rounded-3xl border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Stok</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{totalStock.toLocaleString('id-ID')}</div>
            <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Aman</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-zinc-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{totalProducts}</div>
            <div className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-full mt-2">
              <Package className="w-3 h-3 mr-1" />
              <span>Tersedia</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-lg shadow-amber-200/30 dark:shadow-none dark:bg-zinc-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-amber-500 tracking-tighter">{lowStockProducts}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-lg shadow-red-200/30 dark:shadow-none dark:bg-zinc-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Stok Habis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-red-500 tracking-tighter">{outOfStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions (Aksi Cepat) */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/products/new" className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl p-4 shadow-lg shadow-indigo-200 transition-transform active:scale-95">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-xs font-semibold text-center leading-tight">Tambah<br/>Produk</span>
          </Link>
          <Link href="/inventory/in" className="flex flex-col items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-3xl p-4 transition-transform active:scale-95">
            <ArrowDownRight className="w-8 h-8 mb-2" />
            <span className="text-xs font-semibold text-center leading-tight">Stok<br/>Masuk</span>
          </Link>
          <Link href="/inventory/out" className="flex flex-col items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-3xl p-4 transition-transform active:scale-95">
            <ArrowUpRight className="w-8 h-8 mb-2" />
            <span className="text-xs font-semibold text-center leading-tight">Stok<br/>Keluar</span>
          </Link>
        </div>
      </div>

      {/* AI Insights Card (Purple Gradient) */}
      <div className="mt-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles className="w-24 h-24" />
          </div>
          <h3 className="text-lg font-bold flex items-center mb-4 relative z-10">
            <Sparkles className="w-5 h-5 mr-2" />
            Wawasan AI
          </h3>
          <div className="space-y-3 relative z-10">
            {aiInsights.map((insight, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-sm font-medium border border-white/10">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart & Activity */}
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="rounded-3xl border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Pergerakan Stok</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 pb-6">
            <DashboardChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 shrink-0 ${act.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {act.type === 'IN' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {(act.products as any)?.name || 'Produk'}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div className={`text-sm font-black ${act.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {act.type === 'IN' ? '+' : '-'}{act.quantity}
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && <p className="text-sm text-center font-medium text-slate-400 py-4">Belum ada aktivitas.</p>}
            </div>
            
            <Link href="/reports" className="mt-4 flex items-center justify-center w-full py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
              Lihat Laporan Lengkap
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
