'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

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
  
  // Update status to active
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', userId)
    .eq('company_id', companyId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function suspendUser(userId: string) {
  const { supabase, companyId } = await checkAdmin()
  
  // Update status to suspended
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'suspended' })
    .eq('id', userId)
    .eq('company_id', companyId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}
