import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { addUnit } from '@/app/actions/master'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function UnitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let units: any[] = []
  if (companyId) {
    const { data } = await supabase.from('units').select('*').eq('company_id', companyId)
    units = data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/master" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Unit Pengukuran</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola satuan (kg, pcs, dll).</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!isViewer && (
          <Card className="rounded-3xl border-0 shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Tambah Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addUnit as any} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_name">Nama Unit</Label>
                  <Input id="unit_name" name="name" placeholder="Contoh: Kilogram" required className="rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_abbr">Singkatan</Label>
                  <Input id="unit_abbr" name="abbreviation" placeholder="Contoh: kg" required className="rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <SubmitButton className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">Simpan</SubmitButton>
              </form>
            </CardContent>
          </Card>
        )}
        
        <Card className="rounded-3xl border-0 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Daftar Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {units.map((u) => (
                <li key={u.id} className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-white">{u.name}</span>
                  <span className="text-xs font-bold font-mono bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">{u.abbreviation}</span>
                </li>
              ))}
              {units.length === 0 && <p className="text-sm text-slate-400 font-medium text-center py-4">Belum ada data.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
