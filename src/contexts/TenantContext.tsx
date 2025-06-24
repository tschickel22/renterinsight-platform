import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Tenant, CustomField } from '@/types'

interface TenantContextType {
  tenant: Tenant | null
  customFields: CustomField[]
  getCustomFields: (module: string, section?: string) => CustomField[]
  updateTenantSettings: (settings: Partial<Tenant['settings']>) => Promise<void>
  addCustomField: (field: Omit<CustomField, 'id'>) => Promise<void>
  updateCustomField: (id: string, field: Partial<CustomField>) => Promise<void>
  deleteCustomField: (id: string) => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  useEffect(() => {
    // Load tenant data
    const mockTenant: Tenant = {
      id: 'tenant-1',
      name: 'Demo RV Dealership',
      domain: 'demo.renterinsight.com',
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/dd/yyyy',
        businessHours: {
          monday: { open: '09:00', close: '18:00', closed: false },
          tuesday: { open: '09:00', close: '18:00', closed: false },
          wednesday: { open: '09:00', close: '18:00', closed: false },
          thursday: { open: '09:00', close: '18:00', closed: false },
          friday: { open: '09:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '17:00', closed: false },
          sunday: { open: '12:00', close: '17:00', closed: false }
        },
        features: {
          crm: true,
          inventory: true,
          quotes: true,
          agreements: true,
          service: true,
          delivery: true,
          commissions: true,
          portal: true,
          invoices: true,
          reports: true
        }
      },
      customFields: [],
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        fontFamily: 'Inter'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTenant(mockTenant)
    setCustomFields(mockTenant.customFields)
  }, [])

  const getCustomFields = (module: string, section?: string): CustomField[] => {
    return customFields.filter(field => 
      field.module === module && 
      (section ? field.section === section : true)
    )
  }

  const updateTenantSettings = async (settings: Partial<Tenant['settings']>) => {
    if (!tenant) return
    
    const updatedTenant = {
      ...tenant,
      settings: { ...tenant.settings, ...settings },
      updatedAt: new Date()
    }
    
    setTenant(updatedTenant)
  }

  const addCustomField = async (field: Omit<CustomField, 'id'>) => {
    const newField: CustomField = {
      ...field,
      id: Math.random().toString(36).substr(2, 9)
    }
    
    setCustomFields(prev => [...prev, newField])
  }

  const updateCustomField = async (id: string, field: Partial<CustomField>) => {
    setCustomFields(prev => 
      prev.map(f => f.id === id ? { ...f, ...field } : f)
    )
  }

  const deleteCustomField = async (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id))
  }

  const value = {
    tenant,
    customFields,
    getCustomFields,
    updateTenantSettings,
    addCustomField,
    updateCustomField,
    deleteCustomField
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}