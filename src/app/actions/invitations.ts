'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { logActivity } from './logs'

export async function createInvitation(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Must be OWNER
  const { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', user.id).single()
  if (profile?.role !== 'OWNER') return { error: 'Unauthorized' }

  const email = formData.get('email') as string
  const role = formData.get('role') as string

  if (!email || !role) return { error: 'Email and role are required' }

  const { data: invite, error } = await supabase
    .from('invitations')
    .insert({
      company_id: profile.company_id,
      email,
      role,
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logActivity('Invitation Created', 'invitation', invite.id, { email, role })

  revalidatePath('/admin/invitations')
  return { success: true }
}

export async function revokeInvitation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Must be OWNER
  const { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', user.id).single()
  if (profile?.role !== 'OWNER') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('id', id)
    .eq('company_id', profile.company_id)

  if (error) {
    return { error: error.message }
  }

  await logActivity('Invitation Revoked', 'invitation', id)

  revalidatePath('/admin/invitations')
  return { success: true }
}
