// src/modules/platform-admin/settings/index.tsx
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GeneralSettings from './components/GeneralSettings'
import PaymentSettings from './components/PaymentSettings'
import SmsSettings from './components/SmsSettings'
import EmailSettings from './components/EmailSettings'
import VoiceSettings from './components/VoiceSettings'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useSettings, Settings } from './utils/useSettings'

export default function PlatformAdminSettings() {
  const { settings, updateSettings, resetSettings, loading, error } = useSettings()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('general')

  const handleSettingsChange = (newValues: Partial<Settings>) => {
    updateSettings(newValues)
  }

  const handleSaveChanges = () => {
    // In a real application, you would send these settings to your backend
    console.log('Saving settings:', settings)
    toast({
      title: 'Settings Saved',
      description: 'Your platform settings have been updated.',
    })
  }

  const handleResetToDefaults = () => {
    resetSettings()
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to their default values.',
    })
  }

  if (loading) {
    return <div>Loading settings...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Manage global platform configurations.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleResetToDefaults}>Reset to Defaults</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5"> {/* Adjusted grid-cols to fit new tabs */}
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralSettings settings={settings} onChange={handleSettingsChange} />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentSettings settings={settings} onChange={handleSettingsChange} />
            </TabsContent>

            <TabsContent value="sms">
              <SmsSettings settings={settings} onChange={handleSettingsChange} />
            </TabsContent>

            <TabsContent value="email">
              <EmailSettings settings={settings} onChange={handleSettingsChange} />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceSettings settings={settings} onChange={handleSettingsChange} />
            </TabsContent>

            {/* Add more TabsContent for other settings sections */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
