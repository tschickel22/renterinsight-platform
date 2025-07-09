import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, Plus, Trash2, DollarSign, Percent } from 'lucide-react'
import { CommissionRule, FlatCommissionRule, PercentageCommissionRule, TieredCommissionRule, CommissionTier } from '../types'
import { useToast } from '@/hooks/use-toast'

interface CommissionRuleFormProps {
  rule?: CommissionRule
  onSave: (ruleData: Partial<CommissionRule>) => Promise<void>
  onCancel: () => void
}

export function CommissionRuleForm({ rule, onSave, onCancel }: CommissionRuleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ruleType, setRuleType] = useState<'flat' | 'percentage' | 'tiered'>(
    rule?.type || 'percentage'
  )
  const [name, setName] = useState(rule?.name || '')
  const [isActive, setIsActive] = useState(rule?.isActive !== false)
  
  // Flat rule
  const [flatAmount, setFlatAmount] = useState(
    rule?.type === 'flat' ? (rule as FlatCommissionRule).amount : 500
  )
  
  // Percentage rule
  const [percentageRate, setPercentageRate] = useState(
    rule?.type === 'percentage' ? (rule as PercentageCommissionRule).rate : 0.05
  )
  
  // Tiered rule
  const [tiers, setTiers] = useState<CommissionTier[]>(
    rule?.type === 'tiered' 
      ? (rule as TieredCommissionRule).tiers 
      : [
          { id: '1', ruleId: '', minAmount: 0, maxAmount: 50000, rate: 0.03 },
          { id: '2', ruleId: '', minAmount: 50000, maxAmount: 100000, rate: 0.05 },
          { id: '3', ruleId: '', minAmount: 100000, rate: 0.07 }
        ]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name) {
      toast({
        title: 'Validation Error',
        description: 'Rule name is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      let ruleData: Partial<CommissionRule>

      switch (ruleType) {
        case 'flat':
          ruleData = {
            name,
            type: 'flat',
            amount: flatAmount,
            isActive
          } as Partial<FlatCommissionRule>
          break
        
        case 'percentage':
          ruleData = {
            name,
            type: 'percentage',
            rate: percentageRate,
            isActive
          } as Partial<PercentageCommissionRule>
          break
        
        case 'tiered':
          // Validate tiers
          for (let i = 0; i < tiers.length; i++) {
            if (i < tiers.length - 1 && tiers[i].maxAmount !== tiers[i+1].minAmount) {
              toast({
                title: 'Validation Error',
                description: 'Tier ranges must be continuous without gaps',
                variant: 'destructive'
              })
              return
            }
          }
          
          ruleData = {
            name,
            type: 'tiered',
            tiers,
            isActive
          } as Partial<TieredCommissionRule>
          break
        
        default:
          throw new Error('Invalid rule type')
      }

      await onSave(ruleData)
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
    if (tiers.length === 0) {
      setTiers([
        { id: '1', ruleId: '', minAmount: 0, rate: 0.03 }
      ])
      return
    }

    const lastTier = tiers[tiers.length - 1]
    const newTier: CommissionTier = {
      id: Math.random().toString(36).substr(2, 9),
      ruleId: '',
      minAmount: lastTier.maxAmount || lastTier.minAmount + 50000,
      rate: lastTier.rate + 0.01
    }

    setTiers([...tiers, newTier])
  }

  const removeTier = (tierId: string) => {
    setTiers(tiers.filter(tier => tier.id !== tierId))
  }

  const updateTier = (tierId: string, updates: Partial<CommissionTier>) => {
    setTiers(tiers.map(tier => 
      tier.id === tierId ? { ...tier, ...updates } : tier
    ))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{rule ? 'Edit Commission Rule' : 'Create Commission Rule'}</CardTitle>
              <CardDescription>
                {rule ? 'Update commission rule details' : 'Define a new commission calculation rule'}
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
              <div>
                <Label htmlFor="name">Rule Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Standard Sales Commission"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Commission Type</Label>
                <Select
                  value={ruleType}
                  onValueChange={(value: 'flat' | 'percentage' | 'tiered') => setRuleType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="tiered">Tiered Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rule Type Specific Fields */}
            {ruleType === 'flat' && (
              <div className="space-y-4">
                <Label htmlFor="flatAmount">Flat Commission Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="flatAmount"
                    type="number"
                    value={flatAmount}
                    onChange={(e) => setFlatAmount(parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  A fixed amount will be paid regardless of the deal value
                </p>
              </div>
            )}

            {ruleType === 'percentage' && (
              <div className="space-y-4">
                <Label htmlFor="percentageRate">Commission Rate (%)</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="percentageRate"
                    type="number"
                    value={percentageRate * 100}
                    onChange={(e) => setPercentageRate(parseFloat(e.target.value) / 100 || 0)}
                    className="pl-10"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  A percentage of the deal value will be paid as commission
                </p>
              </div>
            )}

            {ruleType === 'tiered' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Tiered Commission Rates</Label>
                  <Button type="button" onClick={addTier} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {tiers.map((tier, index) => (
                    <div key={tier.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Min Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                            <Input
                              type="number"
                              value={tier.minAmount}
                              onChange={(e) => updateTier(tier.id, { minAmount: parseFloat(e.target.value) || 0 })}
                              className="pl-7 h-9 text-sm"
                              min="0"
                              step="1000"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Max Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                            <Input
                              type="number"
                              value={tier.maxAmount}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined
                                updateTier(tier.id, { maxAmount: value })
                              }}
                              className="pl-7 h-9 text-sm"
                              min={tier.minAmount}
                              step="1000"
                              placeholder={index === tiers.length - 1 ? "No limit" : ""}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Rate (%)</Label>
                          <div className="relative">
                            <Percent className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                            <Input
                              type="number"
                              value={tier.rate * 100}
                              onChange={(e) => updateTier(tier.id, { rate: parseFloat(e.target.value) / 100 || 0 })}
                              className="pl-7 h-9 text-sm"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTier(tier.id)}
                        disabled={tiers.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}

                  {tiers.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p>No tiers defined</p>
                      <p className="text-sm">Click "Add Tier" to create commission tiers</p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Different commission rates will apply based on the deal value tiers
                </p>
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
              />
              <Label htmlFor="isActive">Active rule</Label>
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