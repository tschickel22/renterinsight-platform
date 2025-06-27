import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, DollarSign, Percent, Calculator } from 'lucide-react'
import { Commission, CommissionType } from '@/types'
import { CommissionRule, FlatCommissionRule, PercentageCommissionRule, TieredCommissionRule } from '../types'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

interface CommissionFormProps {
  commission?: Commission
  salesReps: any[] // Using existing sales rep data
  deals: any[] // Using existing deal data
  rules: CommissionRule[]
  onSave: (commissionData: Partial<Commission>, notes?: string) => Promise<void>
  onCancel: () => void
}

export function CommissionForm({ commission, salesReps, deals, rules, onSave, onCancel }: CommissionFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Commission>>({
    salesPersonId: '',
    dealId: '',
    type: CommissionType.PERCENTAGE,
    rate: 0.05,
    amount: 0,
    notes: ''
  })
  const [selectedRuleId, setSelectedRuleId] = useState<string>('')
  const [dealValue, setDealValue] = useState<number>(0)
  const [notes, setNotes] = useState('')

  // Initialize form with commission data if editing
  useEffect(() => {
    if (commission) {
      setFormData({
        ...commission
      })
      setNotes('')
      
      // Try to find the deal to set the deal value
      const deal = deals.find(d => d.id === commission.dealId)
      if (deal) {
        setDealValue(deal.value)
      }
    }
  }, [commission, deals])

  // Update deal value when deal is selected
  useEffect(() => {
    if (formData.dealId) {
      const deal = deals.find(d => d.id === formData.dealId)
      if (deal) {
        setDealValue(deal.value)
      }
    }
  }, [formData.dealId, deals])

  // Calculate commission amount when rule, deal value, or rate changes
  useEffect(() => {
    if (selectedRuleId) {
      const rule = rules.find(r => r.id === selectedRuleId)
      if (!rule) return

      let calculatedAmount = 0

      switch (rule.type) {
        case 'flat':
          calculatedAmount = (rule as FlatCommissionRule).amount
          setFormData(prev => ({
            ...prev,
            type: CommissionType.FLAT,
            rate: 0,
            amount: calculatedAmount
          }))
          break
        
        case 'percentage':
          const rate = (rule as PercentageCommissionRule).rate
          calculatedAmount = dealValue * rate
          setFormData(prev => ({
            ...prev,
            type: CommissionType.PERCENTAGE,
            rate,
            amount: calculatedAmount
          }))
          break
        
        case 'tiered':
          const tiers = (rule as TieredCommissionRule).tiers
          const applicableTier = tiers.find(tier => 
            dealValue >= tier.minAmount && 
            (tier.maxAmount === undefined || dealValue < tier.maxAmount)
          )
          if (applicableTier) {
            calculatedAmount = dealValue * applicableTier.rate
            setFormData(prev => ({
              ...prev,
              type: CommissionType.TIERED,
              rate: applicableTier.rate,
              amount: calculatedAmount
            }))
          }
          break
      }
    } else if (formData.type === CommissionType.PERCENTAGE) {
      // Manual calculation for percentage type
      const calculatedAmount = dealValue * (formData.rate || 0)
      setFormData(prev => ({
        ...prev,
        amount: calculatedAmount
      }))
    }
  }, [selectedRuleId, dealValue, formData.rate, formData.type, rules])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.salesPersonId || !formData.dealId) {
      toast({
        title: 'Validation Error',
        description: 'Sales rep and deal are required',
        variant: 'destructive'
      })
      return
    }

    if (formData.amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Commission amount must be greater than zero',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData, notes)
      toast({
        title: 'Success',
        description: `Commission ${commission ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${commission ? 'update' : 'create'} commission`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRuleSelect = (ruleId: string) => {
    setSelectedRuleId(ruleId)
  }

  const handleManualCalculation = () => {
    if (formData.type === CommissionType.PERCENTAGE) {
      const calculatedAmount = dealValue * (formData.rate || 0)
      setFormData(prev => ({
        ...prev,
        amount: calculatedAmount
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{commission ? 'Edit Commission' : 'Create Commission'}</CardTitle>
              <CardDescription>
                {commission ? 'Update commission details' : 'Create a new commission record'}
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="salesPersonId">Sales Rep *</Label>
                  <Select 
                    value={formData.salesPersonId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, salesPersonId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales rep" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {salesReps.map(rep => (
                        <SelectItem key={rep.id} value={rep.id}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dealId">Deal *</Label>
                  <Select 
                    value={formData.dealId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dealId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {deals.map(deal => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.name} - {formatCurrency(deal.value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="commissionRule">Commission Rule</Label>
                <Select 
                  value={selectedRuleId} 
                  onValueChange={handleRuleSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule or enter manually" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="">Manual Entry</SelectItem>
                    {rules.filter(r => r.isActive).map(rule => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.name} ({rule.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dealValue">Deal Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dealValue"
                      type="number"
                      value={dealValue}
                      onChange={(e) => setDealValue(parseFloat(e.target.value) || 0)}
                      className="pl-10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="commissionType">Commission Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: CommissionType) => setFormData(prev => ({ ...prev, type: value }))}
                    disabled={!!selectedRuleId}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value={CommissionType.FLAT}>Flat</SelectItem>
                      <SelectItem value={CommissionType.PERCENTAGE}>Percentage</SelectItem>
                      <SelectItem value={CommissionType.TIERED}>Tiered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.type === CommissionType.PERCENTAGE && !selectedRuleId && (
                <div>
                  <Label htmlFor="rate">Commission Rate (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rate"
                      type="number"
                      value={formData.rate ? formData.rate * 100 : ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        rate: parseFloat(e.target.value) / 100 || 0
                      }))}
                      className="pl-10"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {formData.type === CommissionType.FLAT && !selectedRuleId && (
                <div>
                  <Label htmlFor="amount">Flat Commission Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        amount: parseFloat(e.target.value) || 0
                      }))}
                      className="pl-10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {!selectedRuleId && formData.type === CommissionType.PERCENTAGE && (
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleManualCalculation}
                    size="sm"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate
                  </Button>
                </div>
              )}

              <div>
                <Label htmlFor="commissionAmount">Commission Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="commissionAmount"
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0
                    }))}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Commission Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this commission"
                  rows={3}
                />
              </div>

              {commission && (
                <div>
                  <Label htmlFor="auditNotes">Audit Notes</Label>
                  <Textarea
                    id="auditNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this update (for audit trail)"
                    rows={2}
                  />
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
                    {commission ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {commission ? 'Update' : 'Create'} Commission
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