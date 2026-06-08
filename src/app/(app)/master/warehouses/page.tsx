import { createClient } from '@/utils/supabase/server'
import { WarehousesClient } from './warehouses-client'

export default async function WarehousesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let warehouses: any[] = []
  let totalSKU = 0
  let totalValue = 0

  if (companyId) {
    const { data: whs } = await supabase.from('warehouses').select('*').eq('company_id', companyId)
    if (whs) warehouses = whs
    
    const { data: products } = await supabase.from('products').select('current_stock, unit_cost').eq('company_id', companyId)
    if (products) {
      totalSKU = products.length
      totalValue = products.reduce((acc, p) => acc + (p.current_stock * (p.unit_cost || 0)), 0)
    }
  }

  return <WarehousesClient warehouses={warehouses} totalSKU={totalSKU} totalValue={totalValue} isViewer={isViewer} />
}
