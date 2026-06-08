import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminActionButtons } from './action-buttons'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  
  if (profile?.role !== 'OWNER') {
    redirect('/dashboard') // Only owners can access this
  }

  const companyId = profile?.company_id

  let users: any[] = []
  if (companyId) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, status, created_at')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      
    if (data) users = data
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
        <p className="text-muted-foreground mt-1">Kelola akses dan persetujuan akun staf Anda.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun</CardTitle>
          <CardDescription>Semua pengguna yang terdaftar di perusahaan Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={u.status === 'active' ? 'default' : u.status === 'pending' ? 'secondary' : 'destructive'}
                        className={u.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : u.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                      >
                        {u.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {u.id !== user.id && (
                        <AdminActionButtons userId={u.id} currentStatus={u.status} />
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Belum ada pengguna.
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
