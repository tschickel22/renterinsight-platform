import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSettings } from './utils/useSettings'
import GeneralSettings from './components/GeneralSettings'
import PaymentSettings from './components/PaymentSettings'
// import SecuritySettings from './components/SecuritySettings'
// import IntegrationsSettings from './components/IntegrationsSettings'
// import NotificationsSettings from './components/NotificationsSettings'
// import BrandingSettings from './components/BrandingSettings'
// import AdvancedSettings from './components/AdvancedSettings'

export default function PlatformSettings() {
  const { settings, updateSetting, resetSettings, saveSettings } = useSettings()

  if (!settings) {
    return <div>Loading settings...</div>
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage global platform configurations.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={resetSettings}>Reset to Defaults</Button>
          <Button onClick={saveSettings}>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          {/* <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger> */}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system information and operational modes.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage payment gateway configurations and currency settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Uncomment and add content for other tabs as needed */}
        {/*
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication, password policies, and security features.</CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations Settings</CardTitle>
              <CardDescription>Manage third-party service integrations.</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationsSettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications Settings</CardTitle>
              <CardDescription>Configure email and SMS notification preferences and templates.</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationsSettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the platform's appearance and branding elements.</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandingSettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Access and configure advanced system parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedSettings settings={settings} onChange={updateSetting} />
            </CardContent>
          </Card>
        </TabsContent>
        */}
      </Tabs>
    </div>
  )
}