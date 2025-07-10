// src/modules/platform-admin/settings/utils/useSettings.ts
import { useState, useEffect, useCallback } from 'react'
import { defaultSettings } from '../schemas/defaultSettings'

// Define the shape of your settings object
export interface Settings {
  // General Settings
  appName: string
  appLogo: string
  contactEmail: string
  contactPhone: string
  address: string
  website: string
  timezone: string
  dateFormat: string
  timeFormat: string
  currency: string
  currencySymbol: string
  language: string
  maintenanceMode: boolean
  welcomeMessage: string

  // Payment Settings
  paymentGateway: 'stripe' | 'paypal' | 'none'
  stripePublishableKey: string
  stripeSecretKey: string
  paypalClientId: string
  paypalClientSecret: string
  enableSubscriptions: boolean
  taxRate: number
  enableInvoiceGeneration: boolean

  // SMS Settings
  smsProvider: 'twilio' | 'messagebird' | 'vonage' | 'none'
  twilioAccountSid: string
  twilioAuthToken: string
  twilioPhoneNumber: string
  smsEnabled: boolean
  smsTemplates: any[] // Define a more specific type if needed

  // Email Settings
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'none'
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  smtpSecure: boolean
  emailFromAddress: string
  emailFromName: string
  emailEnabled: boolean
  emailTemplates: any[] // Define a more specific type if needed

  // Voice Settings
  voiceProvider: 'twilio' | 'none'
  twilioVoiceSid: string
  twilioVoiceAuthToken: string
  voiceEnabled: boolean

  // Security Settings
  passwordMinLength: number
  passwordRequiresUppercase: boolean
  passwordRequiresLowercase: boolean
  passwordRequiresNumber: boolean
  passwordRequiresSymbol: boolean
  twoFactorAuthEnabled: boolean
  sessionTimeout: number
  failedLoginAttemptsLockout: number
  lockoutDuration: number

  // Integrations
  googleMapsApiKey: string
  slackWebhookUrl: string

  // Analytics
  googleAnalyticsTrackingId: string
  mixpanelProjectId: string

  // Branding
  primaryColor: string
  secondaryColor: string
  fontFamily: string

  // Other
  termsOfServiceUrl: string
  privacyPolicyUrl: string
  supportPageUrl: string
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // In a real application, you would fetch settings from a backend API
  // For this example, we'll simulate fetching from local storage or a default
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('platformSettings')
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) })
      }
    } catch (e) {
      console.error('Failed to load settings from local storage', e)
      setError('Failed to load settings.')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback((newValues: Partial<Settings>) => {
    setSettings((prevSettings) => {
      const updated = { ...prevSettings, ...newValues }
      try {
        localStorage.setItem('platformSettings', JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save settings to local storage', e)
        setError('Failed to save settings.')
      }
      return updated
    })
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
    try {
      localStorage.removeItem('platformSettings')
    } catch (e) {
      console.error('Failed to clear settings from local storage', e)
      setError('Failed to reset settings.')
    }
  }, [])

  return { settings, updateSettings, resetSettings, loading, error }
}
