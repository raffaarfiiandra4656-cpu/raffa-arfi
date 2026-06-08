import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreateInviteButton } from './create-invite'
import { RevokeButton } from './revoke-button'

export default async function InvitationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', user.id).single()
  if (profile?.role !== 'OWNER') {
    return <div className="p-6">Akses ditolak. Hanya OWNER yang dapat melihat halaman ini.</div>
  }

  const { data: invites } = await supabase
    .from('invitations')
    .select(`
      id, email, role, token, status, created_at, expires_at,
      profiles:created_by (full_name)
    `)
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false })

  // Since we are not using a full domain, generate relative URL or assume window.location.origin on client.
  // We will just pass the token to the client.

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Undangan Tim</h2>
          <p className="text-muted-foreground mt-1">Undang anggota baru ke perusahaan Anda.</p>
        </div>
        <CreateInviteButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Undangan</CardTitle>
          <CardDescription>Semua undangan yang pernah dibuat.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites && invites.length > 0 ? invites.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{inv.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'pending' ? 'default' : inv.status === 'accepted' ? 'secondary' : 'destructive'}
                        className={inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{inv.profiles?.full_name}</TableCell>
                    <TableCell>{new Date(inv.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {inv.status === 'pending' && (
                         <>
                           <RevokeButton id={inv.id} token={inv.token} />
                         </>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Belum ada undangan.
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
