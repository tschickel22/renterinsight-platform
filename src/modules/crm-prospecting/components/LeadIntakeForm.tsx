import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plus, Save, X } from 'lucide-react'
import { LeadIntakeForm, LeadFormField, LeadSource } from '../types'
import { useLeadManagement } from '../hooks/useLeadManagement'

interface LeadIntakeFormProps {
  form?: LeadIntakeForm
  sources: LeadSource[]
  onSave: (formData: Partial<LeadIntakeForm>) => void
  onCancel: () => void
}

export function LeadIntakeFormBuilder({ form, sources, onSave, onCancel }: LeadIntakeFormProps) {
  const [formData, setFormData] = useState<Partial<LeadIntakeForm>>(form || {
    name: '',
    description: '',
    sourceId: '',
    fields: [],
    isActive: true
  })

  const [newField, setNewField] = useState<Partial<LeadFormField>>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    order: (formData.fields?.length || 0) + 1,
    isActive: true
  })

  const [showAddField, setShowAddField] = useState(false)

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'select', label: 'Select' },
    { value: 'multiselect', label: 'Multi-Select' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'checkbox', label: 'Checkbox' }
  ]

  const addField = () => {
    if (!newField.name || !newField.label) return

    const field: LeadFormField = {
      id: Math.random().toString(36).substr(2, 9),
      name: newField.name,
      label: newField.label,
      type: newField.type || 'text',
      required: newField.required || false,
      options: newField.options,
      placeholder: newField.placeholder,
      validation: newField.validation,
      order: newField.order || 1,
      isActive: true
    }

    setFormData(prev => ({
      ...prev,
      fields: [...(prev.fields || []), field]
    }))

    setNewField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      order: (formData.fields?.length || 0) + 2,
      isActive: true
    })
    setShowAddField(false)
  }

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields?.filter(f => f.id !== fieldId) || []
    }))
  }

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fields = [...(formData.fields || [])]
    const index = fields.findIndex(f => f.id === fieldId)
    
    if (direction === 'up' && index > 0) {
      [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]]
    } else if (direction === 'down' && index < fields.length - 1) {
      [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]]
    }

    // Update order values
    fields.forEach((field, idx) => {
      field.order = idx + 1
    })

    setFormData(prev => ({ ...prev, fields }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Configuration</CardTitle>
          <CardDescription>
            Configure the lead intake form settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Website Contact Form"
              />
            </div>
            <div>
              <Label htmlFor="form-source">Lead Source</Label>
              <Select
                value={formData.sourceId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sourceId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose of this form"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="form-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
            />
            <Label htmlFor="form-active">Active</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>
                Configure the fields for this lead intake form
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddField(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.fields?.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{field.label}</span>
                    <Badge variant="secondary">{field.type}</Badge>
                    {field.required && <Badge variant="destructive">Required</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Field name: {field.name}
                    {field.placeholder && ` • Placeholder: ${field.placeholder}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveField(field.id, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveField(field.id, 'down')}
                    disabled={index === (formData.fields?.length || 0) - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeField(field.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {showAddField && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="field-name">Field Name</Label>
                      <Input
                        id="field-name"
                        value={newField.name}
                        onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., budget"
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-label">Field Label</Label>
                      <Input
                        id="field-label"
                        value={newField.label}
                        onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Budget Range"
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-type">Field Type</Label>
                      <Select
                        value={newField.type}
                        onValueChange={(value: any) => setNewField(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="field-placeholder">Placeholder</Label>
                      <Input
                        id="field-placeholder"
                        value={newField.placeholder}
                        onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                        placeholder="e.g., Enter your budget range"
                      />
                    </div>
                  </div>
                  
                  {(newField.type === 'select' || newField.type === 'multiselect') && (
                    <div className="mt-4">
                      <Label htmlFor="field-options">Options (comma-separated)</Label>
                      <Input
                        id="field-options"
                        value={newField.options?.join(', ') || ''}
                        onChange={(e) => setNewField(prev => ({ 
                          ...prev, 
                          options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                        }))}
                        placeholder="e.g., Under $50k, $50k-$100k, $100k-$150k"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="field-required"
                      checked={newField.required}
                      onCheckedChange={(checked) => setNewField(prev => ({ ...prev, required: !!checked }))}
                    />
                    <Label htmlFor="field-required">Required field</Label>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowAddField(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addField}>
                      Add Field
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Form
        </Button>
      </div>
    </div>
  )
}

interface DynamicLeadFormProps {
  form: LeadIntakeForm
  onSubmit: (data: Record<string, any>) => void
}

export function DynamicLeadForm({ form, onSubmit }: DynamicLeadFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    
    // Validate required fields
    form.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const renderField = (field: LeadFormField) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]

    const updateValue = (newValue: any) => {
      setFormData(prev => ({ ...prev, [field.name]: newValue }))
      if (error) {
        setErrors(prev => ({ ...prev, [field.name]: '' }))
      }
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={updateValue}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value}
              onCheckedChange={updateValue}
            />
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )

      case 'date':
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        {form.description && (
          <CardDescription>{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {form.fields
            .sort((a, b) => a.order - b.order)
            .filter(field => field.isActive)
            .map(renderField)}
          
          <Button type="submit" className="w-full">
            Submit Lead
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}