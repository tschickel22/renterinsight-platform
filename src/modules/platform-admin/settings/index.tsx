import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  Settings as SettingsIcon,
  Mail,
  MessageSquare,
  CreditCard,
  Shield,
  Link,
  Bell,
  Paintbrush,
  Code,
  Save,
  RotateCcw
} from 'lucide-react'

import GeneralSettings from './components/GeneralSettings'
import EmailSettings from './components/EmailSettings'
import SmsSettings from './components/SmsSettings'
import PaymentSettings from './components/PaymentSettings'
import SecuritySettings from './components/SecuritySettings'
import IntegrationsSettings from './components/IntegrationsSettings'
import NotificationsSettings from './components/NotificationsSettings'
import BrandingSettings from './components/BrandingSettings'
import AdvancedSettings from './components/AdvancedSettings'

import { useSettings } from './utils/useSettings'
import { defaultSettings } from './schemas/defaultSettings'

export default function PlatformSettings() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [currentSettings, setCurrentSettings] = useState(settings)

  useEffect(() => {
    setCurrentSettings(settings)
  }, [settings])

  const handleSave = () => {
    updateSettings(currentSettings)
    toast({
      title: 'Settings Saved',
      description: 'Your platform settings have been successfully updated.',
    })
  }

  const handleReset = () => {
    resetSettings()
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to their default values.',
      variant: 'destructive'
    })
  }

  const handleSettingChange = (category: string, values: any) => {
    setCurrentSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...values
      }
    }))
  }

  if (!currentSettings) {
    return <div>Loading settings...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <SettingsIcon className="mr-3 h-8 w-8" /> Platform Settings
      </h1>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 justify-start">
          <TabsTrigger value="general" className="flex items-center px-4 py-2">
            <SettingsIcon className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center px-4 py-2">
            <Mail className="mr-2 h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center px-4 py-2">
            <MessageSquare className="mr-2 h-4 w-4" /> SMS
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center px-4 py-2">
            <CreditCard className="mr-2 h-4 w-4" /> Payment
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center px-4 py-2">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center px-4 py-2">
            <Link className="mr-2 h-4 w-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center px-4 py-2">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center px-4 py-2">
            <Paintbrush className="mr-2 h-4 w-4" /> Branding
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center px-4 py-2">
            <Code className="mr-2 h-4 w-4" /> Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="p-4 border rounded-md">
          <GeneralSettings
            settings={currentSettings.general}
            onChange={(values) => handleSettingChange('general', values)}
          />
        </TabsContent>
        <TabsContent value="email" className="p-4 border rounded-md">
          <EmailSettings
            settings={currentSettings.email}
            onChange={(values) => handleSettingChange('email', values)}
          />
        </TabsContent>
        <TabsContent value="sms" className="p-4 border rounded-md">
          <SmsSettings
            settings={currentSettings.sms}
            onChange={(values) => handleSettingChange('sms', values)}
          />
        </TabsContent>
        <TabsContent value="payment" className="p-4 border rounded-md">
          <PaymentSettings
            settings={currentSettings.payment}
            onChange={(values) => handleSettingChange('payment', values)}
          />
        </TabsContent>
        <TabsContent value="security" className="p-4 border rounded-md">
          <SecuritySettings
            settings={currentSettings.security}
            onChange={(values) => handleSettingChange('security', values)}
          />
        </TabsContent>
        <TabsContent value="integrations" className="p-4 border rounded-md">
          <IntegrationsSettings
            settings={currentSettings.integrations}
            onChange={(values) => handleSettingChange('integrations', values)}
          />
        </TabsContent>
        <TabsContent value="notifications" className="p-4 border rounded-md">
          <NotificationsSettings
            settings={currentSettings.notifications}
            onChange={(values) => handleSettingChange('notifications', values)}
          />
        </TabsContent>
        <TabsContent value="branding" className="p-4 border rounded-md">
          <BrandingSettings
            settings={currentSettings.branding}
            onChange={(values) => handleSettingChange('branding', values)}
          />
        </TabsContent>
        <TabsContent value="advanced" className="p-4 border rounded-md">
          <AdvancedSettings
            settings={currentSettings.advanced}
            onChange={(values) => handleSettingChange('advanced', values)}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  )
}