'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getCompanyId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  if (!profile?.company_id) throw new Error('No company found')
  
  return { supabase, companyId: profile.company_id, userId: user.id }
}

export async function processStockIn(formData: FormData) {
  const { supabase, companyId, userId } = await getCompanyId()
  
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

  // The database trigger will automatically update the product's current_stock
  const { error } = await supabase.from('stock_transactions').insert([{
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
    // before_stock and after_stock are populated by DB trigger
  }])

  if (error) {
    console.error('Stock In Error:', error)
    return { error: error.message }
  }

  revalidatePath('/inventory')
  revalidatePath('/products')
  redirect('/inventory')
}

export async function processStockOut(formData: FormData) {
  const { supabase, companyId, userId } = await getCompanyId()
  
  const productId = formData.get('product_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const warehouseId = formData.get('warehouse_id') ? formData.get('warehouse_id') as string : null
  const destination = formData.get('destination') as string
  const notes = formData.get('notes') as string

  if (!productId || isNaN(quantity) || quantity <= 0) {
    return { error: 'Data tidak valid' }
  }

  // Verify if we have enough stock before allowing stock out
  const { data: product } = await supabase.from('products').select('current_stock').eq('id', productId).single()
  if (!product || product.current_stock < quantity) {
    return { error: 'Stok tidak mencukupi untuk transaksi ini' }
  }

  const { error } = await supabase.from('stock_transactions').insert([{
    company_id: companyId,
    product_id: productId,
    warehouse_id: warehouseId,
    user_id: userId,
    destination: destination,
    type: 'OUT',
    quantity: quantity,
    notes: notes,
  }])

  if (error) {
    console.error('Stock Out Error:', error)
    return { error: error.message }
  }

  revalidatePath('/inventory')
  revalidatePath('/products')
  redirect('/inventory')
}
