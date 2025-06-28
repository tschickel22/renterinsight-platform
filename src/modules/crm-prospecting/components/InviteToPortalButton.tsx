import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useClientPortalAccounts } from '../hooks/useClientPortalAccounts'

interface InviteToPortalButtonProps {
  lead: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export function InviteToPortalButton({ lead }: InviteToPortalButtonProps) {
  const { toast } = useToast()
  const { inviteUser } = useClientPortalAccounts()
  const [loading, setLoading] = useState(false)

  const handleInvite = async () => {
    setLoading(true)
    try {
      await inviteUser({
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        sendInviteEmail: true,
        grantAccess: {
          vehicles: true,
          service: true,
          quotes: true,
          documents: true
        }
      })
      
      toast({
        title: 'Invitation Sent',
        description: `${lead.firstName} ${lead.lastName} has been invited to the client portal`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleInvite}
      disabled={loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      ) : (
        <>
          <Globe className="h-4 w-4 mr-2" />
          Invite to Portal
        </>
      )}
    </Button>
  )
}