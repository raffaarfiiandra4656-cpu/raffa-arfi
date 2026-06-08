import { createClient } from '@/utils/supabase/server'
import { SuppliersClient } from './suppliers-client'

export default async function SuppliersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let suppliers: any[] = []
  if (companyId) {
    const { data } = await supabase.from('suppliers').select('*').eq('company_id', companyId)
    if (data) suppliers = data
  }

  return <SuppliersClient suppliersData={suppliers} isViewer={isViewer} />
}
