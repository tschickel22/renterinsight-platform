import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Bell, Mail, MessageSquare, Smartphone, BellRing } from 'lucide-react'

interface NotificationsSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function NotificationsSettings({ settings, onChange }: NotificationsSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    const currentChannels = [...(settings.notificationChannels || [])]
    if (checked && !currentChannels.includes(channel)) {
      currentChannels.push(channel)
    } else if (!checked && currentChannels.includes(channel)) {
      const index = currentChannels.indexOf(channel)
      currentChannels.splice(index, 1)
    }
    onChange({ notificationChannels: currentChannels })
  }

  const handleTemplateChange = (templateKey: string, value: string) => {
    onChange({
      notificationTemplates: {
        ...settings.notificationTemplates,
        [templateKey]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bell className="mr-2 h-5 w-5" /> General Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotifications"
              checked={settings.emailNotifications || false}
              onCheckedChange={(checked) => handleChange('emailNotifications', !!checked)}
            />
            <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsNotifications"
              checked={settings.smsNotifications || false}
              onCheckedChange={(checked) => handleChange('smsNotifications', !!checked)}
            />
            <Label htmlFor="smsNotifications">Enable SMS Notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pushNotifications"
              checked={settings.pushNotifications || false}
              onCheckedChange={(checked) => handleChange('pushNotifications', !!checked)}
            />
            <Label htmlFor="pushNotifications">Enable Push Notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inAppNotifications"
              checked={settings.inAppNotifications || false}
              onCheckedChange={(checked) => handleChange('inAppNotifications', !!checked)}
            />
            <Label htmlFor="inAppNotifications">Enable In-App Notifications</Label>
          </div>

          <div>
            <Label className="mb-2 block">Default Notification Channels</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channelEmail"
                  checked={(settings.notificationChannels || []).includes('email')}
                  onCheckedChange={(checked) => handleChannelChange('email', !!checked)}
                />
                <Label htmlFor="channelEmail">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channelSms"
                  checked={(settings.notificationChannels || []).includes('sms')}
                  onCheckedChange={(checked) => handleChannelChange('sms', !!checked)}
                />
                <Label htmlFor="channelSms">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channelInApp"
                  checked={(settings.notificationChannels || []).includes('in_app')}
                  onCheckedChange={(checked) => handleChannelChange('in_app', !!checked)}
                />
                <Label htmlFor="channelInApp">In-App</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channelPush"
                  checked={(settings.notificationChannels || []).includes('push')}
                  onCheckedChange={(checked) => handleChannelChange('push', !!checked)}
                />
                <Label htmlFor="channelPush">Push</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BellRing className="mr-2 h-5 w-5" /> Notification Templates
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="welcomeTemplate">Welcome Email/Message</Label>
            <Textarea
              id="welcomeTemplate"
              value={settings.notificationTemplates?.welcome || ''}
              onChange={(e) => handleTemplateChange('welcome', e.target.value)}
              placeholder="e.g., Welcome to our platform!"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="passwordResetTemplate">Password Reset Email/Message</Label>
            <Textarea
              id="passwordResetTemplate"
              value={settings.notificationTemplates?.passwordReset || ''}
              onChange={(e) => handleTemplateChange('passwordReset', e.target.value)}
              placeholder="e.g., Your password has been reset."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="paymentConfirmationTemplate">Payment Confirmation Email/Message</Label>
            <Textarea
              id="paymentConfirmationTemplate"
              value={settings.notificationTemplates?.paymentConfirmation || ''}
              onChange={(e) => handleTemplateChange('paymentConfirmation', e.target.value)}
              placeholder="e.g., Your payment has been confirmed."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="newLeadTemplate">New Lead Notification</Label>
            <Textarea
              id="newLeadTemplate"
              value={settings.notificationTemplates?.newLead || ''}
              onChange={(e) => handleTemplateChange('newLead', e.target.value)}
              placeholder="e.g., You have a new lead!"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="taskAssignedTemplate">Task Assigned Notification</Label>
            <Textarea
              id="taskAssignedTemplate"
              value={settings.notificationTemplates?.taskAssigned || ''}
              onChange={(e) => handleTemplateChange('taskAssigned', e.target.value)}
              placeholder="e.g., A new task has been assigned to you."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )
}