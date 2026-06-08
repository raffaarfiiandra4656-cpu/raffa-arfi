"use client"

import { Button } from '@/components/ui/button'
import { approveUser, suspendUser, changeUserRole } from '@/app/actions/admin'
import { useTransition, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function AdminActionButtons({ userId, currentStatus, currentRole }: { userId: string, currentStatus: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState(currentRole)

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

  const handleRoleChange = (newRole: string | null) => {
    if (!newRole) return
    setRole(newRole)
    startTransition(async () => {
      const result = await changeUserRole(userId, newRole)
      if (result.error) toast.error(result.error)
      else toast.success('Peran diperbarui')
    })
  }

  return (
    <div className="flex justify-end gap-2 items-center">
      <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
        <SelectTrigger className="w-[110px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="OWNER">OWNER</SelectItem>
          <SelectItem value="ADMIN">ADMIN</SelectItem>
          <SelectItem value="STAFF">STAFF</SelectItem>
          <SelectItem value="VIEWER">VIEWER</SelectItem>
        </SelectContent>
      </Select>

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
