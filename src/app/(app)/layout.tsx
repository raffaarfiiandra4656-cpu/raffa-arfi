import { ReactNode } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, LayoutDashboard, ArchiveRestore, Settings, Users, LogOut, FileText, Bell, MoreHorizontal, ArrowDownRight, ArrowUpRight, Truck, Building2, BarChart3 } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { HeaderActions } from '@/components/header-actions'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to get role and status
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status, company_id, full_name')
    .eq('id', user.id)
    .single()

  // Auto-upgrade raffaarfiiandra@gmail.com to OWNER if they aren't already
  if (user.email === 'raffaarfiiandra@gmail.com' && profile?.role !== 'OWNER') {
    await supabase.from('profiles').update({ role: 'OWNER', status: 'active' }).eq('id', user.id)
    if (profile) {
      profile.role = 'OWNER'
      profile.status = 'active'
    }
  }

  if (profile?.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-2 text-indigo-900">Menunggu Persetujuan</h1>
          <p className="text-slate-500 mb-6">Akun Anda sedang menunggu persetujuan dari Owner.</p>
          <form action={logout as any}>
            <Button variant="outline" className="rounded-full w-full">Keluar</Button>
          </form>
        </div>
      </div>
    )
  }

  if (profile?.status === 'suspended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl border border-red-100">
          <h1 className="text-2xl font-bold mb-2 text-red-600">Akun Ditangguhkan</h1>
          <p className="text-slate-500 mb-6">Hubungi Administrator Anda.</p>
          <form action={logout as any}>
            <Button variant="outline" className="rounded-full w-full">Keluar</Button>
          </form>
        </div>
      </div>
    )
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Stock In', href: '/inventory/in', icon: ArrowDownRight },
    { name: 'Stock Out', href: '/inventory/out', icon: ArrowUpRight },
    { name: 'Inventory', href: '/inventory', icon: ArchiveRestore },
    { name: 'Suppliers', href: '/suppliers', icon: Truck },
    { name: 'Warehouses', href: '/master/warehouses', icon: Building2 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-900 font-sans">
      
      {/* Desktop Sidebar (Sleek & Floating) */}
      <aside className="hidden md:flex flex-col w-72 bg-transparent p-4 h-screen fixed">
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-xl border border-slate-100 dark:border-zinc-800 flex flex-col h-full overflow-hidden">
          <div className="h-20 flex items-center px-8 border-b border-slate-50 dark:border-zinc-800/50">
            <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-200 dark:shadow-none">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">StockFlow</span>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link prefetch={true} key={item.name} href={item.href} className="flex items-center px-4 py-3 text-sm font-semibold rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors">
                <item.icon className="h-5 w-5 mr-4" />
                {item.name}
              </Link>
            ))}

            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Master & Admin</p>
            </div>
            
            <Link prefetch={true} href="/master" className="flex items-center px-4 py-3 text-sm font-semibold rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Settings className="h-5 w-5 mr-4" />
              Master Data
            </Link>

            {profile?.role === 'OWNER' && (
              <>
                <Link prefetch={true} href="/admin/users" className="flex items-center px-4 py-3 text-sm font-semibold rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Users className="h-5 w-5 mr-4" />
                  Tim & Peran
                </Link>
                <Link prefetch={true} href="/admin/company-settings" className="flex items-center px-4 py-3 text-sm font-semibold rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Settings className="h-5 w-5 mr-4" />
                  Pengaturan
                </Link>
              </>
            )}
          </nav>

          <div className="p-4">
            <form action={logout as any}>
              <button type="submit" className="flex w-full items-center px-4 py-3 text-sm font-semibold rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="h-5 w-5 mr-4" />
                Keluar Akun
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen md:pl-72 pb-20 md:pb-0">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-zinc-900 sticky top-0 z-10">
           <div className="flex items-center">
              <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-md shadow-indigo-200">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">StockFlow</span>
           </div>
           <div className="flex items-center space-x-3">
              <button className="p-2 bg-white rounded-full shadow-sm">
                <Bell className="h-5 w-5 text-slate-400" />
              </button>
              <div className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <span className="text-sm font-bold text-indigo-700">{profile?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
           </div>
        </header>

        {/* Desktop Header (Hidden on Mobile) */}
        <header className="hidden md:flex h-20 items-center justify-end px-10 bg-transparent">
           <HeaderActions 
             initials={profile?.full_name?.charAt(0).toUpperCase() || 'U'}
             fullName={profile?.full_name || 'User'}
             role={profile?.role || 'VIEWER'}
           />
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto px-4 md:px-10 pb-8 pt-2 md:pt-0 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link prefetch={true} key={item.name} href={item.href} className="flex flex-col items-center justify-center w-full h-full space-y-1">
              <item.icon className="h-6 w-6 text-slate-400 hover:text-indigo-600" />
              <span className="text-[10px] font-semibold text-slate-500">{item.name}</span>
            </Link>
          ))}
          <Link prefetch={true} href="/master" className="flex flex-col items-center justify-center w-full h-full space-y-1">
            <MoreHorizontal className="h-6 w-6 text-slate-400 hover:text-indigo-600" />
            <span className="text-[10px] font-semibold text-slate-500">More</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
