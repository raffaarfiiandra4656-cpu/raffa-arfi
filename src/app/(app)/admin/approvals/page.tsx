import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AdminActionButtons } from '../users/action-buttons'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, UserPlus, Clock } from 'lucide-react'

export default async function AdminApprovalsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  
  if (profile?.role !== 'OWNER') {
    redirect('/dashboard') // Only owners can access this
  }

  const companyId = profile?.company_id

  let pendingUsers: any[] = []
  if (companyId) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, status, created_at')
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      
    if (data) pendingUsers = data
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link prefetch={true} href="/master" className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Persetujuan Pendaftar</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Tinjau dan setujui pendaftar baru di tim Anda.</p>
        </div>
      </div>
      
      <Card className="rounded-3xl border-0 shadow-lg shadow-amber-200/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-100 dark:from-amber-900/20 to-transparent rounded-bl-full"></div>
        <CardHeader className="relative z-10 pb-2">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center mb-4">
             <UserPlus className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Daftar Tunggu Persetujuan</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Pengguna yang belum memiliki akses aktif.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-4">
          <div className="grid gap-4">
            {pendingUsers.length > 0 ? pendingUsers.map((u) => (
              <div key={u.id} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-600 shrink-0">
                    {u.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{u.full_name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{u.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-700">
                        {u.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-50 dark:border-zinc-800/50 mt-2 md:mt-0">
                  <AdminActionButtons userId={u.id} currentStatus={u.status} currentRole={u.role} />
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-zinc-900 rounded-3xl">
                <p className="text-sm font-medium text-slate-500">Saat ini tidak ada pendaftar baru yang menunggu persetujuan.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
