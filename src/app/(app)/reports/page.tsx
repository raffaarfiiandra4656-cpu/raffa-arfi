import { createClient } from '@/utils/supabase/server'
import { ReportsClient } from './reports-client'

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

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
      // Flatten data for CSV
      exportData = data.map(p => ({
        SKU: p.sku,
        'Nama Produk': p.name,
        Kategori: (p.categories as any)?.name || '-',
        Unit: (p.units as any)?.name || '-',
        Stok: p.current_stock,
        Status: p.status
      }))
    }
  }

  return <ReportsClient exportData={exportData} />
}
