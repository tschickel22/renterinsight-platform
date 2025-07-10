import { useState, useEffect } from 'react'
import { defaultSettings } from '../schemas/defaultSettings'
import { loadSettings, saveSettings } from './settingsHelpers'

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const loadedSettings = await loadSettings()
        setSettings(loadedSettings)
      } catch (err) {
        console.error('Failed to load settings:', err)
        setError(err instanceof Error ? err : new Error('Failed to load settings'))
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateSettings = async (category: string, values: Record<string, any>) => {
    try {
      const updatedSettings = {
        ...settings,
        [category]: {
          ...(settings[category] || {}),
          ...values
        }
      }
      
      await saveSettings(updatedSettings)
      setSettings(updatedSettings)
      return true
    } catch (err) {
      console.error('Failed to update settings:', err)
      setError(err instanceof Error ? err : new Error('Failed to update settings'))
      return false
    }
  }

  const resetSettings = async (category?: string) => {
    try {
      let updatedSettings
      
      if (category) {
        // Reset only the specified category
        updatedSettings = {
          ...settings,
          [category]: { ...defaultSettings[category] }
        }
      } else {
        // Reset all settings
        updatedSettings = { ...defaultSettings }
      }
      
      await saveSettings(updatedSettings)
      setSettings(updatedSettings)
      return true
    } catch (err) {
      console.error('Failed to reset settings:', err)
      setError(err instanceof Error ? err : new Error('Failed to reset settings'))
      return false
    }
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings
  }
}