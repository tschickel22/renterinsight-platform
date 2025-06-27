import { useState, useEffect } from 'react'
import { ClientAccount, ClientAccountStatus, Lead } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useClientPortalAccounts() {
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeClientAccounts()
  }, [])

  const initializeClientAccounts = () => {
    // Load existing client accounts from localStorage or use empty array
    const savedAccounts = loadFromLocalStorage('renter-insight-client-accounts', [])
    setClientAccounts(savedAccounts)
  }

  const saveAccountsToStorage = (updatedAccounts: ClientAccount[]) => {
    saveToLocalStorage('renter-insight-client-accounts', updatedAccounts)
  }

  const generateTemporaryPassword = () => {
    // Generate a random 8-character password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const createClientAccount = async (accountData: Partial<ClientAccount>, lead?: Lead) => {
    setLoading(true)
    try {
      // Check if email already exists
      const existingAccount = clientAccounts.find(a => a.email.toLowerCase() === accountData.email?.toLowerCase())
      if (existingAccount) {
        throw new Error('An account with this email already exists')
      }

      const tempPassword = generateTemporaryPassword()
      
      const newAccount: ClientAccount = {
        id: Math.random().toString(36).substr(2, 9),
        name: accountData.name || '',
        email: accountData.email || '',
        phone: accountData.phone || '',
        password: tempPassword, // In a real app, this would be hashed
        status: ClientAccountStatus.ACTIVE,
        tenantId: accountData.tenantId || 'tenant-1', // Default tenant
        leadId: accountData.leadId || lead?.id || '',
        customFields: accountData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedAccounts = [...clientAccounts, newAccount]
      setClientAccounts(updatedAccounts)
      saveAccountsToStorage(updatedAccounts)

      return { ...newAccount, tempPassword }
    } finally {
      setLoading(false)
    }
  }

  const updateClientAccount = async (id: string, updates: Partial<ClientAccount>) => {
    const accountIndex = clientAccounts.findIndex(a => a.id === id)
    if (accountIndex === -1) {
      throw new Error('Client account not found')
    }

    const updatedAccounts = [...clientAccounts]
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      ...updates,
      updatedAt: new Date()
    }

    setClientAccounts(updatedAccounts)
    saveAccountsToStorage(updatedAccounts)
    return updatedAccounts[accountIndex]
  }

  const resetClientPassword = async (id: string) => {
    const accountIndex = clientAccounts.findIndex(a => a.id === id)
    if (accountIndex === -1) {
      throw new Error('Client account not found')
    }

    const tempPassword = generateTemporaryPassword()
    const updatedAccounts = [...clientAccounts]
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      password: tempPassword, // In a real app, this would be hashed
      updatedAt: new Date()
    }

    setClientAccounts(updatedAccounts)
    saveAccountsToStorage(updatedAccounts)
    return { account: updatedAccounts[accountIndex], tempPassword }
  }

  const updateClientStatus = async (id: string, status: ClientAccountStatus) => {
    const accountIndex = clientAccounts.findIndex(a => a.id === id)
    if (accountIndex === -1) {
      throw new Error('Client account not found')
    }

    const updatedAccounts = [...clientAccounts]
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      status,
      updatedAt: new Date()
    }

    setClientAccounts(updatedAccounts)
    saveAccountsToStorage(updatedAccounts)
    return updatedAccounts[accountIndex]
  }

  const getClientAccount = (id: string) => {
    return clientAccounts.find(a => a.id === id)
  }

  const getClientAccountByEmail = (email: string) => {
    return clientAccounts.find(a => a.email.toLowerCase() === email.toLowerCase())
  }

  const getClientAccountByLead = (leadId: string) => {
    return clientAccounts.find(a => a.leadId === leadId)
  }

  const authenticateClient = async (email: string, password: string) => {
    const account = clientAccounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    )

    if (!account) {
      throw new Error('Invalid email or password')
    }

    if (account.status !== ClientAccountStatus.ACTIVE) {
      throw new Error(`Your account is ${account.status}. Please contact support.`)
    }

    // Update last login
    const updatedAccounts = clientAccounts.map(a => 
      a.id === account.id 
        ? { ...a, lastLogin: new Date(), updatedAt: new Date() }
        : a
    )
    setClientAccounts(updatedAccounts)
    saveAccountsToStorage(updatedAccounts)

    return account
  }

  const sendInvitation = async (id: string, type: 'email' | 'sms') => {
    const account = clientAccounts.find(a => a.id === id)
    if (!account) {
      throw new Error('Client account not found')
    }

    // In a real app, this would send an actual email or SMS
    console.log(`Sending ${type} invitation to ${account.name} at ${type === 'email' ? account.email : account.phone}`)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  }

  const getAllClientAccounts = () => {
    return clientAccounts
  }

  return {
    clientAccounts,
    loading,
    createClientAccount,
    updateClientAccount,
    resetClientPassword,
    updateClientStatus,
    getClientAccount,
    getClientAccountByEmail,
    getClientAccountByLead,
    authenticateClient,
    sendInvitation,
    getAllClientAccounts
  }
}