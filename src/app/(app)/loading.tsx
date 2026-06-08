import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Memuat data...</p>
      </div>
    </div>
  )
}
