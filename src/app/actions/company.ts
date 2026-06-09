'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { logActivity } from './logs'

export async function updateCompanySettings(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Must be OWNER
  let { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', user.id).single()
  
  if (!profile) {
      // Force create profile if missing
      await supabase.from('profiles').insert([{ id: user.id, full_name: user.email?.split('@')[0] || 'User', role: 'OWNER', status: 'active' }])
      profile = { role: 'OWNER', company_id: null }
  }

  if (profile?.role !== 'OWNER') return { error: 'Unauthorized' }

  if (!profile?.company_id) {
      const newCompanyId = crypto.randomUUID();
      const { error: companyError } = await supabase
        .from('companies')
        .insert([{ id: newCompanyId, name: 'Perusahaan ' + (user.email?.split('@')[0] || 'Baru') }]);
        
      if (!companyError) {
          await supabase.from('profiles').update({ company_id: newCompanyId }).eq('id', user.id);
          profile.company_id = newCompanyId;
      } else {
          return { error: 'No company found and failed to create one: ' + companyError.message }
      }
  }

  const name = formData.get('name') as string
  const company_slug = formData.get('company_slug') as string

  if (!name || !company_slug) return { error: 'Name and slug are required' }

  const { error } = await supabase
    .from('companies')
    .update({ name, company_slug })
    .eq('id', profile.company_id)

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: 'Company slug is already taken' }
    }
    return { error: error.message }
  }

  await logActivity('Company Settings Updated', 'company', profile.company_id, { name, company_slug })

  revalidatePath('/admin/company-settings')
  return { success: true }
}
