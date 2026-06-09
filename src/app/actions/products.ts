'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

import { logActivity } from './logs'

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()
  
  if (!profile?.company_id && profile?.role === 'OWNER') {
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: 'Perusahaan Saya' }])
        .select()
        .single();
        
      if (!companyError && newCompany) {
          await supabase.from('profiles').update({ company_id: newCompany.id }).eq('id', user.id);
          profile.company_id = newCompany.id;
      }
  }

  if (!profile?.company_id) throw new Error('No company found')
  if (profile.role === 'VIEWER') return { error: 'Unauthorized: Viewers cannot add products' }

  const data = {
    company_id: profile.company_id,
    sku: formData.get('sku') as string,
    name: formData.get('name') as string,
    category_id: formData.get('category_id') ? formData.get('category_id') as string : null,
    unit_id: formData.get('unit_id') ? formData.get('unit_id') as string : null,
    warehouse_id: formData.get('warehouse_id') ? formData.get('warehouse_id') as string : null,
    min_stock: parseInt(formData.get('min_stock') as string) || 0,
    current_stock: parseInt(formData.get('current_stock') as string) || 0,
    status: formData.get('status') as string || 'Out Of Stock',
  }

  const { data: newProd, error } = await supabase.from('products').insert([data]).select().single()

  if (error) {
    console.error('Error adding product:', error)
    return { error: error.message }
  }

  await logActivity('Product Created', 'product', newProd?.id, { name: data.name, sku: data.sku })

  revalidatePath('/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let { data: profile } = await supabase.from('profiles').select('company_id, role').eq('id', user.id).single()

  if (!profile?.company_id && profile?.role === 'OWNER') {
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: 'Perusahaan Saya' }])
        .select()
        .single();
        
      if (!companyError && newCompany) {
          await supabase.from('profiles').update({ company_id: newCompany.id }).eq('id', user.id);
          profile.company_id = newCompany.id;
      }
  }

  if (!profile?.company_id) throw new Error('No company found')
  if (profile.role === 'VIEWER') return { error: 'Unauthorized: Viewers cannot delete products' }

  // Get product info for log
  const { data: prod } = await supabase.from('products').select('name, sku').eq('id', id).single()

  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    return { error: error.message }
  }

  if (prod) {
    await logActivity('Product Deleted', 'product', id, { name: prod.name, sku: prod.sku })
  }

  revalidatePath('/products')
  return { success: true }
}
