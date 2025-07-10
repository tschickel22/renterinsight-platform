import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

// Default settings that will be used if no settings are found in localStorage
const defaultSettings = {
  general: {
    platformName: 'Renter Insight',
    maintenanceMode: false,
    defaultUserRole: 'user',
    defaultTenantFeatures: {
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
  email: {
    defaultProvider: 'platform',
    fromEmail: 'noreply@renterinsight.com',
    fromName: 'Renter Insight',
    maxEmailsPerDay: 10000,
    requireEmailVerification: false,
    emailTemplatesEnabled: true
  },
  sms: {
    defaultProvider: 'platform',
    maxSmsPerDay: 5000,
    smsTemplatesEnabled: true,
    defaultCountryCode: '+1'
  },
  payment: {
    providers: ['stripe', 'zego'],
    defaultProvider: 'zego',
    testMode: true,
    autoCapture: true,
    allowPartialPayments: true,
    minimumPaymentAmount: 1.00
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    twoFactorAuthEnabled: false,
    twoFactorAuthRequired: false
  },
  api: {
    enabled: true,
    rateLimitPerMinute: 60,
    maxRequestSize: '10mb',
    corsEnabled: true,
    allowedDomains: ['*'],
    apiKeyExpiryDays: 365
  },
  database: {
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    maxStorageGB: 50,
    autoVacuum: true,
    logLevel: 'error'
  },
  notifications: {
    adminEmailAlerts: true,
    systemNotifications: true,
    errorReporting: true,
    usageAlerts: true,
    usageAlertThreshold: 80
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = loadFromLocalStorage('platform-admin-settings', null)
      
      if (savedSettings) {
        // Merge saved settings with default settings to ensure all properties exist
        setSettings(mergeSettings(defaultSettings, savedSettings))
      } else {
        // If no settings found, use defaults and save them
        saveToLocalStorage('platform-admin-settings', defaultSettings)
      }
      
      setIsLoading(false)
    }
    
    loadSettings()
  }, [])

  // Save settings to localStorage
  const saveSettings = async (newSettings: any) => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Merge with defaults to ensure all properties exist
      const mergedSettings = mergeSettings(defaultSettings, newSettings)
      
      // Save to localStorage
      saveToLocalStorage('platform-admin-settings', mergedSettings)
      
      // Update state
      setSettings(mergedSettings)
      
      return true
    } catch (error) {
      console.error('Error saving settings:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    settings,
    saveSettings,
    isLoading
  }
}

// Helper function to merge settings objects
export function mergeSettings(defaultObj: any, savedObj: any): any {
  const result = { ...defaultObj }
  
  // If savedObj is null or undefined, return defaultObj
  if (!savedObj) return result
  
  // Iterate through all keys in savedObj
  for (const key in savedObj) {
    // If the key exists in defaultObj and both values are objects, recursively merge
    if (
      key in defaultObj && 
      typeof defaultObj[key] === 'object' && 
      defaultObj[key] !== null &&
      typeof savedObj[key] === 'object' && 
      savedObj[key] !== null &&
      !Array.isArray(defaultObj[key]) && 
      !Array.isArray(savedObj[key])
    ) {
      result[key] = mergeSettings(defaultObj[key], savedObj[key])
    } 
    // Otherwise, use the saved value
    else {
      result[key] = savedObj[key]
    }
  }
  
  return result
}