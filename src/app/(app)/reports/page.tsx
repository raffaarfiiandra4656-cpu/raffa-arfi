import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ExportCSVButton } from './export-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

  let products: any[] = []
  let exportData: any[] = []

  if (companyId) {
    const { data } = await supabase
      .from('products')
      .select(`
        sku,
        name,
        current_stock,
        status,
        categories(name),
        units(name)
      `)
      .eq('company_id', companyId)
      .order('current_stock', { ascending: false })
      
    if (data) {
      products = data
      // Flatten data for CSV
      exportData = data.map(p => ({
        SKU: p.sku,
        'Nama Produk': p.name,
        Kategori: p.categories?.name || '-',
        Unit: p.units?.name || '-',
        Stok: p.current_stock,
        Status: p.status
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Laporan & Analitik</h2>
          <p className="text-muted-foreground mt-1">Unduh laporan persediaan stok Anda.</p>
        </div>
        <ExportCSVButton data={exportData} filename="laporan_stok_stockflow" />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Stok Saat Ini</CardTitle>
          <CardDescription>Menampilkan semua produk dan jumlah stok aktif.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? products.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-xs text-muted-foreground">{p.sku}</TableCell>
                    <TableCell className="font-bold">{p.name}</TableCell>
                    <TableCell>{p.categories?.name}</TableCell>
                    <TableCell className="text-right font-bold">{p.current_stock} {p.units?.name}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Belum ada data laporan.
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
