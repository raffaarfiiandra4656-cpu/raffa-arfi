'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import { logActivity } from './logs'

async function getCompanyId() {
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
  if (profile.role === 'VIEWER') throw new Error('Unauthorized: Viewers cannot process stock')
  
  return { supabase, companyId: profile.company_id, userId: user.id }
}

export async function processStockIn(formData: FormData) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId, userId } = ctx
  
  const productId = formData.get('product_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const warehouseId = formData.get('warehouse_id') ? formData.get('warehouse_id') as string : null
  const supplierId = formData.get('supplier_id') ? formData.get('supplier_id') as string : null
  const unitCost = formData.get('unit_cost') ? parseFloat(formData.get('unit_cost') as string) : null
  const productionDate = formData.get('production_date') as string || null
  const expirationDate = formData.get('expiration_date') as string || null
  const notes = formData.get('notes') as string

  if (!productId || isNaN(quantity) || quantity <= 0) {
    return { error: 'Data tidak valid' }
  }

  const { data: tx, error } = await supabase.from('stock_transactions').insert([{
    company_id: companyId,
    product_id: productId,
    warehouse_id: warehouseId,
    supplier_id: supplierId,
    user_id: userId,
    type: 'IN',
    quantity: quantity,
    unit_cost: unitCost,
    production_date: productionDate,
    expiration_date: expirationDate,
    notes: notes,
  }]).select().single()

  if (error) {
    console.error('Stock In Error:', error)
    return { error: error.message }
  }

  await logActivity('Stock Added', 'stock_transaction', tx.id, { product_id: productId, quantity })

  revalidatePath('/inventory')
  revalidatePath('/products')
  redirect('/inventory')
}

export async function processStockOut(formData: FormData) {
  let ctx;
  try {
    ctx = await getCompanyId()
  } catch (err: any) {
    return { error: err.message }
  }
  const { supabase, companyId, userId } = ctx
  
  const productId = formData.get('product_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const warehouseId = formData.get('warehouse_id') ? formData.get('warehouse_id') as string : null
  const destination = formData.get('destination') as string
  const notes = formData.get('notes') as string

  if (!productId || isNaN(quantity) || quantity <= 0) {
    return { error: 'Data tidak valid' }
  }

  const { data: product } = await supabase.from('products').select('current_stock').eq('id', productId).single()
  if (!product || product.current_stock < quantity) {
    return { error: 'Stok tidak mencukupi untuk transaksi ini' }
  }

  const { data: tx, error } = await supabase.from('stock_transactions').insert([{
    company_id: companyId,
    product_id: productId,
    warehouse_id: warehouseId,
    user_id: userId,
    destination: destination,
    type: 'OUT',
    quantity: quantity,
    notes: notes,
  }]).select().single()

  if (error) {
    console.error('Stock Out Error:', error)
    return { error: error.message }
  }

  await logActivity('Stock Removed', 'stock_transaction', tx.id, { product_id: productId, quantity })

  revalidatePath('/inventory')
  revalidatePath('/products')
  redirect('/inventory')
}
