import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Globe, Mail, MessageSquare, Bell, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PortalSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('general')
  
  // General settings
  const [portalName, setPortalName] = useState('Customer Self-Service Portal')
  const [portalDescription, setPortalDescription] = useState('Access your quotes, service history, and more')
  const [portalLogo, setPortalLogo] = useState('')
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome to your customer portal. Here you can view your quotes, track deliveries, and request service.')
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [notifyOnQuoteViewed, setNotifyOnQuoteViewed] = useState(true)
  const [notifyOnQuoteAccepted, setNotifyOnQuoteAccepted] = useState(true)
  const [notifyOnServiceRequest, setNotifyOnServiceRequest] = useState(true)
  
  // Security settings
  const [requireStrongPasswords, setRequireStrongPasswords] = useState(true)
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5)
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast({
      title: 'Settings Saved',
      description: 'Portal settings have been updated successfully.',
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Portal Configuration
              </CardTitle>
              <CardDescription>
                Configure general portal settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portalName">Portal Name</Label>
                <Input
                  id="portalName"
                  value={portalName}
                  onChange={(e) => setPortalName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="portalDescription">Portal Description</Label>
                <Input
                  id="portalDescription"
                  value={portalDescription}
                  onChange={(e) => setPortalDescription(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="portalLogo">Logo URL (Optional)</Label>
                <Input
                  id="portalLogo"
                  value={portalLogo}
                  onChange={(e) => setPortalLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Portal Features</CardTitle>
              <CardDescription>
                Enable or disable portal features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="enableQuotes" defaultChecked />
                  <Label htmlFor="enableQuotes">Enable Quotes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enableService" defaultChecked />
                  <Label htmlFor="enableService">Enable Service Requests</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enableDelivery" defaultChecked />
                  <Label htmlFor="enableDelivery">Enable Delivery Tracking</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enableDocuments" defaultChecked />
                  <Label htmlFor="enableDocuments">Enable Document Signing</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enableSurveys" defaultChecked />
                  <Label htmlFor="enableSurveys">Enable Satisfaction Surveys</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Notification Channels</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emailNotifications" 
                        checked={emailNotifications}
                        onCheckedChange={(checked) => setEmailNotifications(!!checked)}
                      />
                      <Label htmlFor="emailNotifications" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        Email Notifications
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="smsNotifications" 
                        checked={smsNotifications}
                        onCheckedChange={(checked) => setSmsNotifications(!!checked)}
                      />
                      <Label htmlFor="smsNotifications" className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                        SMS Notifications
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">Notification Events</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifyOnQuoteViewed" 
                        checked={notifyOnQuoteViewed}
                        onCheckedChange={(checked) => setNotifyOnQuoteViewed(!!checked)}
                      />
                      <Label htmlFor="notifyOnQuoteViewed">
                        Quote Viewed by Customer
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifyOnQuoteAccepted" 
                        checked={notifyOnQuoteAccepted}
                        onCheckedChange={(checked) => setNotifyOnQuoteAccepted(!!checked)}
                      />
                      <Label htmlFor="notifyOnQuoteAccepted">
                        Quote Accepted by Customer
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifyOnServiceRequest" 
                        checked={notifyOnServiceRequest}
                        onCheckedChange={(checked) => setNotifyOnServiceRequest(!!checked)}
                      />
                      <Label htmlFor="notifyOnServiceRequest">
                        New Service Request Submitted
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Email Templates</CardTitle>
              <CardDescription>
                Customize notification email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="welcomeEmailTemplate">Welcome Email</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Welcome Template</SelectItem>
                      <SelectItem value="minimal">Minimal Welcome Template</SelectItem>
                      <SelectItem value="branded">Branded Welcome Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="passwordResetTemplate">Password Reset Email</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Password Reset Template</SelectItem>
                      <SelectItem value="minimal">Minimal Password Reset Template</SelectItem>
                      <SelectItem value="secure">Secure Password Reset Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure portal security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requireStrongPasswords" 
                    checked={requireStrongPasswords}
                    onCheckedChange={(checked) => setRequireStrongPasswords(!!checked)}
                  />
                  <Label htmlFor="requireStrongPasswords">
                    Require Strong Passwords
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                  <Input
                    id="passwordExpiryDays"
                    type="number"
                    min="0"
                    value={passwordExpiryDays}
                    onChange={(e) => setPasswordExpiryDays(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Set to 0 for no expiration
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="1"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value) || 5)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    min="5"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 30)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="twoFactorAuth" 
                    checked={twoFactorAuth}
                    onCheckedChange={(checked) => setTwoFactorAuth(!!checked)}
                  />
                  <Label htmlFor="twoFactorAuth">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Access Controls</CardTitle>
              <CardDescription>
                Configure IP restrictions and access limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ipWhitelist">IP Whitelist (Optional)</Label>
                  <Textarea
                    id="ipWhitelist"
                    placeholder="Enter IP addresses, one per line"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to allow access from any IP address
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="limitConcurrentSessions" defaultChecked />
                  <Label htmlFor="limitConcurrentSessions">
                    Limit to One Active Session Per User
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}