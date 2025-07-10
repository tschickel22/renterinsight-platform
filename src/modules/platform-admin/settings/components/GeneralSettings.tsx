import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle } from 'lucide-react'

interface GeneralSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
    { value: 'UTC', label: 'Universal Time (UTC)' }
  ]

  const userRoles = [
    { value: 'user', label: 'User' },
    { value: 'sales', label: 'Sales' },
    { value: 'service', label: 'Service' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ]

  const auditLevels = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'standard', label: 'Standard' },
    { value: 'verbose', label: 'Verbose' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="systemName">System Name</Label>
            <Input
              id="systemName"
              value={settings.systemName || ''}
              onChange={(e) => handleChange('systemName', e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <Label htmlFor="systemVersion">System Version</Label>
            <Input
              id="systemVersion"
              value={settings.systemVersion || ''}
              onChange={(e) => handleChange('systemVersion', e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail || ''}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <Label htmlFor="supportPhone">Support Phone</Label>
            <Input
              id="supportPhone"
              value={settings.supportPhone || ''}
              onChange={(e) => handleChange('supportPhone', e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <Label htmlFor="timezone">Default Timezone</Label>
            <Select
              value={settings.timezone || 'America/New_York'}
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(timezone => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="defaultUserRole">Default User Role</Label>
            <Select
              value={settings.defaultUserRole || 'user'}
              onValueChange={(value) => handleChange('defaultUserRole', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Maintenance Mode</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maintenanceMode"
              checked={settings.maintenanceMode || false}
              onCheckedChange={(checked) => handleChange('maintenanceMode', !!checked)}
            />
            
            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
          </div>
          
          {settings.maintenanceMode && (
            <div className="bg-yellow-50 p-4 rounded-md flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Enabling maintenance mode will prevent all users from accessing the system except for administrators.
                </p>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              value={settings.maintenanceMessage || ''}
              onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
              placeholder="Enter message to display during maintenance"
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Audit Logging</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="auditLogRetentionDays">Audit Log Retention (Days)</Label>
            <Input
              id="auditLogRetentionDays"
              type="number"
              value={settings.auditLogRetentionDays || 0}
              onChange={(e) => handleChange('auditLogRetentionDays', parseInt(e.target.value))}
              className="max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="auditLogLevel">Audit Log Level</Label>
            <Select
              value={settings.auditLogLevel || 'standard'}
              onValueChange={(value) => handleChange('auditLogLevel', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {auditLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}