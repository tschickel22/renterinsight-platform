import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { loadFromLocalStorage } from '@/lib/utils'
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts'

interface ClientLoginProps {
  onLogin: (user: any) => void
}

export function ClientLogin({ onLogin }: ClientLoginProps) {
  const { authenticateClient } = useClientPortalAccounts()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Check if this is a preview mode from admin
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const isPreview = searchParams.get('preview') === 'true'
    const clientId = searchParams.get('clientId')
    
    if (isPreview && clientId) {
      // For preview mode, just simulate a successful login
      onLogin({
        id: clientId,
        name: 'Preview User',
        email: 'preview@example.com',
        isPreview: true
      })
    }
  }, [onLogin, location.search])