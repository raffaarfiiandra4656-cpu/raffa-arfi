import { createClient } from '@/utils/supabase/server'
import { UnitsClient } from './units-client'

export default async function UnitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let units: any[] = []
  if (companyId) {
    const { data } = await supabase.from('units').select('*').eq('company_id', companyId)
    units = data || []
  }

  return <UnitsClient units={units} isViewer={isViewer} />
}
