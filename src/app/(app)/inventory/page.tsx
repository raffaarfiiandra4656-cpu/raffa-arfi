import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function InventoryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

  let transactions: any[] = []
  if (companyId) {
    const { data } = await supabase
      .from('stock_transactions')
      .select(`
        id, 
        type, 
        quantity, 
        before_stock, 
        after_stock, 
        date, 
        notes,
        products (name, sku),
        profiles (full_name)
      `)
      .eq('company_id', companyId)
      .order('date', { ascending: false })
      
    if (data) transactions = data
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Riwayat Inventaris</h2>
          <p className="text-muted-foreground mt-1">Pantau semua pergerakan barang masuk dan keluar.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/in">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Barang Masuk
            </Button>
          </Link>
          <Link href="/inventory/out">
            <Button variant="destructive">
              <Minus className="mr-2 h-4 w-4" /> Barang Keluar
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Log Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Kuantitas</TableHead>
                  <TableHead className="text-right">Stok Sebelum</TableHead>
                  <TableHead className="text-right">Stok Sesudah</TableHead>
                  <TableHead>Pengguna</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(t.date), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{(t.products as any)?.name}</div>
                      <div className="text-xs text-muted-foreground">{(t.products as any)?.sku}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.type === 'IN' ? 'default' : 'destructive'} className={t.type === 'IN' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                        {t.type === 'IN' ? 'Masuk' : 'Keluar'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {t.type === 'IN' ? '+' : '-'}{t.quantity}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{t.before_stock}</TableCell>
                    <TableCell className="text-right font-bold">{t.after_stock}</TableCell>
                    <TableCell>{(t.profiles as any)?.full_name || 'Sistem'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Belum ada transaksi.
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
