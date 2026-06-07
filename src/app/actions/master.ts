'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

async function getCompanyId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  if (!profile?.company_id) throw new Error('No company found')
  
  return { supabase, companyId: profile.company_id }
}

export async function addCategory(formData: FormData) {
  const { supabase, companyId } = await getCompanyId()
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('categories').insert([{ company_id: companyId, name, description }])
  if (error) return { error: error.message }
  
  revalidatePath('/master')
  return { success: true }
}

export async function addUnit(formData: FormData) {
  const { supabase, companyId } = await getCompanyId()
  const name = formData.get('name') as string
  const abbreviation = formData.get('abbreviation') as string

  const { error } = await supabase.from('units').insert([{ company_id: companyId, name, abbreviation }])
  if (error) return { error: error.message }
  
  revalidatePath('/master')
  return { success: true }
}

export async function addWarehouse(formData: FormData) {
  const { supabase, companyId } = await getCompanyId()
  const name = formData.get('name') as string
  const location = formData.get('location') as string

  const { error } = await supabase.from('warehouses').insert([{ company_id: companyId, name, location }])
  if (error) return { error: error.message }
  
  revalidatePath('/master')
  return { success: true }
}
