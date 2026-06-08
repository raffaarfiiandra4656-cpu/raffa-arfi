'use server'

import { createClient } from '@/utils/supabase/server'

export async function logActivity(
  action: string,
  entity_type: string,
  entity_id?: string,
  details?: any
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return

  await supabase.from('activity_logs').insert({
    company_id: profile.company_id,
    user_id: user.id,
    action,
    entity_type,
    entity_id: entity_id || null,
    details: details || null
  })
}
