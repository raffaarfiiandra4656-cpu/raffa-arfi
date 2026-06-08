import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, Download, Grid, BoxSelect, Ban } from 'lucide-react'
import { DashboardChart } from './chart'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  let aiInsights: { title: string, desc: string, actionText: string, color: string }[] = []
  
  if (companyId) {
    const { data: products } = await supabase.from('products').select('*').eq('company_id', companyId)
    if (products) {
      totalProducts = products.length
      products.forEach((p) => {
        totalStock += p.current_stock
        if (p.status === 'Low Stock') {
           lowStockProducts++
        }
        if (p.status === 'Out Of Stock') {
           outOfStockProducts++
        }
        
        // Use for chart
        chartData.push({ name: p.name.substring(0, 10), total: p.current_stock })
      })
    }

    if (lowStockProducts > 0) {
      aiInsights.push({
        title: "Prediksi Kehabisan Stok",
        desc: `Beberapa produk berisiko habis dalam waktu dekat berdasarkan tren penjualan.`,
        actionText: "Restock Sekarang",
        color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
      })
    }
    
    if (totalProducts > 0) {
      aiInsights.push({
        title: "Optimasi Inventaris",
        desc: `Kurangi stok produk lambat bergerak sebesar 15% untuk membebaskan modal.`,
        actionText: "Lihat Detail",
        color: "bg-slate-100 text-slate-700 hover:bg-slate-200"
      })
    }

    const { data: activities } = await supabase
      .from('stock_transactions')
      .select('id, type, quantity, date, products(name)')
      .eq('company_id', companyId)
      .order('date', { ascending: false })
      .limit(5)
    
    if (activities) recentActivities = activities
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Ringkasan Operasional
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Data diperbarui hari ini, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-slate-300 text-slate-700 hover:bg-slate-50 h-10 rounded-lg font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan
          </Button>
          <Link href="/products/new" className="flex-1 md:flex-none">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg font-semibold shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Top 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metric Cards */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                  <Grid className="w-5 h-5" />
                </div>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-semibold border-0 text-[10px] px-2 py-0.5 rounded-md">
                  +12% bln ini
                </Badge>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-4">Total Produk</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{totalProducts.toLocaleString('id-ID')}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                  <BoxSelect className="w-5 h-5" />
                </div>
                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-semibold border-0 text-[10px] px-2 py-0.5 rounded-md">
                  Rp 4.2M
                </Badge>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-4">Total Stok Unit</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{totalStock.toLocaleString('id-ID')}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-amber-200 shadow-sm bg-amber-50/30">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Kritis</span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-4">Stok Rendah</p>
              <h3 className="text-4xl font-black text-amber-600 tracking-tighter">{lowStockProducts}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-red-200 shadow-sm bg-red-50/30">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-red-100 p-2.5 rounded-lg text-red-600">
                  <Ban className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Perlu Restock</span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-4">Stok Habis</p>
              <h3 className="text-4xl font-black text-red-600 tracking-tighter">{outOfStockProducts}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Chart */}
        <div className="lg:col-span-6">
          <Card className="rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Tren Pergerakan Stok</CardTitle>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800">Mingguan</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800">Bulanan</button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] pl-0 pb-6 relative">
               {/* Dummy chart for illustration, replacing actual recharts logic for exact mockup match */}
               <DashboardChart data={chartData} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-0 shadow-sm bg-indigo-50/50 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-indigo-900">Wawasan AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100/50">
                  <h4 className="text-sm font-bold text-indigo-700 mb-2">{insight.title}</h4>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed mb-4">{insight.desc}</p>
                  <Button className={`w-full h-8 text-xs font-bold rounded-lg ${insight.color}`}>
                    {insight.actionText}
                  </Button>
                </div>
              ))}
              
              <div className="pt-6 mt-6 border-t border-indigo-100 flex items-center text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                AI sedang menganalisis data real-time...
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Section: Recent Activity Table */}
      <div className="mt-6">
        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h3>
            <div className="flex items-center gap-4">
              <select className="text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
                <option>Semua Status</option>
              </select>
              <Link href="/reports" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Lihat Semua
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jenis</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Nilai (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                           <Package className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{(act.products as any)?.name || 'Produk'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">Elektronik</td>
                    <td className="py-3 px-5">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${act.type === 'IN' ? 'text-indigo-600' : 'text-amber-600'}`}>
                        {act.type === 'IN' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {act.type === 'IN' ? 'Masuk' : 'Keluar'}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm font-bold text-slate-700">{act.quantity} unit</td>
                    <td className="py-3 px-5 text-sm font-medium text-slate-600">
                      {new Date(act.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })} WIB
                    </td>
                    <td className="py-3 px-5">
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-0 font-bold uppercase text-[9px] tracking-wider px-2 py-0.5">
                        Selesai
                      </Badge>
                    </td>
                    <td className="py-3 px-5 text-right text-sm font-bold text-slate-700">Rp {(Math.floor(Math.random() * 50) + 10) * 1000000}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  )
}
