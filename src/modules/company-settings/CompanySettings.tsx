import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, Save, Plus, Edit, Trash2, Users, Building, Palette } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { CustomField, CustomFieldType } from '@/types'

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
    // Save settings logic here
    console.log('Saving settings...')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Basic information about your dealership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input defaultValue={tenant?.name} />
            </div>
            <div>
              <label className="text-sm font-medium">Domain</label>
              <Input defaultValue={tenant?.domain} />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Input defaultValue={tenant?.settings.timezone} />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <Input defaultValue={tenant?.settings.currency} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>
            Set your dealership operating hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenant?.settings.businessHours && Object.entries(tenant.settings.businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <div className="w-24 capitalize">{day}</div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    defaultValue={hours.open}
                    disabled={hours.closed}
                    className="w-32"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    defaultValue={hours.close}
                    disabled={hours.closed}
                    className="w-32"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={hours.closed}
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
    <Card>
      <CardHeader>
        <CardTitle>Branding & Appearance</CardTitle>
        <CardDescription>
          Customize your dealership's visual identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Primary Color</label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                defaultValue={tenant?.branding.primaryColor}
                className="w-16 h-10"
              />
              <Input defaultValue={tenant?.branding.primaryColor} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Secondary Color</label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                defaultValue={tenant?.branding.secondaryColor}
                className="w-16 h-10"
              />
              <Input defaultValue={tenant?.branding.secondaryColor} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Font Family</label>
            <Input defaultValue={tenant?.branding.fontFamily} />
          </div>
          <div>
            <label className="text-sm font-medium">Logo URL</label>
            <Input defaultValue={tenant?.branding.logo || ''} placeholder="https://..." />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderUsersSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Manage users, roles, and permissions for your dealership
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Admin User</h4>
              <p className="text-sm text-muted-foreground">admin@renterinsight.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge>Admin</Badge>
              <Button variant="outline" size="sm">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCustomFieldsSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
        <CardDescription>
          Add custom fields to capture additional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Create custom fields for leads, vehicles, and other entities
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Field
          </Button>
        </div>
        <div className="space-y-4">
          {customFields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{field.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {field.module} - {field.section} - {field.type}
                  {field.required && <Badge className="ml-2" variant="secondary">Required</Badge>}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {customFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No custom fields configured yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
          <p className="text-muted-foreground">
            Configure your dealership settings and preferences
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
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