'use client'

import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

export function HeaderActions({ initials, fullName, role }: { initials: string, fullName: string, role: string }) {
  return (
    <div className="flex items-center space-x-6">
      
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        } />
        <DropdownMenuContent align="end" className="w-80 rounded-xl p-2">
          <DropdownMenuLabel className="text-sm font-bold text-slate-800">Notifikasi Terbaru</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => toast.success('Mengarahkan ke detail stok...')}>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-800">Stok Menipis: iPhone 15 Pro</span>
              <span className="text-xs text-slate-500">Sisa 5 unit di Gudang Utama.</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => toast('Membuka pesanan baru...')}>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-800">Pesanan Baru Masuk</span>
              <span className="text-xs text-slate-500">PO-2023-1124 membutuhkan persetujuan Anda.</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-indigo-600 font-semibold cursor-pointer" onClick={() => toast('Membuka semua notifikasi...')}>
            Lihat Semua Notifikasi
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger render={
          <div className="flex items-center bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="text-sm font-bold text-indigo-700">{initials}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700">{fullName}</span>
              <span className="text-xs font-semibold text-indigo-600">{role}</span>
            </div>
          </div>
        } />
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toast('Membuka halaman profil...')}>Profil Pengguna</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast('Membuka pengaturan keamanan...')}>Pengaturan Keamanan</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}
