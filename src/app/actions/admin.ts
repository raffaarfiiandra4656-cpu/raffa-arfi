'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

import { logActivity } from './logs'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  if (!profile || profile.role !== 'OWNER') throw new Error('Unauthorized')
  
  return { supabase, companyId: profile.company_id }
}

export async function approveUser(userId: string) {
  const { supabase, companyId } = await checkAdmin()
  
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', userId)
    .eq('company_id', companyId)

  if (error) return { error: error.message }
  
  await logActivity('User Approved', 'profile', userId)
  revalidatePath('/admin/users')
  return { success: true }
}

export async function suspendUser(userId: string) {
  const { supabase, companyId } = await checkAdmin()
  
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'suspended' })
    .eq('id', userId)
    .eq('company_id', companyId)

  if (error) return { error: error.message }
  
  await logActivity('User Suspended', 'profile', userId)
  revalidatePath('/admin/users')
  return { success: true }
}

export async function changeUserRole(userId: string, newRole: string) {
  const { supabase, companyId } = await checkAdmin()
  
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole as any })
    .eq('id', userId)
    .eq('company_id', companyId)

  if (error) return { error: error.message }
  
  await logActivity('Role Changed', 'profile', userId, { newRole })
  revalidatePath('/admin/users')
  return { success: true }
}
