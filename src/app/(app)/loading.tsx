import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 pb-12 font-sans w-full h-full p-4 animate-in fade-in duration-300">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6 mb-8">
        <div className="space-y-3 w-full max-w-md">
          <Skeleton className="h-10 w-3/4 rounded-xl bg-slate-200/50" />
          <Skeleton className="h-4 w-1/2 rounded-lg bg-slate-100" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-32 rounded-xl bg-slate-100" />
          <Skeleton className="h-10 w-40 rounded-xl bg-indigo-50" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <Skeleton className="w-10 h-10 rounded-lg bg-slate-100" />
              <Skeleton className="w-16 h-5 rounded-md bg-slate-100" />
            </div>
            <Skeleton className="h-4 w-1/2 rounded-lg bg-slate-100 mt-6" />
            <Skeleton className="h-8 w-3/4 rounded-xl bg-slate-200/50" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="mt-8 rounded-2xl border border-slate-100 shadow-sm bg-white p-6 space-y-6 min-h-[400px]">
        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
          <Skeleton className="h-6 w-48 rounded-lg bg-slate-100" />
          <Skeleton className="h-8 w-24 rounded-lg bg-slate-100" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl bg-slate-50" />
          <Skeleton className="h-12 w-full rounded-xl bg-slate-50" />
          <Skeleton className="h-12 w-full rounded-xl bg-slate-50" />
          <Skeleton className="h-12 w-full rounded-xl bg-slate-50" />
        </div>
      </div>

    </div>
  )
}
