'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

import { logActivity } from './logs'

async function getCompanyId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  
  if (!profile) {
      // Force create profile if missing
      await supabase.from('profiles').insert([{ id: user.id, full_name: user.email?.split('@')[0] || 'User', role: 'OWNER', status: 'active' }])
      profile = { role: 'OWNER', company_id: null }
  }
  
  if (!profile?.company_id && (profile?.role === 'OWNER' || profile?.role === 'ADMIN' || !profile?.role)) {
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: 'Perusahaan ' + (user.email?.split('@')[0] || 'Baru') }])
        .select()
        .single();
        
      if (!companyError && newCompany) {
          await supabase.from('profiles').update({ company_id: newCompany.id }).eq('id', user.id);
          profile.company_id = newCompany.id;
      }
  }

  if (!profile?.company_id) throw new Error('No company found')
  if (profile.role === 'VIEWER') throw new Error('Unauthorized: Viewers cannot modify master data')
  
  return { supabase, companyId: profile.company_id }
}

export async function addCategory(formData: FormData) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { data: cat, error } = await supabase.from('categories').insert([{ company_id: companyId, name, description }]).select().single()
  if (error) return { error: error.message }
  
  await logActivity('Category Created', 'category', cat.id, { name })
  revalidatePath('/master', 'layout')
  return { success: true }
}

export async function addUnit(formData: FormData) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx
  const name = formData.get('name') as string
  const abbreviation = formData.get('abbreviation') as string

  const { data: unt, error } = await supabase.from('units').insert([{ company_id: companyId, name, abbreviation }]).select().single()
  if (error) return { error: error.message }
  
  await logActivity('Unit Created', 'unit', unt.id, { name, abbreviation })
  revalidatePath('/master', 'layout')
  return { success: true }
}

export async function addWarehouse(formData: FormData) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx
  const name = formData.get('name') as string
  const location = formData.get('location') as string

  const { data: wh, error } = await supabase.from('warehouses').insert([{ company_id: companyId, name, location }]).select().single()
  if (error) return { error: error.message }
  
  await logActivity('Warehouse Created', 'warehouse', wh.id, { name })
  revalidatePath('/master', 'layout')
  return { success: true }
}

export async function addSupplier(formData: FormData) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx
  const name = formData.get('name') as string
  const company = formData.get('company') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const { data: sup, error } = await supabase.from('suppliers').insert([{ company_id: companyId, name, company, email, phone, address }]).select().single()
  if (error) return { error: error.message }
  
  await logActivity('Supplier Created', 'supplier', sup.id, { name, company })
  revalidatePath('/suppliers', 'layout')
  return { success: true }
}

export async function deleteCategory(id: string) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx

  const { error } = await supabase.from('categories').delete().eq('id', id).eq('company_id', companyId)
  if (error) return { error: error.message }
  
  await logActivity('Category Deleted', 'category', id, { id })
  revalidatePath('/master', 'layout')
  return { success: true }
}

export async function deleteUnit(id: string) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx

  const { error } = await supabase.from('units').delete().eq('id', id).eq('company_id', companyId)
  if (error) return { error: error.message }
  
  await logActivity('Unit Deleted', 'unit', id, { id })
  revalidatePath('/master', 'layout')
  return { success: true }
}

export async function deleteWarehouse(id: string) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx

  const { error } = await supabase.from('warehouses').delete().eq('id', id).eq('company_id', companyId)
  if (error) return { error: error.message }
  
  await logActivity('Warehouse Deleted', 'warehouse', id, { id })
  revalidatePath('/master', 'layout')
  return { success: true }
}

export async function deleteSupplier(id: string) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId } = ctx

  const { error } = await supabase.from('suppliers').delete().eq('id', id).eq('company_id', companyId)
  if (error) return { error: error.message }
  
  await logActivity('Supplier Deleted', 'supplier', id, { id })
  revalidatePath('/suppliers', 'layout')
  return { success: true }
}
