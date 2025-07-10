import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Save, Settings, Mail, MessageSquare, CreditCard, Shield, Globe, Database, Bell } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Import settings components
import GeneralSettings from './components/GeneralSettings'
import EmailSettings from './components/EmailSettings'
import SmsSettings from './components/SmsSettings'
import PaymentSettings from './components/PaymentSettings'
import SecuritySettings from './components/SecuritySettings'
import ApiSettings from './components/ApiSettings'
import DatabaseSettings from './components/DatabaseSettings'
import NotificationSettings from './components/NotificationSettings'

// Import settings schema and utilities
import { useSettings } from './utils/useSettings'
import { mergeSettings } from './utils/settingsHelpers'

export default function PlatformSettings() {
  const { toast } = useToast()
  const { settings, saveSettings, isLoading } = useSettings()
  const [activeTab, setActiveTab] = useState('general')
  const [localSettings, setLocalSettings] = useState(settings)
  
  const handleSettingsChange = (category: string, newValues: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        ...newValues
      }
    }))
  }
  
  const handleSaveAll = async () => {
    try {
      await saveSettings(localSettings)
      toast({
        title: 'Settings Saved',
        description: 'Platform settings have been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      })
    }
  }
  
  const settingsTabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'sms', name: 'SMS', icon: MessageSquare },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API', icon: Globe },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure global platform settings and defaults
          </p>
        </div>
        <Button onClick={handleSaveAll} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>
            Manage global settings that apply to all tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 md:grid-cols-8">
              {settingsTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="general">
              <GeneralSettings 
                settings={localSettings.general || {}} 
                onChange={(values) => handleSettingsChange('general', values)} 
              />
            </TabsContent>
            
            <TabsContent value="email">
              <EmailSettings 
                settings={localSettings.email || {}} 
                onChange={(values) => handleSettingsChange('email', values)} 
              />
            </TabsContent>
            
            <TabsContent value="sms">
              <SmsSettings 
                settings={localSettings.sms || {}} 
                onChange={(values) => handleSettingsChange('sms', values)} 
              />
            </TabsContent>
            
            <TabsContent value="payment">
              <PaymentSettings 
                settings={localSettings.payment || {}} 
                onChange={(values) => handleSettingsChange('payment', values)} 
              />
            </TabsContent>
            
            <TabsContent value="security">
              <SecuritySettings 
                settings={localSettings.security || {}} 
                onChange={(values) => handleSettingsChange('security', values)} 
              />
            </TabsContent>
            
            <TabsContent value="api">
              <ApiSettings 
                settings={localSettings.api || {}} 
                onChange={(values) => handleSettingsChange('api', values)} 
              />
            </TabsContent>
            
            <TabsContent value="database">
              <DatabaseSettings 
                settings={localSettings.database || {}} 
                onChange={(values) => handleSettingsChange('database', values)} 
              />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings 
                settings={localSettings.notifications || {}} 
                onChange={(values) => handleSettingsChange('notifications', values)} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}