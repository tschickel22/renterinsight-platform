import React from 'react'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useClientImpersonation } from '../services/clientImpersonation'

interface ProxyClientButtonProps {
  client: {
    id: string
    name: string
  }
}

export function ProxyClientButton({ client }: ProxyClientButtonProps) {
  const { toast } = useToast()
  const { startImpersonation } = useClientImpersonation()

  const handleProxyClick = () => {
    // Open the customer portal in a new tab with impersonation
    const url = `/customer-portal?impersonateClientId=${client.id}`
    window.open(url, '_blank')
    
    toast({
      title: 'Viewing as Client',
      description: `You are now viewing the portal as ${client.name}`,
    })
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleProxyClick}
      title={`View portal as ${client.name}`}
    >
      <Eye className="h-4 w-4" />
    </Button>
  )
}