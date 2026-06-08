import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { addWarehouse } from '@/app/actions/master'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'

export default async function WarehousesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let warehouses: any[] = []
  if (companyId) {
    const { data } = await supabase.from('warehouses').select('*').eq('company_id', companyId)
    warehouses = data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/master" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Daftar Gudang</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola lokasi penyimpanan Anda.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!isViewer && (
          <Card className="rounded-3xl border-0 shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Tambah Gudang</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addWarehouse as any} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wh_name">Nama Gudang</Label>
                  <Input id="wh_name" name="name" placeholder="Contoh: Gudang Utama" required className="rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wh_loc">Lokasi</Label>
                  <Input id="wh_loc" name="location" placeholder="Alamat lengkap" className="rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <SubmitButton className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white">Simpan</SubmitButton>
              </form>
            </CardContent>
          </Card>
        )}
        
        <Card className="rounded-3xl border-0 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Daftar Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {warehouses.map((w) => (
                <li key={w.id} className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 dark:text-white block">{w.name}</span>
                    <span className="text-xs font-semibold text-slate-500">{w.location || 'Tidak ada lokasi spesifik'}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                </li>
              ))}
              {warehouses.length === 0 && <p className="text-sm text-slate-400 font-medium text-center py-4">Belum ada data.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
