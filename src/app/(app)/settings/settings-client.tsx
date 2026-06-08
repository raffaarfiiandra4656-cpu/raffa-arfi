'use client'

import { Card, CardContent } from '@/components/ui/card'
import { UserCircle, Shield, Settings2, Building, Camera, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SettingsClient({ initialFirstName, initialLastName, email, roleTitle }: { initialFirstName: string, initialLastName: string, email: string, roleTitle: string }) {
  
  const handleSave = () => {
    toast.success('Pengaturan profil berhasil disimpan!')
  }

  const handleDeleteAccount = () => {
    toast.success('Permintaan hapus akun telah dibatalkan.')
  }

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
          <button onClick={() => toast('Menu keamanan belum tersedia di versi ini')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors">
            <Shield className="w-5 h-5 text-slate-400" />
            Keamanan
          </button>
          <button onClick={() => toast('Menu setelan aplikasi belum tersedia di versi ini')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors">
            <Settings2 className="w-5 h-5 text-slate-400" />
            Setelan Aplikasi
          </button>
          <button onClick={() => toast('Menu info bisnis belum tersedia di versi ini')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors">
            <Building className="w-5 h-5 text-slate-400" />
            Info Bisnis
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
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
                  <button onClick={() => toast('Membuka dialog pemilihan foto...')} className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center shadow-md shadow-indigo-200 transition-colors border-2 border-white">
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
                      defaultValue={initialFirstName} 
                      className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Belakang</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={initialLastName} 
                      className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={email} 
                    className="h-12 rounded-xl border-slate-200 bg-white font-medium text-slate-800" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-slate-500">Jabatan</Label>
                  <Input 
                    id="role" 
                    defaultValue={roleTitle}
                    disabled 
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-500" 
                  />
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100 border-dashed">
                  <Button type="button" onClick={() => toast('Perubahan dibatalkan')} variant="outline" className="h-11 px-6 rounded-xl border-slate-300 text-slate-700 font-semibold hover:bg-slate-50">
                    Batalkan
                  </Button>
                  <Button type="button" onClick={handleSave} className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition-all">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>

            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-red-100 shadow-sm bg-red-50/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Zona Berbahaya
                  </h3>
                  <p className="text-sm font-medium text-red-600/80 mt-1">Hapus akun secara permanen. Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                
                <Dialog>
                  <DialogTrigger render={
                    <Button variant="destructive" className="h-11 px-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-md shadow-red-200">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus Akun
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-[425px] rounded-2xl border-red-100">
                    <DialogHeader>
                      <DialogTitle className="text-red-600 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Konfirmasi Penghapusan
                      </DialogTitle>
                      <DialogDescription className="text-slate-600">
                        Apakah Anda yakin ingin menghapus akun ini secara permanen? Semua data inventaris, riwayat pemasok, dan pengaturan Anda akan hilang dan tidak dapat dipulihkan.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                      <Label htmlFor="confirm" className="text-xs font-bold text-slate-500">Ketik "HAPUS" untuk mengonfirmasi</Label>
                      <Input id="confirm" placeholder="HAPUS" className="h-11 rounded-xl focus-visible:ring-red-500" />
                    </div>
                    <DialogFooter className="pt-4">
                      <DialogTrigger render={
                        <Button type="button" variant="outline" className="rounded-xl h-11">Batal</Button>
                      } />
                      <Button onClick={handleDeleteAccount} className="rounded-xl h-11 bg-red-600 hover:bg-red-700 text-white">Ya, Hapus Akun Saya</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
