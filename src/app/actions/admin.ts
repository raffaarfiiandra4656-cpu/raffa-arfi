'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

import { logActivity } from './logs'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  
  let currentProfile = profile;
  
  if (!currentProfile?.company_id && currentProfile?.role === 'OWNER') {
      const newCompanyId = crypto.randomUUID();
      const { error: companyError } = await supabase
        .from('companies')
        .insert([{ id: newCompanyId, name: 'Perusahaan ' + (user.email?.split('@')[0] || 'Baru') }]);
        
      if (!companyError) {
          await supabase.from('profiles').update({ company_id: newCompanyId }).eq('id', user.id);
          currentProfile.company_id = newCompanyId;
      }
  }

  if (!currentProfile || currentProfile.role !== 'OWNER') throw new Error('Unauthorized')
  
  return { supabase, companyId: currentProfile.company_id }
}

export async function approveUser(userId: string) {
  const { supabase, companyId } = await checkAdmin()
  
  const { data: userToApprove } = await supabase.from('profiles').select('company_id').eq('id', userId).single()
  if (!userToApprove || (userToApprove.company_id && userToApprove.company_id !== companyId)) {
    return { error: 'Invalid user or unauthorized' }
  }
  
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active', company_id: companyId })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  await logActivity('User Approved', 'profile', userId)
  revalidatePath('/admin/users')
  revalidatePath('/admin/approvals')
  return { success: true }
}

export async function suspendUser(userId: string) {
  const { supabase, companyId } = await checkAdmin()
  
  const { data: userToSuspend } = await supabase.from('profiles').select('company_id').eq('id', userId).single()
  if (!userToSuspend || (userToSuspend.company_id && userToSuspend.company_id !== companyId)) {
    return { error: 'Invalid user or unauthorized' }
  }
  
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'suspended', company_id: companyId })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  await logActivity('User Suspended', 'profile', userId)
  revalidatePath('/admin/users')
  revalidatePath('/admin/approvals')
  return { success: true }
}

export async function changeUserRole(userId: string, newRole: string) {
  const { supabase, companyId } = await checkAdmin()
  
  const { data: userToChange } = await supabase.from('profiles').select('company_id').eq('id', userId).single()
  if (!userToChange || (userToChange.company_id && userToChange.company_id !== companyId)) {
    return { error: 'Invalid user or unauthorized' }
  }
  
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole as any, company_id: companyId })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  await logActivity('Role Changed', 'profile', userId, { newRole })
  revalidatePath('/admin/users')
  revalidatePath('/admin/approvals')
  return { success: true }
}
