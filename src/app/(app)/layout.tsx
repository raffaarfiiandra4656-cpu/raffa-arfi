import { ReactNode } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, LayoutDashboard, ShoppingCart, ArchiveRestore, Settings, Users, LogOut, FileText } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

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
    .select('role, status, company_id')
    .eq('id', user.id)
    .single()

  if (profile?.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Menunggu Persetujuan</h1>
          <p className="text-gray-500 mb-6">Akun Anda sedang menunggu persetujuan dari Owner.</p>
          <form action={logout as any}>
            <Button variant="outline">Keluar</Button>
          </form>
        </div>
      </div>
    )
  }

  if (profile?.status === 'suspended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-600">Akun Ditangguhkan</h1>
          <p className="text-gray-500 mb-6">Hubungi Administrator Anda.</p>
          <form action={logout as any}>
            <Button variant="outline">Keluar</Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r dark:border-zinc-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b dark:border-zinc-800">
          <Package className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">StockFlow</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <LayoutDashboard className="h-5 w-5 mr-3 text-gray-500" />
            Dashboard
          </Link>
          <Link href="/products" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Package className="h-5 w-5 mr-3 text-gray-400" />
            Produk
          </Link>
          <Link href="/inventory" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArchiveRestore className="h-5 w-5 mr-3 text-gray-400" />
            Inventaris
          </Link>
          <Link href="/master" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Settings className="h-5 w-5 mr-3 text-gray-400" />
            Master Data
          </Link>
          <Link href="/reports" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <FileText className="h-5 w-5 mr-3 text-gray-400" />
            Laporan
          </Link>
          {profile?.role === 'OWNER' && (
            <div className="pt-4 mt-4 border-t dark:border-zinc-800">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin Panel</p>
              <Link href="/admin/users" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Users className="h-5 w-5 mr-3 text-gray-400" />
                Pengguna & Peran
              </Link>
              <Link href="/admin/invitations" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Users className="h-5 w-5 mr-3 text-gray-400" />
                Undangan Tim
              </Link>
              <Link href="/admin/activity-logs" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
                <FileText className="h-5 w-5 mr-3 text-gray-400" />
                Log Aktivitas
              </Link>
              <Link href="/admin/company-settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Settings className="h-5 w-5 mr-3 text-gray-400" />
                Pengaturan Perusahaan
              </Link>
            </div>
          )}
        </nav>
        <div className="p-4 border-t dark:border-zinc-800">
          <form action={logout as any}>
            <button type="submit" className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
              <LogOut className="h-5 w-5 mr-3" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 flex items-center justify-between px-6">
           <div className="flex items-center md:hidden">
              <span className="text-xl font-bold text-gray-900 dark:text-white">StockFlow</span>
           </div>
           <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.email}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {profile?.role}
              </span>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
