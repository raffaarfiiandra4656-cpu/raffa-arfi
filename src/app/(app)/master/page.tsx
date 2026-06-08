import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { ChevronRight, PackageOpen, Layers, MapPin, Users, Settings, Shield, LogOut, Bell, HelpCircle, UserPlus } from 'lucide-react'

export default async function MasterDataPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id, role, full_name, email').eq('id', user.id).single()
  const companyId = profile?.company_id
  const isOwner = profile?.role === 'OWNER'

  const masterMenu = [
    { title: 'Kategori Produk', icon: Layers, href: '/master/categories', desc: 'Kelola kategori barang', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Unit Pengukuran', icon: PackageOpen, href: '/master/units', desc: 'Kelola satuan (kg, pcs, dll)', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Daftar Gudang', icon: MapPin, href: '/master/warehouses', desc: 'Kelola lokasi penyimpanan', color: 'text-rose-600', bg: 'bg-rose-100' },
  ]

  const adminMenu = [
    { title: 'Persetujuan Pendaftar', icon: UserPlus, href: '/admin/approvals', desc: 'Tinjau akun baru', color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Pengguna & Tim', icon: Users, href: '/admin/users', desc: 'Kelola akses dan peran', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pengaturan Perusahaan', icon: Settings, href: '/admin/company-settings', desc: 'Profil dan preferensi bisnis', color: 'text-slate-600', bg: 'bg-slate-100' },
    { title: 'Keamanan', icon: Shield, href: '#', desc: 'Ubah kata sandi dan 2FA', color: 'text-red-600', bg: 'bg-red-100' },
  ]

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24 md:pb-6">
      
      {/* Profile Card */}
      <div className="pt-4">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4 hidden md:block">Pengaturan & Profil</h2>
        
        <Card className="rounded-3xl border-0 shadow-lg shadow-indigo-100/50 dark:shadow-none dark:bg-zinc-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 border-4 border-white shadow-sm flex items-center justify-center relative z-10 shrink-0">
                <span className="text-3xl font-bold text-indigo-700">{profile?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate">{profile?.full_name || 'User'}</h3>
                <p className="text-sm font-medium text-slate-500 truncate">{user.email}</p>
                <div className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                  {profile?.role}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Master Data Settings */}
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Master Data</h4>
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
          {masterMenu.map((item, i) => (
            <Link key={i} href={item.href} className={`flex items-center p-4 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors ${i !== masterMenu.length - 1 ? 'border-b border-slate-50 dark:border-zinc-800/50' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl ${item.bg} dark:bg-opacity-20 flex items-center justify-center shrink-0 mr-4`}>
                <item.icon className={`w-5 h-5 ${item.color} dark:text-opacity-80`} />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-slate-800 dark:text-white">{item.title}</h5>
                <p className="text-xs font-semibold text-slate-400">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Settings (Only for Owner) */}
      {isOwner && (
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Administrator</h4>
          <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
            {adminMenu.map((item, i) => (
              <Link key={i} href={item.href} className={`flex items-center p-4 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors ${i !== adminMenu.length - 1 ? 'border-b border-slate-50 dark:border-zinc-800/50' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl ${item.bg} dark:bg-opacity-20 flex items-center justify-center shrink-0 mr-4`}>
                  <item.icon className={`w-5 h-5 ${item.color} dark:text-opacity-80`} />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 dark:text-white">{item.title}</h5>
                  <p className="text-xs font-semibold text-slate-400">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* General & Logout */}
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Aplikasi</h4>
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
          <Link href="#" className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors border-b border-slate-50 dark:border-zinc-800/50">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mr-4">
              <Bell className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-slate-800 dark:text-white">Notifikasi</h5>
              <p className="text-xs font-semibold text-slate-400">Atur preferensi peringatan</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </Link>
          <Link href="#" className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors border-b border-slate-50 dark:border-zinc-800/50">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mr-4">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-slate-800 dark:text-white">Pusat Bantuan</h5>
              <p className="text-xs font-semibold text-slate-400">FAQ dan kontak dukungan</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </Link>
          <form action={logout as any}>
            <button type="submit" className="w-full flex items-center p-4 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors text-left">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0 mr-4">
                <LogOut className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-rose-600">Keluar Akun</h5>
                <p className="text-xs font-semibold text-rose-400">Sesi Anda akan diakhiri</p>
              </div>
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
