import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { UserCircle, Shield, Settings2, Building, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Default values for mockup if profile is empty
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Adi'
  const lastName = profile?.full_name ? profile.full_name.split(' ').slice(1).join(' ') : 'Perkasa'
  const roleTitle = profile?.role === 'OWNER' ? 'Chief of Operations / Owner' : 'Administrator'

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl">
      
      {/* Header */}
      <div className="pb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Pengaturan Sistem</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Kelola konfigurasi akun, preferensi aplikasi, dan informasi bisnis Anda di satu tempat.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Inner Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm transition-colors">
            <UserCircle className="w-5 h-5" />
            Profil Pengguna
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors">
            <Shield className="w-5 h-5 text-slate-400" />
            Keamanan
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors">
            <Settings2 className="w-5 h-5 text-slate-400" />
            Setelan Aplikasi
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors">
            <Building className="w-5 h-5 text-slate-400" />
            Info Bisnis
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-8 space-y-8">
              
              {/* Profile Avatar Section */}
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100 border-dashed">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop" 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center shadow-md shadow-indigo-200 transition-colors border-2 border-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Detail Profil</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Perbarui informasi pribadi dan avatar Anda.</p>
                </div>
              </div>

              {/* Form Section */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Depan</Label>
                    <Input 
                      id="firstName" 
                      defaultValue={firstName} 
                      className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Belakang</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={lastName} 
                      className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user.email} 
                    className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-slate-500">Jabatan</Label>
                  <Input 
                    id="role" 
                    defaultValue={roleTitle} 
                    className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                  />
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100 border-dashed">
                  <Button type="button" variant="outline" className="h-11 px-6 rounded-xl border-slate-300 text-slate-700 font-semibold hover:bg-slate-50">
                    Batalkan
                  </Button>
                  <Button type="button" className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition-all">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
