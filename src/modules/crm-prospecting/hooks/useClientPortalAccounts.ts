import { clientPortalAPI } from '@/modules/client-portal/services/clientPortalAPI'
import { useState, useEffect } from 'react'

export function useClientPortalAccounts(clientId?: string) {
  const [portalUsers, setPortalUsers] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Load all portal users or a specific client
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        if (clientId) {
          // Load a specific client
          const client = await clientPortalAPI.getUserById(clientId)
          setSelectedClient(client || null)
        } else {
          // Load all portal users
          const users = await clientPortalAPI.getUsers()
          setPortalUsers(users)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error loading client portal accounts:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [clientId])

  // Invite a new user to the portal
  const inviteUser = async (userData: any) => {
    setLoading(true)
    try {
      const newUser = await clientPortalAPI.inviteUser(userData)
      setPortalUsers(prev => [...prev, newUser])
      return newUser
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update a user's status
  const updateUserStatus = async (userId: string, status: string) => {
    setLoading(true)
    try {
      const updatedUser = await clientPortalAPI.updateUserStatus(userId, status)
      setPortalUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ))
      
      if (selectedClient && selectedClient.id === userId) {
        setSelectedClient({ ...selectedClient, status })
      }
      
      return updatedUser
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    portalUsers,
    client: selectedClient,
    loading,
    error,
    inviteUser,
    updateUserStatus
  }
}