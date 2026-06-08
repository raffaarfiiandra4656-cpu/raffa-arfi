'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { revokeInvitation } from '@/app/actions/invitations'
import { toast } from 'sonner'
import { XCircle, Link as LinkIcon } from 'lucide-react'

export function RevokeButton({ id, token }: { id: string, token: string }) {
  const [loading, setLoading] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const handleRevoke = async () => {
    if (!confirm('Batalkan undangan ini?')) return
    setLoading(true)
    const result = await revokeInvitation(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Undangan dibatalkan')
    }
    setLoading(false)
  }

  const copyLink = () => {
    const link = `${baseUrl}/register?invite_token=${token}`
    navigator.clipboard.writeText(link)
    toast.success('Link undangan disalin!')
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="secondary" size="sm" onClick={copyLink}>
        <LinkIcon className="h-4 w-4 mr-2" /> Salin Link
      </Button>
      <Button variant="destructive" size="sm" onClick={handleRevoke} disabled={loading}>
        <XCircle className="h-4 w-4 mr-2" /> Batal
      </Button>
    </div>
  )
}
