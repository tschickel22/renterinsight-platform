import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Trash2 } from 'lucide-react'
import { CustomField, CustomFieldType } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface CustomFieldModalProps {
  field?: CustomField
  onSave: (field: Partial<CustomField>) => Promise<void>
  onCancel: () => void
  modules: string[]
}

export function CustomFieldModal({ field, onSave, onCancel, modules }: CustomFieldModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CustomField>>({
    name: '',
    type: CustomFieldType.TEXT,
    required: false,
    options: [],
    module: '',
    section: ''
  })
  const [newOption, setNewOption] = useState('')

  // Initialize form with field data if editing
  useEffect(() => {
    if (field) {
      setFormData({
        ...field
      })
    }
  }, [field])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.module || !formData.section) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if ((formData.type === CustomFieldType.SELECT || formData.type === CustomFieldType.MULTISELECT) && 
        (!formData.options || formData.options.length === 0)) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one option for select fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Custom field ${field ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${field ? 'update' : 'create'} custom field`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    if (newOption.trim() && !formData.options?.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()]
      }))
      setNewOption('')
    }
  }

  const removeOption = (option: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter(o => o !== option) || []
    }))
  }

  // Common sections for each module
  const getSections = (module: string) => {
    switch (module) {
      case 'crm':
        return ['Lead Information', 'Contact Details', 'Preferences', 'Notes']
      case 'inventory':
        return ['Vehicle Details', 'Specifications', 'Pricing', 'Features']
      case 'quotes':
        return ['Quote Details', 'Terms', 'Pricing']
      case 'agreements':
        return ['Agreement Details', 'Terms', 'Conditions']
      case 'service':
        return ['Service Details', 'Customer Requirements', 'Technical Notes']
      case 'delivery':
        return ['Delivery Details', 'Customer Instructions', 'Logistics']
      case 'invoices':
        return ['Invoice Details', 'Payment Terms', 'Additional Charges']
      default:
        return ['General', 'Details', 'Other']
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{field ? 'Edit Custom Field' : 'Add Custom Field'}</CardTitle>
              <CardDescription>
                {field ? 'Update custom field details' : 'Create a new custom field'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Field Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Customer Budget"
              />
            </div>
            
            <div>
              <Label htmlFor="module">Module *</Label>
              <Select 
                value={formData.module} 
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    module: value,
                    section: '' // Reset section when module changes
                  }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="section">Section *</Label>
              <Select 
                value={formData.section} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                disabled={!formData.module}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.module ? "Select section" : "Select module first"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.module && getSections(formData.module).map(section => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Field Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: CustomFieldType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CustomFieldType.TEXT}>Text</SelectItem>
                  <SelectItem value={CustomFieldType.NUMBER}>Number</SelectItem>
                  <SelectItem value={CustomFieldType.DATE}>Date</SelectItem>
                  <SelectItem value={CustomFieldType.BOOLEAN}>Boolean</SelectItem>
                  <SelectItem value={CustomFieldType.SELECT}>Select</SelectItem>
                  <SelectItem value={CustomFieldType.MULTISELECT}>Multi-select</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(formData.type === CustomFieldType.SELECT || formData.type === CustomFieldType.MULTISELECT) && (
              <div>
                <Label>Options</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add an option"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOption()
                      }
                    }}
                  />
                  <Button type="button" onClick={addOption}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.options?.map((option, index) => (
                    <div key={index} className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
                      <span className="mr-2">{option}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0" 
                        onClick={() => removeOption(option)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {(!formData.options || formData.options.length === 0) && (
                    <div className="text-sm text-muted-foreground">No options added yet</div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: !!checked }))}
              />
              <Label htmlFor="required">Required field</Label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {field ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {field ? 'Update' : 'Create'} Field
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}