import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SettingsForm } from './settings-form'

export default async function CompanySettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', user.id).single()
  if (profile?.role !== 'OWNER') {
    return <div className="p-6">Akses ditolak. Hanya OWNER yang dapat melihat halaman ini.</div>
  }

  const { data: company } = await supabase.from('companies').select('*').eq('id', profile.company_id).single()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Perusahaan</h2>
        <p className="text-muted-foreground mt-1">Ubah nama dan informasi perusahaan Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Perusahaan</CardTitle>
          <CardDescription>Detail ini digunakan di seluruh aplikasi SaaS.</CardDescription>
        </CardHeader>
        <CardContent>
           <SettingsForm initialData={company} />
        </CardContent>
      </Card>
    </div>
  )
}
