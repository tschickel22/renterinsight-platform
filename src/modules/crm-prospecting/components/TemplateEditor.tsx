import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Mail, MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EmailTemplate {
  id?: string
  name: string
  subject: string
  body: string
  type: string
  variables: string[]
  isActive: boolean
}

interface SMSTemplate {
  id?: string
  name: string
  message: string
  type: string
  variables: string[]
  isActive: boolean
}

interface TemplateEditorProps {
  template?: EmailTemplate | SMSTemplate
  type: 'email' | 'sms'
  onSave: (template: Partial<EmailTemplate | SMSTemplate>) => Promise<void>
  onCancel: () => void
}

export function TemplateEditor({ template, type, onSave, onCancel }: TemplateEditorProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: (template as EmailTemplate)?.subject || '',
    body: (template as EmailTemplate)?.body || (template as SMSTemplate)?.message || '',
    type: template?.type || 'custom',
    variables: template?.variables || [],
    isActive: template?.isActive ?? true
  })
  
  const [newVariable, setNewVariable] = useState('')

  const templateTypes = [
    { value: 'welcome', label: 'Welcome' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'nurture', label: 'Nurture' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'custom', label: 'Custom' }
  ]

  const commonVariables = [
    'first_name',
    'last_name',
    'company_name',
    'rep_name',
    'rep_phone',
    'rep_email',
    'website_url',
    'budget',
    'timeframe'
  ]

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Template name is required',
        variant: 'destructive'
      })
      return
    }

    if (!formData.body.trim()) {
      toast({
        title: 'Validation Error',
        description: `${type === 'email' ? 'Email body' : 'SMS message'} is required`,
        variant: 'destructive'
      })
      return
    }

    if (type === 'email' && !formData.subject.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Email subject is required',
        variant: 'destructive'
      })
      return
    }

    if (type === 'sms' && formData.body.length > 160) {
      toast({
        title: 'Validation Error',
        description: 'SMS message must be 160 characters or less',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const templateData = type === 'email' 
        ? {
            name: formData.name,
            subject: formData.subject,
            body: formData.body,
            type: formData.type,
            variables: formData.variables,
            isActive: formData.isActive
          }
        : {
            name: formData.name,
            message: formData.body,
            type: formData.type,
            variables: formData.variables,
            isActive: formData.isActive
          }

      await onSave(templateData)
      
      toast({
        title: 'Success',
        description: `${type === 'email' ? 'Email' : 'SMS'} template ${template ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${template ? 'update' : 'create'} template`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addVariable = () => {
    if (newVariable.trim() && !formData.variables.includes(newVariable.trim())) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable.trim()]
      }))
      setNewVariable('')
    }
  }

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }))
  }

  const insertVariable = (variable: string) => {
    const variableText = `{{${variable}}}`
    setFormData(prev => ({
      ...prev,
      body: prev.body + variableText
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                {type === 'email' ? (
                  <Mail className="h-5 w-5 mr-2 text-blue-500" />
                ) : (
                  <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                )}
                {template ? 'Edit' : 'Create'} {type === 'email' ? 'Email' : 'SMS'} Template
              </CardTitle>
              <CardDescription>
                {template ? 'Update the template details' : 'Create a new template for automated communications'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Welcome New Lead"
              />
            </div>
            <div>
              <Label htmlFor="type">Template Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email Subject (only for email templates) */}
          {type === 'email' && (
            <div>
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Welcome to {{company_name}}, {{first_name}}!"
              />
            </div>
          )}

          {/* Template Content */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Label htmlFor="body">
                {type === 'email' ? 'Email Body' : 'SMS Message'} *
              </Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder={type === 'email' 
                  ? "Hi {{first_name}},\n\nThank you for your interest in our RV inventory!\n\nBest regards,\n{{rep_name}}"
                  : "Hi {{first_name}}! Thanks for your interest. Call us at {{rep_phone}} - {{rep_name}}"
                }
                rows={type === 'email' ? 12 : 4}
                maxLength={type === 'sms' ? 160 : undefined}
              />
              {type === 'sms' && (
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-muted-foreground">
                    {formData.body.length}/160 characters
                  </div>
                  <div className={`text-xs ${formData.body.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {formData.body.length > 160 && 'Message too long'}
                  </div>
                </div>
              )}
            </div>

            {/* Variables Panel */}
            <div>
              <Label>Variables</Label>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Common Variables:</p>
                  <div className="space-y-1">
                    {commonVariables.map(variable => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertVariable(variable)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Custom Variables:</p>
                  <div className="flex space-x-1 mb-2">
                    <Input
                      value={newVariable}
                      onChange={(e) => setNewVariable(e.target.value)}
                      placeholder="variable_name"
                      className="text-xs"
                      onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                    />
                    <Button size="sm" onClick={addVariable}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.variables.map(variable => (
                      <div key={variable} className="flex items-center justify-between p-1 bg-muted rounded text-xs">
                        <span>{variable}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariable(variable)}
                          className="h-4 w-4 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
            />
            <Label htmlFor="isActive">Active template</Label>
          </div>

          {/* Preview */}
          <div>
            <Label>Preview</Label>
            <div className="mt-2 p-4 bg-muted/30 rounded-lg">
              {type === 'email' && (
                <div className="mb-2">
                  <strong>Subject:</strong> {formData.subject || 'No subject'}
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm">
                {formData.body || `No ${type === 'email' ? 'content' : 'message'}`}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {template ? 'Update' : 'Create'} Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}