import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  let profileError = null
  if (user) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
    profileError = error?.message
  }

  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    user_id: user?.id,
    user_email: user?.email,
    profile,
    profile_error: profileError,
  })
}
