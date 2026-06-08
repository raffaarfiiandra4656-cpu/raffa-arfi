import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RegisterPage(props: { searchParams: Promise<{ message: string, invite_token?: string }> }) {
  const searchParams = await props.searchParams;
  const { message, invite_token } = searchParams;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>Buat akun StockFlow untuk perusahaan Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={signup}>
            {invite_token && <input type="hidden" name="invite_token" value={invite_token} />}
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {searchParams?.message && (
              <p className="text-sm text-red-500 text-center">{searchParams.message}</p>
            )}
            <Button type="submit" className="w-full">
              Daftar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Masuk di sini
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
