import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function ActivityLogsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', user.id).single()
  if (profile?.role !== 'OWNER' && profile?.role !== 'ADMIN') {
    return <div className="p-6">Akses ditolak.</div>
  }

  const { data: logs } = await supabase
    .from('activity_logs')
    .select(`
      id, action, entity_type, created_at,
      profiles (full_name, role)
    `)
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Log Aktivitas</h2>
        <p className="text-muted-foreground mt-1">Pantau semua aktivitas sistem dari pengguna perusahaan Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Aktivitas</CardTitle>
          <CardDescription>Menampilkan 100 aktivitas terakhir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Aktivitas</TableHead>
                  <TableHead>Entitas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs && logs.length > 0 ? logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{new Date(log.created_at).toLocaleString('id-ID')}</TableCell>
                    <TableCell className="font-medium">{log.profiles?.full_name || 'Sistem'}</TableCell>
                    <TableCell>
                      {log.profiles?.role && <Badge variant="outline">{log.profiles.role}</Badge>}
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="capitalize">{log.entity_type}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Belum ada aktivitas tercatat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
