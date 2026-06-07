"use client"

import { Button } from '@/components/ui/button'
import { approveUser, suspendUser } from '@/app/actions/admin'
import { useTransition } from 'react'

export function AdminActionButtons({ userId, currentStatus }: { userId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      await approveUser(userId)
    })
  }

  const handleSuspend = () => {
    startTransition(async () => {
      await suspendUser(userId)
    })
  }

  return (
    <div className="flex justify-end gap-2">
      {currentStatus !== 'active' && (
        <Button size="sm" onClick={handleApprove} disabled={isPending} className="bg-green-600 hover:bg-green-700">
          Setujui
        </Button>
      )}
      {currentStatus !== 'suspended' && (
        <Button size="sm" variant="destructive" onClick={handleSuspend} disabled={isPending}>
          Tangguhkan
        </Button>
      )}
    </div>
  )
}
