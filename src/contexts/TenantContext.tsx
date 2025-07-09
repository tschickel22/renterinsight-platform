import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Tenant {
  id: string
  name: string
  domain: string
  settings: {
    theme: string
    logo?: string
    primaryColor: string
    features: string[]
  }
}

interface TenantContextType {
  tenant: Tenant | null
  isLoading: boolean
  updateTenant: (updates: Partial<Tenant>) => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

// Mock tenant data
const mockTenants: Record<string, Tenant> = {
  '1': {
    id: '1',
    name: 'RV World Dealership',
    domain: 'rvworld.renterinsight.com',
    settings: {
      theme: 'light',
      logo: '/logo-rvworld.png',
      primaryColor: '#3b82f6',
      features: ['crm', 'inventory', 'finance', 'service', 'reports']
    }
  },
  '2': {
    id: '2',
    name: 'Mobile Home Solutions',
    domain: 'mhsolutions.renterinsight.com',
    settings: {
      theme: 'light',
      logo: '/logo-mhsolutions.png',
      primaryColor: '#10b981',
      features: ['crm', 'inventory', 'deals', 'agreements', 'portal']
    }
  },
  '3': {
    id: '3',
    name: 'Premier RV & MH',
    domain: 'premier.renterinsight.com',
    settings: {
      theme: 'dark',
      logo: '/logo-premier.png',
      primaryColor: '#8b5cf6',
      features: ['crm', 'inventory', 'finance', 'service', 'delivery', 'commissions', 'reports']
    }
  }
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch tenant based on user's organization
      // For demo, we'll assign tenant based on user ID
      const tenantId = user.id
      const userTenant = mockTenants[tenantId] || mockTenants['1'] // Default to first tenant
      
      setTenant(userTenant)
    } else {
      setTenant(null)
    }
    setIsLoading(false)
  }, [user])

  const updateTenant = async (updates: Partial<Tenant>): Promise<void> => {
    if (!tenant) return
    
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedTenant = { ...tenant, ...updates }
    setTenant(updatedTenant)
    
    // Update mock data
    mockTenants[tenant.id] = updatedTenant
    
    setIsLoading(false)
  }

  const value = {
    tenant,
    isLoading,
    updateTenant
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}