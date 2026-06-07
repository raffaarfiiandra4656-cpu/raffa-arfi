'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  if (!profile?.company_id) throw new Error('No company found')

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

  const { error } = await supabase.from('products').insert([data])

  if (error) {
    console.error('Error adding product:', error)
    return { error: error.message }
  }

  revalidatePath('/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    return { error: error.message }
  }

  revalidatePath('/products')
  return { success: true }
}
