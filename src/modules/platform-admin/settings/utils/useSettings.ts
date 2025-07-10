import { useState, useEffect, useCallback } from 'react'
import { getSettings, saveSettings as saveSettingsToLocalStorage, resetSettings as resetSettingsInLocalStorage } from './settingsHelpers'
import { defaultSettings } from '../schemas/defaultSettings'

export function useSettings() {
  const [settings, setSettings] = useState<any | null>(null)

  useEffect(() => {
    const loadedSettings = getSettings()
    setSettings(loadedSettings)
  }, [])

  const updateSetting = useCallback((newValues: Partial<typeof defaultSettings>) => {
    setSettings((prevSettings: any) => {
      const updated = { ...prevSettings, ...newValues }
      saveSettingsToLocalStorage(updated)
      return updated
    })
  }, [])

  const resetSettings = useCallback(() => {
    const reset = resetSettingsInLocalStorage()
    setSettings(reset)
  }, [])

  const saveSettings = useCallback(() => {
    if (settings) {
      saveSettingsToLocalStorage(settings)
      console.log('Settings saved successfully!')
      // Optionally, add a toast notification or similar feedback
    }
  }, [settings])

  return { settings, updateSetting, resetSettings, saveSettings }
}