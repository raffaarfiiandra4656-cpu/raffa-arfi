import { createClient } from '@/utils/supabase/server'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Default values for mockup if profile is empty
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Adi'
  const lastName = profile?.full_name ? profile.full_name.split(' ').slice(1).join(' ') : 'Perkasa'
  const roleTitle = profile?.role === 'OWNER' ? 'Chief of Operations / Owner' : 'Administrator'

  return <SettingsClient initialFirstName={firstName} initialLastName={lastName} email={user.email || ''} roleTitle={roleTitle} />
}
