import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { addCategory, addUnit, addWarehouse } from '@/app/actions/master'

export default async function MasterDataPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()
  const companyId = profile?.company_id

  let categories = []
  let units = []
  let warehouses = []

  if (companyId) {
    const [cats, uns, whs] = await Promise.all([
      supabase.from('categories').select('*').eq('company_id', companyId),
      supabase.from('units').select('*').eq('company_id', companyId),
      supabase.from('warehouses').select('*').eq('company_id', companyId)
    ])
    categories = cats.data || []
    units = uns.data || []
    warehouses = whs.data || []
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Data</h2>
        <p className="text-muted-foreground mt-1">Kelola data referensi seperti kategori, unit, dan gudang.</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Kategori</TabsTrigger>
          <TabsTrigger value="units">Unit</TabsTrigger>
          <TabsTrigger value="warehouses">Gudang</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Kategori</CardTitle>
                <CardDescription>Buat kategori produk baru.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={addCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat_name">Nama Kategori</Label>
                    <Input id="cat_name" name="name" placeholder="Contoh: Makanan" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat_desc">Deskripsi</Label>
                    <Input id="cat_desc" name="description" placeholder="Kategori untuk semua makanan" />
                  </div>
                  <Button type="submit">Simpan</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daftar Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li key={c.id} className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-md border text-sm flex justify-between">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground">{c.description}</span>
                    </li>
                  ))}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data.</p>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Unit</CardTitle>
                <CardDescription>Buat satuan pengukuran baru.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={addUnit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit_name">Nama Unit</Label>
                    <Input id="unit_name" name="name" placeholder="Contoh: Kilogram" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit_abbr">Singkatan</Label>
                    <Input id="unit_abbr" name="abbreviation" placeholder="Contoh: kg" required />
                  </div>
                  <Button type="submit">Simpan</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daftar Unit</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {units.map((u) => (
                    <li key={u.id} className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-md border text-sm flex justify-between">
                      <span className="font-medium">{u.name}</span>
                      <span className="text-muted-foreground font-mono bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded">{u.abbreviation}</span>
                    </li>
                  ))}
                  {units.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data.</p>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Warehouses Tab */}
        <TabsContent value="warehouses" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Gudang</CardTitle>
                <CardDescription>Daftarkan lokasi penyimpanan Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={addWarehouse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wh_name">Nama Gudang</Label>
                    <Input id="wh_name" name="name" placeholder="Contoh: Gudang Utama" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wh_loc">Lokasi</Label>
                    <Input id="wh_loc" name="location" placeholder="Alamat lengkap" />
                  </div>
                  <Button type="submit">Simpan</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daftar Gudang</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {warehouses.map((w) => (
                    <li key={w.id} className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-md border text-sm flex flex-col">
                      <span className="font-medium">{w.name}</span>
                      <span className="text-muted-foreground text-xs">{w.location}</span>
                    </li>
                  ))}
                  {warehouses.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data.</p>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
