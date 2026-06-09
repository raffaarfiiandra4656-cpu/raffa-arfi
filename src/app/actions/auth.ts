'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          full_name: formData.get('full_name') as string,
          invite_token: formData.get('invite_token') as string || null,
        }
      }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
      return redirect('/register?message=' + encodeURIComponent('Gagal mendaftar: ' + error.message))
    }

    revalidatePath('/', 'layout')
    return redirect('/dashboard')
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    return redirect('/register?message=' + encodeURIComponent('Terjadi kesalahan sistem: ' + err.message))
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
