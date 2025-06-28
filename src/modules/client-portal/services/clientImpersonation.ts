import { useState, useEffect } from 'react'
import { clientPortalAPI } from './clientPortalAPI'

export function useClientImpersonation() {
  const [impersonatingClientId, setImpersonatingClientId] = useState<string | null>(null)
  const [impersonatedClient, setImpersonatedClient] = useState<any | null>(null)
  
  // Check if we're currently impersonating a client
  const isImpersonating = !!impersonatingClientId
  
  // Start impersonating a client
  const startImpersonation = async (clientId: string) => {
    try {
      const client = await clientPortalAPI.getUserById(clientId)
      if (client) {
        setImpersonatingClientId(clientId)
        setImpersonatedClient(client)
        
        // In a real app, you might store this in session storage
        sessionStorage.setItem('impersonatingClientId', clientId)
        
        return client
      }
      throw new Error('Client not found')
    } catch (error) {
      console.error('Failed to start impersonation:', error)
      throw error
    }
  }
  
  // Stop impersonating
  const stopImpersonation = () => {
    setImpersonatingClientId(null)
    setImpersonatedClient(null)
    sessionStorage.removeItem('impersonatingClientId')
  }
  
  // Check for existing impersonation on mount
  useEffect(() => {
    const storedClientId = sessionStorage.getItem('impersonatingClientId')
    if (storedClientId) {
      clientPortalAPI.getUserById(storedClientId)
        .then(client => {
          if (client) {
            setImpersonatingClientId(storedClientId)
            setImpersonatedClient(client)
          }
        })
        .catch(console.error)
    }
  }, [])
  
  return {
    isImpersonating,
    impersonatingClientId,
    impersonatedClient,
    startImpersonation,
    stopImpersonation
  }
}