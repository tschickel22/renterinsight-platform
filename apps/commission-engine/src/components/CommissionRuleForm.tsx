import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Trash2, DollarSign, Percent } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export type CommissionRuleType = 'flat' | 'percentage' | 'tiered'

export interface TierLevel {
  id: string
  minAmount: number
  maxAmount: number | null
  rate: number
  isPercentage: boolean
}

export interface CommissionRule {
  id: string
  name: string
  type: CommissionRuleType
  description?: string
  flatAmount?: number
  percentageRate?: number
  tiers?: TierLevel[]
  isActive: boolean
  appliesTo: string[]
  createdAt: Date
  updatedAt: Date
}

interface CommissionRuleFormProps {
  rule?: CommissionRule
  onSave: (rule: Partial<CommissionRule>) => Promise<void>
  onCancel: () => void
}

export function CommissionRuleForm({ rule, onSave, onCancel }: CommissionRuleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CommissionRule>>({
    name: '',
    type: 'percentage',
    description: '',
    flatAmount: 0,
    percentageRate: 10,
    tiers: [],
    isActive: true,
    appliesTo: ['all']
  })

  const [showAddTier, setShowAddTier] = useState(false)
  const [newTier, setNewTier] = useState<Partial<TierLevel>>({
    minAmount: 0,
    maxAmount: null,
    rate: 0,
    isPercentage: true
  })

  // Initialize form with rule data if editing
  useEffect(() => {
    if (rule) {
      setFormData({
        ...rule
      })
    }
  }, [rule])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Rule name is required',
        variant: 'destructive'
      })
      return
    }

    // Validate based on rule type
    if (formData.type === 'flat' && (formData.flatAmount === undefined || formData.flatAmount < 0)) {
      toast({
        title: 'Validation Error',
        description: 'Flat amount must be a positive number',
        variant: 'destructive'
      })
      return
    }

    if (formData.type === 'percentage' && (formData.percentageRate === undefined || formData.percentageRate < 0 || formData.percentageRate > 100)) {
      toast({
        title: 'Validation Error',
        description: 'Percentage rate must be between 0 and 100',
        variant: 'destructive'
      })
      return
    }

    if (formData.type === 'tiered' && (!formData.tiers || formData.tiers.length === 0)) {
      toast({
        title: 'Validation Error',
        description: 'At least one tier is required for tiered commission',
        variant: 'destructive'
      })
      return
    }

    // Validate tiers if present
    if (formData.tiers && formData.tiers.length > 0) {
      // Check for overlapping tiers
      const sortedTiers = [...formData.tiers].sort((a, b) => a.minAmount - b.minAmount)
      for (let i = 0; i < sortedTiers.length - 1; i++) {
        const currentTier = sortedTiers[i]
        const nextTier = sortedTiers[i + 1]
        
        if (currentTier.maxAmount === null) {
          toast({
            title: 'Validation Error',
            description: 'Only the last tier can have an unlimited maximum',
            variant: 'destructive'
          })
          return
        }
        
        if (currentTier.maxAmount >= nextTier.minAmount) {
          toast({
            title: 'Validation Error',
            description: 'Tiers cannot overlap',
            variant: 'destructive'
          })
          return
        }
      }
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Commission rule ${rule ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${rule ? 'update' : 'create'} commission rule`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addTier = () => {
    if (newTier.minAmount === undefined || newTier.rate === undefined) {
      toast({
        title: 'Validation Error',
        description: 'Minimum amount and rate are required',
        variant: 'destructive'
      })
      return
    }

    const tier: TierLevel = {
      id: Math.random().toString(36).substr(2, 9),
      minAmount: newTier.minAmount || 0,
      maxAmount: newTier.maxAmount || null,
      rate: newTier.rate || 0,
      isPercentage: newTier.isPercentage || true
    }

    setFormData(prev => ({
      ...prev,
      tiers: [...(prev.tiers || []), tier]
    }))

    setNewTier({
      minAmount: 0,
      maxAmount: null,
      rate: 0,
      isPercentage: true
    })
    setShowAddTier(false)
  }

  const removeTier = (tierId: string) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers?.filter(t => t.id !== tierId) || []
    }))
  }

  const dealTypes = [
    { value: 'all', label: 'All Deals' },
    { value: 'new', label: 'New Sales' },
    { value: 'used', label: 'Used Sales' },
    { value: 'service', label: 'Service Contracts' },
    { value: 'finance', label: 'Finance Products' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{rule ? 'Edit Commission Rule' : 'Create Commission Rule'}</CardTitle>
              <CardDescription>
                {rule ? 'Update commission rule details' : 'Define a new commission rule'}
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
              <h3 className="text-lg font-semibold">Rule Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Rule Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Standard Sales Commission"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Commission Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: CommissionRuleType) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat Amount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="tiered">Tiered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this commission rule"
                />
              </div>

              <div>
                <Label htmlFor="appliesTo">Applies To</Label>
                <Select 
                  value={formData.appliesTo?.[0] || 'all'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, appliesTo: [value] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dealTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <Label htmlFor="isActive">Active rule</Label>
              </div>
            </div>

            {/* Commission Details based on type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Commission Details</h3>
              
              {formData.type === 'flat' && (
                <div>
                  <Label htmlFor="flatAmount">Flat Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="flatAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.flatAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, flatAmount: parseFloat(e.target.value) || 0 }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              {formData.type === 'percentage' && (
                <div>
                  <Label htmlFor="percentageRate">Percentage Rate</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="percentageRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.percentageRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, percentageRate: parseFloat(e.target.value) || 0 }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              {formData.type === 'tiered' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Tier Levels</Label>
                    <Button type="button" onClick={() => setShowAddTier(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tier
                    </Button>
                  </div>

                  {/* Add Tier Form */}
                  {showAddTier && (
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="minAmount">Minimum Amount</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="minAmount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={newTier.minAmount}
                                onChange={(e) => setNewTier(prev => ({ ...prev, minAmount: parseFloat(e.target.value) || 0 }))}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="maxAmount">Maximum Amount (optional)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="maxAmount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={newTier.maxAmount === null ? '' : newTier.maxAmount}
                                onChange={(e) => setNewTier(prev => ({ 
                                  ...prev, 
                                  maxAmount: e.target.value === '' ? null : parseFloat(e.target.value) || 0 
                                }))}
                                placeholder="No maximum"
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="rate">Rate</Label>
                            <div className="relative">
                              {newTier.isPercentage ? (
                                <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              ) : (
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              )}
                              <Input
                                id="rate"
                                type="number"
                                step="0.01"
                                min="0"
                                value={newTier.rate}
                                onChange={(e) => setNewTier(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                              id="isPercentage"
                              checked={newTier.isPercentage}
                              onCheckedChange={(checked) => setNewTier(prev => ({ ...prev, isPercentage: !!checked }))}
                            />
                            <Label htmlFor="isPercentage">Percentage (vs. flat amount)</Label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button type="button" variant="outline" onClick={() => setShowAddTier(false)}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={addTier}>
                            Add Tier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tiers List */}
                  <div className="space-y-3">
                    {formData.tiers && formData.tiers.length > 0 ? (
                      formData.tiers.map((tier) => (
                        <div key={tier.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                ${tier.minAmount.toLocaleString()} to {tier.maxAmount === null ? 'Unlimited' : `$${tier.maxAmount.toLocaleString()}`}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Rate: {tier.isPercentage ? `${tier.rate}%` : `$${tier.rate.toLocaleString()}`}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTier(tier.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No tiers added yet</p>
                        <p className="text-sm">Add tiers to define commission levels</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                    {rule ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {rule ? 'Update' : 'Create'} Rule
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