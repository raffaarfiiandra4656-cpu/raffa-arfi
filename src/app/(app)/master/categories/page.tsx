import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { addCategory } from '@/app/actions/master'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let categories: any[] = []
  if (companyId) {
    const { data } = await supabase.from('categories').select('*').eq('company_id', companyId)
    categories = data || []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/master" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Kategori Produk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola daftar kategori barang Anda.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!isViewer && (
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Tambah Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addCategory as any} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat_name">Nama Kategori</Label>
                  <Input id="cat_name" name="name" placeholder="Contoh: Makanan" required className="rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat_desc">Deskripsi</Label>
                  <Input id="cat_desc" name="description" placeholder="Kategori untuk makanan" className="rounded-xl bg-slate-50 border-slate-200" />
                </div>
                <SubmitButton className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">Simpan</SubmitButton>
              </form>
            </CardContent>
          </Card>
        )}
        
        <Card className="rounded-3xl border-0 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.id} className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex flex-col justify-center">
                  <span className="font-bold text-slate-800 dark:text-white">{c.name}</span>
                  <span className="text-xs font-semibold text-slate-500">{c.description || 'Tidak ada deskripsi'}</span>
                </li>
              ))}
              {categories.length === 0 && <p className="text-sm text-slate-400 font-medium text-center py-4">Belum ada data.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
