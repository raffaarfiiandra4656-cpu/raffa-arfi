import { createClient } from '@/utils/supabase/server'
import { CategoriesClient } from './categories-client'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isViewer = profile?.role === 'VIEWER'

  let categories: any[] = []
  if (companyId) {
    const { data } = await supabase.from('categories').select('*').eq('company_id', companyId)
    categories = data || []
  }

  return <CategoriesClient categories={categories} isViewer={isViewer} />
}
