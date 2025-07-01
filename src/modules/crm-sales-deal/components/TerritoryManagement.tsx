import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, MapPin, Users, X, Save, Edit, Trash2 } from 'lucide-react'
import { Territory, TerritoryType, TerritoryRule, Deal } from '../types'
import { cn } from '@/lib/utils'

interface TerritoryManagementProps {
  territories: Territory[]
  salesReps: any[] // Using the existing sales reps from the system
  deals: Deal[]
  onCreateTerritory: (territory: Partial<Territory>) => void
  onUpdateTerritory: (id: string, territory: Partial<Territory>) => void
  onDeleteTerritory: (id: string) => void
}

export function TerritoryManagement({ territories, salesReps, deals, onCreateTerritory, onUpdateTerritory, onDeleteTerritory }: TerritoryManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null)
  const [formData, setFormData] = useState<Partial<Territory>>({
    name: '',
    type: TerritoryType.GEOGRAPHIC,
    description: '',
    assignedTo: [],
    rules: [],
    isActive: true
  })
  const [newRule, setNewRule] = useState<Partial<TerritoryRule>>({
    field: '',
    operator: 'equals',
    value: '',
    priority: 1
  })

  const handleCreateTerritory = () => {
    setEditingTerritory(null)
    setFormData({
      name: '',
      type: TerritoryType.GEOGRAPHIC,
      description: '',
      assignedTo: [],
      rules: [],
      isActive: true
    })
    setShowForm(true)
  }

  const handleEditTerritory = (territory: Territory) => {
    setEditingTerritory(territory)
    setFormData({
      name: territory.name,
      type: territory.type,
      description: territory.description,
      assignedTo: [...territory.assignedTo],
      rules: [...territory.rules],
      isActive: territory.isActive
    })
    setShowForm(true)
  }

  const handleSaveTerritory = () => {
    if (!formData.name) return

    if (editingTerritory) {
      onUpdateTerritory(editingTerritory.id, formData)
    } else {
      onCreateTerritory(formData)
    }

    setShowForm(false)
    setEditingTerritory(null)
    setFormData({
      name: '',
      type: TerritoryType.GEOGRAPHIC,
      description: '',
      assignedTo: [],
      rules: [],
      isActive: true
    })
  }

  const handleAddRule = () => {
    if (!newRule.field || !newRule.operator) return

    const rule: TerritoryRule = {
      id: Math.random().toString(36).substr(2, 9),
      field: newRule.field,
      operator: newRule.operator as any,
      value: newRule.value,
      priority: newRule.priority || 1
    }

    setFormData(prev => ({
      ...prev,
      rules: [...(prev.rules || []), rule]
    }))

    setNewRule({
      field: '',
      operator: 'equals',
      value: '',
      priority: 1
    })
  }

  const handleRemoveRule = (ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules?.filter(r => r.id !== ruleId) || []
    }))
  }

  const handleRepAssignment = (repId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        assignedTo: [...(prev.assignedTo || []), repId]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        assignedTo: prev.assignedTo?.filter(id => id !== repId) || []
      }))
    }
  }

  const getTerritoryCoverage = (territoryId: string) => {
    const territoryDeals = deals.filter(d => d.territoryId === territoryId)
    return territoryDeals.length
  }

  const getTerritorySalesReps = (territoryId: string) => {
    const territory = territories.find(t => t.id === territoryId)
    if (!territory) return []
    
    return salesReps.filter(rep => territory.assignedTo.includes(rep.id))
  }

  return (
    <div className="space-y-6">
      {/* Territory Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editingTerritory ? 'Edit Territory' : 'Create Territory'}</CardTitle>
                  <CardDescription>
                    {editingTerritory ? 'Update territory details and rules' : 'Define a new sales territory'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Territory Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., North Region"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Territory Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: TerritoryType) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TerritoryType.GEOGRAPHIC}>Geographic</SelectItem>
                      <SelectItem value={TerritoryType.INDUSTRY}>Industry</SelectItem>
                      <SelectItem value={TerritoryType.ACCOUNT_SIZE}>Account Size</SelectItem>
                      <SelectItem value={TerritoryType.PRODUCT_LINE}>Product Line</SelectItem>
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
                  placeholder="Describe the territory"
                  rows={3}
                />
              </div>

              {/* Territory Rules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Territory Rules</Label>
                </div>

                <div className="space-y-4">
                  {formData.rules?.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{rule.field}</span>
                          <span className="text-muted-foreground">{rule.operator}</span>
                          <span>{rule.value.toString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Priority: {rule.priority}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}

                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label>Field</Label>
                          <Select
                            value={newRule.field}
                            onValueChange={(value) => setNewRule(prev => ({ ...prev, field: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="state">State</SelectItem>
                              <SelectItem value="zipCode">Zip Code</SelectItem>
                              <SelectItem value="country">Country</SelectItem>
                              <SelectItem value="industry">Industry</SelectItem>
                              <SelectItem value="dealSize">Deal Size</SelectItem>
                              <SelectItem value="productType">Product Type</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Operator</Label>
                          <Select
                            value={newRule.operator}
                            onValueChange={(value) => setNewRule(prev => ({ ...prev, operator: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="starts_with">Starts With</SelectItem>
                              <SelectItem value="in_range">In Range</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Value</Label>
                        <Input
                          value={newRule.value?.toString() || ''}
                          onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="Rule value"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          For multiple values, separate with commas
                        </p>
                      </div>

                      <div className="mt-4">
                        <Label>Priority</Label>
                        <Select
                          value={newRule.priority?.toString() || '1'}
                          onValueChange={(value) => setNewRule(prev => ({ ...prev, priority: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Highest</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 - Lowest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button onClick={handleAddRule}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Rule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sales Rep Assignment */}
              <div>
                <Label className="mb-2 block">Assign Sales Reps</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                  {salesReps.map((rep) => (
                    <div key={rep.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rep-${rep.id}`}
                        checked={formData.assignedTo?.includes(rep.id)}
                        onCheckedChange={(checked) => handleRepAssignment(rep.id, !!checked)}
                      />
                      <Label htmlFor={`rep-${rep.id}`} className="text-sm cursor-pointer">
                        {rep.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <Label htmlFor="isActive">Active territory</Label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTerritory}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingTerritory ? 'Update' : 'Create'} Territory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Territory Management</h2>
          <p className="text-muted-foreground">
            Define and manage sales territories and assignment rules
          </p>
        </div>
        <Button onClick={handleCreateTerritory}>
          <Plus className="h-4 w-4 mr-2" />
          Create Territory
        </Button>
      </div>

      <div className="space-y-6">
        {territories.map((territory) => (
          <Card key={territory.id} className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <CardTitle>{territory.name}</CardTitle>
                    <Badge className={territory.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                      {territory.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{territory.type.replace('_', ' ')}</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {territory.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTerritory(territory)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Territory Rules</h3>
                  <div className="space-y-2">
                    {territory.rules.map((rule) => (
                      <div key={rule.id} className="p-2 bg-muted/30 rounded-lg text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{rule.field}</span>
                          <span className="text-muted-foreground">{rule.operator}</span>
                          <span>{rule.value.toString()}</span>
                        </div>
                      </div>
                    ))}
                    {territory.rules.length === 0 && (
                      <p className="text-sm text-muted-foreground">No rules defined</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">Assigned Sales Reps</h3>
                  <div className="space-y-2">
                    {getTerritorySalesReps(territory.id).map((rep) => (
                      <div key={rep.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{rep.name}</span>
                      </div>
                    ))}
                    {territory.assignedTo.length === 0 && (
                      <p className="text-sm text-muted-foreground">No reps assigned</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">Territory Stats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-700">Deals</span>
                      <span className="font-bold text-blue-700">{getTerritoryCoverage(territory.id)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">Reps</span>
                      <span className="font-bold text-green-700">{territory.assignedTo.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {territories.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Territories Defined</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create territories to organize your sales team and deals by region, industry, or other criteria.
              </p>
              <Button onClick={handleCreateTerritory}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Territory
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}