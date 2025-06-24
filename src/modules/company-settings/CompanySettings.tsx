import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, Save, Plus, Edit, Trash2, Users, Building, Palette } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { CustomField, CustomFieldType } from '@/types'
import { cn } from '@/lib/utils'

function CompanySettingsPage() {
  const { tenant, customFields, updateTenantSettings, addCustomField, updateCustomField, deleteCustomField } = useTenant()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'General', icon: Building },
    { id: 'branding', name: 'Branding', icon: Palette },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'custom-fields', name: 'Custom Fields', icon: Settings },
  ]

  const handleSaveSettings = async () => {
    console.log('Saving settings...')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Company Information</CardTitle>
          <CardDescription>
            Basic information about your dealership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <Input defaultValue={tenant?.name} className="mt-1 shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Domain</label>
              <Input defaultValue={tenant?.domain} className="mt-1 shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Timezone</label>
              <Input defaultValue={tenant?.settings.timezone} className="mt-1 shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Currency</label>
              <Input defaultValue={tenant?.settings.currency} className="mt-1 shadow-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Business Hours</CardTitle>
          <CardDescription>
            Set your dealership operating hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenant?.settings.businessHours && Object.entries(tenant.settings.businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="w-24 capitalize font-medium">{day}</div>
                <div className="flex items-center space-x-3">
                  <Input
                    type="time"
                    defaultValue={hours.open}
                    disabled={hours.closed}
                    className="w-32 shadow-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    defaultValue={hours.close}
                    disabled={hours.closed}
                    className="w-32 shadow-sm"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={hours.closed}
                      className="rounded"
                    />
                    <span className="text-sm">Closed</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBrandingSettings = () => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Branding & Appearance</CardTitle>
        <CardDescription>
          Customize your dealership's visual identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Primary Color</label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                defaultValue={tenant?.branding.primaryColor}
                className="w-16 h-10 shadow-sm"
              />
              <Input defaultValue={tenant?.branding.primaryColor} className="shadow-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Secondary Color</label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                defaultValue={tenant?.branding.secondaryColor}
                className="w-16 h-10 shadow-sm"
              />
              <Input defaultValue={tenant?.branding.secondaryColor} className="shadow-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Font Family</label>
            <Input defaultValue={tenant?.branding.fontFamily} className="mt-1 shadow-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Logo URL</label>
            <Input defaultValue={tenant?.branding.logo || ''} placeholder="https://..." className="mt-1 shadow-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderUsersSettings = () => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">User Management</CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Manage users, roles, and permissions for your dealership
          </p>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div>
              <h4 className="font-semibold">Admin User</h4>
              <p className="text-sm text-muted-foreground">admin@renterinsight.com</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">Admin</Badge>
              <Button variant="outline" size="sm" className="shadow-sm">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCustomFieldsSettings = () => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Custom Fields</CardTitle>
        <CardDescription>
          Add custom fields to capture additional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Create custom fields for leads, vehicles, and other entities
          </p>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Field
          </Button>
        </div>
        <div className="space-y-4">
          {customFields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div>
                <h4 className="font-semibold">{field.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {field.module} - {field.section} - {field.type}
                  {field.required && <Badge className="ml-2 bg-orange-50 text-orange-700 border-orange-200" variant="secondary">Required</Badge>}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {customFields.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
              No custom fields configured yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Company Settings</h1>
            <p className="ri-page-description">
              Configure your dealership settings and preferences
            </p>
          </div>
          <Button onClick={handleSaveSettings} className="shadow-sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'branding' && renderBrandingSettings()}
        {activeTab === 'users' && renderUsersSettings()}
        {activeTab === 'custom-fields' && renderCustomFieldsSettings()}
      </div>
    </div>
  )
}

export default function CompanySettings() {
  return (
    <Routes>
      <Route path="/" element={<CompanySettingsPage />} />
      <Route path="/*" element={<CompanySettingsPage />} />
    </Routes>
  )
}