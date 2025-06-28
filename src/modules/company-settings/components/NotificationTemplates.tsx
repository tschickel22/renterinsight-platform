import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Mail, MessageSquare, Save, Plus, Trash2, RefreshCw, Eye } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: string
  variables: string[]
  isActive: boolean
}

interface SMSTemplate {
  id: string
  name: string
  message: string
  type: string
  variables: string[]
  isActive: boolean
}

export function NotificationTemplates() {
  const { tenant, updateTenantSettings } = useTenant()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('email')
  
  // Email Templates
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(
    tenant?.settings?.emailTemplates || []
  )
  const [editingEmailTemplate, setEditingEmailTemplate] = useState<EmailTemplate | null>(null)
  const [emailName, setEmailName] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailType, setEmailType] = useState('welcome')
  
  // SMS Templates
  const [smsTemplates, setSmsTemplates] = useState<SMSTemplate[]>(
    tenant?.settings?.smsTemplates || []
  )
  const [editingSmsTemplate, setEditingSmsTemplate] = useState<SMSTemplate | null>(null)
  const [smsName, setSmsName] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [smsType, setSmsType] = useState('welcome')

  // Preview
  const [showPreview, setShowPreview] = useState(false)
  const [previewType, setPreviewType] = useState<'email' | 'sms'>('email')
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | SMSTemplate | null>(null)

  const emailTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'quote', label: 'Quote Email' },
    { value: 'service', label: 'Service Notification' },
    { value: 'delivery', label: 'Delivery Notification' },
    { value: 'invoice', label: 'Invoice Email' },
    { value: 'password_reset', label: 'Password Reset' },
    { value: 'custom', label: 'Custom Email' }
  ]

  const smsTypes = [
    { value: 'welcome', label: 'Welcome SMS' },
    { value: 'quote', label: 'Quote SMS' },
    { value: 'service', label: 'Service Notification' },
    { value: 'delivery', label: 'Delivery Notification' },
    { value: 'appointment', label: 'Appointment Reminder' },
    { value: 'custom', label: 'Custom SMS' }
  ]

  const commonVariables = [
    '{{first_name}}',
    '{{last_name}}',
    '{{company_name}}',
    '{{quote_number}}',
    '{{invoice_number}}',
    '{{service_ticket}}',
    '{{delivery_date}}',
    '{{appointment_date}}',
    '{{appointment_time}}',
    '{{login_url}}',
    '{{reset_url}}'
  ]

  const resetEmailForm = () => {
    setEditingEmailTemplate(null)
    setEmailName('')
    setEmailSubject('')
    setEmailBody('')
    setEmailType('welcome')
  }

  const resetSmsForm = () => {
    setEditingSmsTemplate(null)
    setSmsName('')
    setSmsMessage('')
    setSmsType('welcome')
  }

  const handleEditEmailTemplate = (template: EmailTemplate) => {
    setEditingEmailTemplate(template)
    setEmailName(template.name)
    setEmailSubject(template.subject)
    setEmailBody(template.body)
    setEmailType(template.type)
  }

  const handleEditSmsTemplate = (template: SMSTemplate) => {
    setEditingSmsTemplate(template)
    setSmsName(template.name)
    setSmsMessage(template.message)
    setSmsType(template.type)
  }

  const handleSaveEmailTemplate = () => {
    if (!emailName || !emailSubject || !emailBody) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    // Extract variables from the template
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match
    
    while ((match = variableRegex.exec(emailSubject + emailBody)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    if (editingEmailTemplate) {
      // Update existing template
      setEmailTemplates(emailTemplates.map(template => 
        template.id === editingEmailTemplate.id 
          ? {
              ...template,
              name: emailName,
              subject: emailSubject,
              body: emailBody,
              type: emailType,
              variables
            }
          : template
      ))
    } else {
      // Create new template
      setEmailTemplates([
        ...emailTemplates,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: emailName,
          subject: emailSubject,
          body: emailBody,
          type: emailType,
          variables,
          isActive: true
        }
      ])
    }

    resetEmailForm()
  }

  const handleSaveSmsTemplate = () => {
    if (!smsName || !smsMessage) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    // Extract variables from the template
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match
    
    while ((match = variableRegex.exec(smsMessage)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    if (editingSmsTemplate) {
      // Update existing template
      setSmsTemplates(smsTemplates.map(template => 
        template.id === editingSmsTemplate.id 
          ? {
              ...template,
              name: smsName,
              message: smsMessage,
              type: smsType,
              variables
            }
          : template
      ))
    } else {
      // Create new template
      setSmsTemplates([
        ...smsTemplates,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: smsName,
          message: smsMessage,
          type: smsType,
          variables,
          isActive: true
        }
      ])
    }

    resetSmsForm()
  }

  const handleDeleteEmailTemplate = (id: string) => {
    setEmailTemplates(emailTemplates.filter(template => template.id !== id))
  }

  const handleDeleteSmsTemplate = (id: string) => {
    setSmsTemplates(smsTemplates.filter(template => template.id !== id))
  }

  const handleToggleEmailTemplate = (id: string) => {
    setEmailTemplates(emailTemplates.map(template => 
      template.id === id ? { ...template, isActive: !template.isActive } : template
    ))
  }

  const handleToggleSmsTemplate = (id: string) => {
    setSmsTemplates(smsTemplates.map(template => 
      template.id === id ? { ...template, isActive: !template.isActive } : template
    ))
  }

  const handlePreview = (type: 'email' | 'sms', template: EmailTemplate | SMSTemplate) => {
    setPreviewType(type)
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  const insertVariable = (variable: string) => {
    if (activeTab === 'email') {
      setEmailBody(emailBody + variable)
    } else {
      setSmsMessage(smsMessage + variable)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateTenantSettings({
        emailTemplates,
        smsTemplates
      })
      
      toast({
        title: 'Templates Updated',
        description: 'Your notification templates have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification templates.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Preview Modal */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Template Preview</CardTitle>
                  <CardDescription>
                    {previewTemplate.name}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewType === 'email' && (
                <>
                  <div>
                    <Label>Subject</Label>
                    <div className="p-3 bg-muted/30 rounded-md mt-1">
                      {(previewTemplate as EmailTemplate).subject}
                    </div>
                  </div>
                  <div>
                    <Label>Body</Label>
                    <div className="p-3 bg-muted/30 rounded-md mt-1 whitespace-pre-wrap">
                      {(previewTemplate as EmailTemplate).body}
                    </div>
                  </div>
                </>
              )}
              
              {previewType === 'sms' && (
                <div>
                  <Label>Message</Label>
                  <div className="p-3 bg-muted/30 rounded-md mt-1">
                    {(previewTemplate as SMSTemplate).message}
                  </div>
                </div>
              )}
              
              <div>
                <Label>Variables</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {previewTemplate.variables.map((variable, index) => (
                    <Badge key={index} variant="secondary">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                  {previewTemplate.variables.length === 0 && (
                    <div className="text-sm text-muted-foreground">No variables used</div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowPreview(false)}>
                  Close Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Notification Templates
          </CardTitle>
          <CardDescription>
            Customize email and SMS notification templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email Templates</TabsTrigger>
              <TabsTrigger value="sms">SMS Templates</TabsTrigger>
            </TabsList>

            {/* Email Templates */}
            <TabsContent value="email" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Email Templates</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetEmailForm}
                    disabled={!editingEmailTemplate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
                
                <Card className="border-dashed">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="emailName">Template Name *</Label>
                      <Input
                        id="emailName"
                        value={emailName}
                        onChange={(e) => setEmailName(e.target.value)}
                        placeholder="e.g., Welcome Email"
                        className="shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emailType">Template Type</Label>
                      <Select
                        value={emailType}
                        onValueChange={setEmailType}
                      >
                        <SelectTrigger className="shadow-sm">
                          <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="emailSubject">Subject Line *</Label>
                      <Input
                        id="emailSubject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="e.g., Welcome to {{company_name}}!"
                        className="shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="emailBody">Email Body *</Label>
                        <Select
                          value=""
                          onValueChange={(value) => insertVariable(value)}
                        >
                          <SelectTrigger className="w-[200px] shadow-sm">
                            <SelectValue placeholder="Insert variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonVariables.map(variable => (
                              <SelectItem key={variable} value={variable}>
                                {variable}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        id="emailBody"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Enter your email content here..."
                        className="shadow-sm"
                        rows={10}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetEmailForm}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSaveEmailTemplate}
                      >
                        {editingEmailTemplate ? 'Update Template' : 'Add Template'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-3 mt-6">
                  <h3 className="text-lg font-semibold">Saved Templates</h3>
                  
                  {emailTemplates.length > 0 ? (
                    emailTemplates.map(template => (
                      <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="outline">
                              {emailTypes.find(t => t.value === template.type)?.label || template.type}
                            </Badge>
                            {!template.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Subject: {template.subject}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleEmailTemplate(template.id)}
                          >
                            {template.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview('email', template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmailTemplate(template)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEmailTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                      <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No email templates created yet</p>
                      <p className="text-sm">Create your first template to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* SMS Templates */}
            <TabsContent value="sms" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">SMS Templates</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetSmsForm}
                    disabled={!editingSmsTemplate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
                
                <Card className="border-dashed">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="smsName">Template Name *</Label>
                      <Input
                        id="smsName"
                        value={smsName}
                        onChange={(e) => setSmsName(e.target.value)}
                        placeholder="e.g., Appointment Reminder"
                        className="shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smsType">Template Type</Label>
                      <Select
                        value={smsType}
                        onValueChange={setSmsType}
                      >
                        <SelectTrigger className="shadow-sm">
                          <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                        <SelectContent>
                          {smsTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="smsMessage">Message *</Label>
                        <Select
                          value=""
                          onValueChange={(value) => insertVariable(value)}
                        >
                          <SelectTrigger className="w-[200px] shadow-sm">
                            <SelectValue placeholder="Insert variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonVariables.map(variable => (
                              <SelectItem key={variable} value={variable}>
                                {variable}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        id="smsMessage"
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Enter your SMS message here..."
                        className="shadow-sm"
                        rows={4}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{smsMessage.length} characters</span>
                        <span>{160 - smsMessage.length} remaining</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetSmsForm}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSaveSmsTemplate}
                      >
                        {editingSmsTemplate ? 'Update Template' : 'Add Template'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-3 mt-6">
                  <h3 className="text-lg font-semibold">Saved Templates</h3>
                  
                  {smsTemplates.length > 0 ? (
                    smsTemplates.map(template => (
                      <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="outline">
                              {smsTypes.find(t => t.value === template.type)?.label || template.type}
                            </Badge>
                            {!template.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {template.message}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSmsTemplate(template.id)}
                          >
                            {template.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview('sms', template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSmsTemplate(template)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSmsTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No SMS templates created yet</p>
                      <p className="text-sm">Create your first template to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Templates
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}