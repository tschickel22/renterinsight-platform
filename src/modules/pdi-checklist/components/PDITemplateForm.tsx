import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Save, Plus, Trash2, CheckSquare, ArrowUp, ArrowDown, Clipboard } from 'lucide-react'
import { PDITemplate, PDITemplateSection, PDITemplateItem } from '../types'
import { VehicleType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface PDITemplateFormProps {
  template?: PDITemplate
  onSave: (templateData: Partial<PDITemplate>) => Promise<void>
  onCancel: () => void
}

export function PDITemplateForm({ template, onSave, onCancel }: PDITemplateFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<PDITemplate>>({
    name: '',
    description: '',
    vehicleType: VehicleType.RV,
    isActive: true,
    sections: []
  })

  const [showAddSection, setShowAddSection] = useState(false)
  const [newSection, setNewSection] = useState<Partial<PDITemplateSection>>({
    name: '',
    description: '',
    items: []
  })

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<PDITemplateItem>>({
    name: '',
    description: '',
    itemType: 'checkbox',
    isRequired: true
  })

  // Initialize form with template data if editing
  useEffect(() => {
    if (template) {
      setFormData({
        ...template
      })
    }
  }, [template])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Template name is required',
        variant: 'destructive'
      })
      return
    }

    if (!formData.vehicleType) {
      toast({
        title: 'Validation Error',
        description: 'Vehicle type is required',
        variant: 'destructive'
      })
      return
    }

    if (!formData.sections || formData.sections.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one section is required',
        variant: 'destructive'
      })
      return
    }

    // Check if all sections have at least one item
    const emptySections = formData.sections.filter(section => !section.items || section.items.length === 0)
    if (emptySections.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Section "${emptySections[0].name}" must have at least one item`,
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Template ${template ? 'updated' : 'created'} successfully`,
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

  const addSection = () => {
    if (!newSection.name) {
      toast({
        title: 'Validation Error',
        description: 'Section name is required',
        variant: 'destructive'
      })
      return
    }

    const section: PDITemplateSection = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: template?.id || '',
      name: newSection.name,
      description: newSection.description || '',
      orderIndex: (formData.sections?.length || 0) + 1,
      items: [],
      createdAt: new Date()
    }

    setFormData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), section]
    }))

    setNewSection({
      name: '',
      description: '',
      items: []
    })
    setShowAddSection(false)
  }

  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections?.filter(s => s.id !== sectionId) || []
    }))
  }

  const moveSectionUp = (sectionId: string) => {
    const sections = [...(formData.sections || [])]
    const index = sections.findIndex(s => s.id === sectionId)
    if (index <= 0) return

    // Swap with previous section
    [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]]
    
    // Update order indices
    sections.forEach((section, idx) => {
      section.orderIndex = idx + 1
    })

    setFormData(prev => ({
      ...prev,
      sections
    }))
  }

  const moveSectionDown = (sectionId: string) => {
    const sections = [...(formData.sections || [])]
    const index = sections.findIndex(s => s.id === sectionId)
    if (index === -1 || index >= sections.length - 1) return

    // Swap with next section
    [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
    
    // Update order indices
    sections.forEach((section, idx) => {
      section.orderIndex = idx + 1
    })

    setFormData(prev => ({
      ...prev,
      sections
    }))
  }

  const addItem = (sectionId: string) => {
    if (!newItem.name) {
      toast({
        title: 'Validation Error',
        description: 'Item name is required',
        variant: 'destructive'
      })
      return
    }

    const sections = [...(formData.sections || [])]
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return

    const section = sections[sectionIndex]
    
    const item: PDITemplateItem = {
      id: Math.random().toString(36).substr(2, 9),
      sectionId,
      name: newItem.name,
      description: newItem.description || '',
      itemType: newItem.itemType || 'checkbox',
      isRequired: newItem.isRequired ?? true,
      orderIndex: (section.items?.length || 0) + 1,
      createdAt: new Date()
    }

    section.items = [...(section.items || []), item]
    sections[sectionIndex] = section

    setFormData(prev => ({
      ...prev,
      sections
    }))

    setNewItem({
      name: '',
      description: '',
      itemType: 'checkbox',
      isRequired: true
    })
    setShowAddItem(false)
  }

  const removeItem = (sectionId: string, itemId: string) => {
    const sections = [...(formData.sections || [])]
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return

    const section = sections[sectionIndex]
    section.items = section.items.filter(i => i.id !== itemId)
    sections[sectionIndex] = section

    setFormData(prev => ({
      ...prev,
      sections
    }))
  }

  const moveItemUp = (sectionId: string, itemId: string) => {
    const sections = [...(formData.sections || [])]
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return

    const section = sections[sectionIndex]
    const items = [...section.items]
    const itemIndex = items.findIndex(i => i.id === itemId)
    if (itemIndex <= 0) return

    // Swap with previous item
    [items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]]
    
    // Update order indices
    items.forEach((item, idx) => {
      item.orderIndex = idx + 1
    })

    section.items = items
    sections[sectionIndex] = section

    setFormData(prev => ({
      ...prev,
      sections
    }))
  }

  const moveItemDown = (sectionId: string, itemId: string) => {
    const sections = [...(formData.sections || [])]
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return

    const section = sections[sectionIndex]
    const items = [...section.items]
    const itemIndex = items.findIndex(i => i.id === itemId)
    if (itemIndex === -1 || itemIndex >= items.length - 1) return

    // Swap with next item
    [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]]
    
    // Update order indices
    items.forEach((item, idx) => {
      item.orderIndex = idx + 1
    })

    section.items = items
    sections[sectionIndex] = section

    setFormData(prev => ({
      ...prev,
      sections
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{template ? 'Edit Template' : 'Create Template'}</CardTitle>
              <CardDescription>
                {template ? 'Update PDI template details' : 'Create a new PDI template'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Template Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., RV Pre-Delivery Inspection"
                  />
                </div>
                
                <div>
                  <Label htmlFor="vehicleType">Home/Vehicle Type *</Label>
                  <Select 
                    value={formData.vehicleType} 
                    onValueChange={(value: VehicleType) => setFormData(prev => ({ ...prev, vehicleType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VehicleType.RV}>RV</SelectItem>
                      <SelectItem value={VehicleType.MOTORHOME}>Motorhome</SelectItem>
                      <SelectItem value={VehicleType.TRAVEL_TRAILER}>Travel Trailer</SelectItem>
                      <SelectItem value={VehicleType.FIFTH_WHEEL}>Fifth Wheel</SelectItem>
                      <SelectItem value={VehicleType.TOY_HAULER}>Toy Hauler</SelectItem>
                      <SelectItem value={VehicleType.SINGLE_WIDE}>Single Wide MH</SelectItem>
                      <SelectItem value={VehicleType.DOUBLE_WIDE}>Double Wide MH</SelectItem>
                      <SelectItem value={VehicleType.TRIPLE_WIDE}>Triple Wide MH</SelectItem>
                      <SelectItem value={VehicleType.PARK_MODEL}>Park Model</SelectItem>
                      <SelectItem value={VehicleType.MODULAR_HOME}>Modular Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and scope of this template"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <Label htmlFor="isActive">Active template</Label>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sections</h3>
                <Button type="button" onClick={() => setShowAddSection(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {/* Add Section Form */}
              {showAddSection && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sectionName">Section Name *</Label>
                        <Input
                          id="sectionName"
                          value={newSection.name}
                          onChange={(e) => setNewSection(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Exterior Inspection"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sectionDescription">Description</Label>
                        <Textarea
                          id="sectionDescription"
                          value={newSection.description}
                          onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe this section"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddSection(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={addSection}>
                          Add Section
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sections List */}
              <div className="space-y-6">
                {formData.sections?.map((section) => (
                  <Card key={section.id} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{section.name}</CardTitle>
                          {section.description && (
                            <CardDescription>{section.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveSectionUp(section.id)}
                            disabled={section.orderIndex <= 1}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveSectionDown(section.id)}
                            disabled={section.orderIndex >= (formData.sections?.length || 0)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Items ({section.items.length})</h4>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingSectionId(section.id)
                              setShowAddItem(true)
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Item
                          </Button>
                        </div>

                        {/* Add Item Form */}
                        {showAddItem && editingSectionId === section.id && (
                          <Card className="border-dashed">
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label htmlFor="itemName">Item Name *</Label>
                                    <Input
                                      id="itemName"
                                      value={newItem.name}
                                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="e.g., Check Exterior Body Condition"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="itemType">Item Type</Label>
                                    <Select 
                                      value={newItem.itemType} 
                                      onValueChange={(value: 'checkbox' | 'text' | 'number' | 'photo') => 
                                        setNewItem(prev => ({ ...prev, itemType: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="checkbox">Checkbox</SelectItem>
                                        <SelectItem value="text">Text Input</SelectItem>
                                        <SelectItem value="number">Number Input</SelectItem>
                                        <SelectItem value="photo">Photo Upload</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="itemDescription">Description</Label>
                                  <Textarea
                                    id="itemDescription"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe this inspection item"
                                    rows={2}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="isRequired"
                                    checked={newItem.isRequired}
                                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isRequired: !!checked }))}
                                  />
                                  <Label htmlFor="isRequired">Required item</Label>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                      setShowAddItem(false)
                                      setEditingSectionId(null)
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="button" onClick={() => addItem(section.id)}>
                                    Add Item
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Items List */}
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{item.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.itemType}
                                  </Badge>
                                  {item.isRequired && (
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => moveItemUp(section.id, item.id)}
                                  disabled={item.orderIndex <= 1}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => moveItemDown(section.id, item.id)}
                                  disabled={item.orderIndex >= section.items.length}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeItem(section.id, item.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {section.items.length === 0 && (
                            <div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                              <CheckSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                              <p>No items added yet</p>
                              <p className="text-xs">Add items to this section</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!formData.sections || formData.sections.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Clipboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No sections added yet</p>
                    <p className="text-sm">Add sections to organize your checklist</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {template ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {template ? 'Update' : 'Create'} Template
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