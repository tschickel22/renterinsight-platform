// 🧩 FILE: apps/commission-engine/src/components/CommissionCalculator.tsx

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calculator, DollarSign, Save, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { CommissionRule, CommissionRuleType } from './CommissionRuleForm'
import { ErrorBoundary } from 'react-error-boundary'

interface CommissionCalculatorProps {
  rules: CommissionRule[]
  onSaveCalculation?: (calculationData: any) => Promise<void>
}

export function CommissionCalculator({ rules, onSaveCalculation }: CommissionCalculatorProps) {
  const { toast } = useToast()
  const [dealAmount, setDealAmount] = useState<number>(100000)
  const [selectedRuleId, setSelectedRuleId] = useState<string>('')
  const [calculatedCommission, setCalculatedCommission] = useState<number | null>(null)
  const [calculationBreakdown, setCalculationBreakdown] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCalculatedCommission(null)
    setCalculationBreakdown([])
  }, [selectedRuleId, dealAmount])

  const handleCalculate = () => {
    if (!selectedRuleId || dealAmount <= 0) {
      toast({
        title: 'Input Required',
        description: 'Please select a rule and enter a valid deal amount',
        variant: 'destructive'
      })
      return
    }

    const rule = rules.find(r => r.id === selectedRuleId)
    if (!rule) {
      toast({ title: 'Rule Not Found', description: 'Selected rule not found', variant: 'destructive' })
      return
    }

    try {
      const { commission, breakdown } = calculateCommission(rule, dealAmount)
      setCalculatedCommission(commission)
      setCalculationBreakdown(breakdown)
    } catch {
      toast({ title: 'Calculation Error', description: 'Failed to calculate commission', variant: 'destructive' })
    }
  }

  const calculateCommission = (rule: CommissionRule, amount: number): { commission: number; breakdown: string[] } => {
    const breakdown: string[] = []
    let commission = 0

    switch (rule.type) {
      case 'flat':
        commission = rule.flatAmount ?? 0
        breakdown.push(`Flat: ${formatCurrency(commission)}`)
        break
      case 'percentage':
        const rate = rule.percentageRate ?? 0
        commission = (amount * rate) / 100
        breakdown.push(`${rate}% of ${formatCurrency(amount)} = ${formatCurrency(commission)}`)
        break
      case 'tiered':
        const sortedTiers = [...(rule.tiers ?? [])].sort((a, b) => (a.minAmount ?? 0) - (b.minAmount ?? 0))
        const tier = sortedTiers.find(t => amount >= (t.minAmount ?? 0) && (t.maxAmount == null || amount <= t.maxAmount))
        if (tier?.isPercentage) {
          commission = (amount * (tier.rate ?? 0)) / 100
          breakdown.push(`${tier.rate}% of ${formatCurrency(amount)} = ${formatCurrency(commission)}`)
        } else {
          commission = tier?.rate ?? 0
          breakdown.push(`Flat: ${formatCurrency(commission)}`)
        }
        break
      default:
        breakdown.push('Unknown rule type')
    }

    return { commission, breakdown }
  }

  const handleSave = async () => {
    if (calculatedCommission === null) {
      toast({ title: 'Calculate First', description: 'Calculate before saving', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const rule = rules.find(r => r.id === selectedRuleId)
      await onSaveCalculation?.({
        dealAmount,
        ruleId: selectedRuleId,
        ruleType: rule?.type,
        commission: calculatedCommission,
        breakdown: calculationBreakdown,
        calculatedAt: new Date()
      })
      toast({ title: 'Success', description: 'Saved calculation' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const activeRules = rules.filter(r => r.isActive)

  const renderCalculator = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <Label htmlFor="dealAmount">Deal Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="dealAmount" type="number" min="0" value={dealAmount} onChange={(e) => setDealAmount(parseFloat(e.target.value))} className="pl-10" />
          </div>
        </div>
        <div>
          <Label htmlFor="commissionRule">Commission Rule</Label>
          <Select value={selectedRuleId} onValueChange={setSelectedRuleId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a rule" />
            </SelectTrigger>
            <SelectContent>
              {activeRules.length > 0 ? (
                activeRules.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.type})</SelectItem>)
              ) : <SelectItem value="none" disabled>No rules</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCalculate} disabled={!selectedRuleId || dealAmount <= 0} className="w-full">
          <Calculator className="h-4 w-4 mr-2" /> Calculate
        </Button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">Result</h3>
          {calculatedCommission !== null ? (
            <>
              <div className="text-2xl font-bold text-primary mb-2">{formatCurrency(calculatedCommission)}</div>
              <div className="space-y-1 text-sm">
                {calculationBreakdown.map((line, idx) => (
                  <div key={idx} className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 text-muted-foreground" /> <span>{line}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-muted-foreground">Enter deal amount + rule</p>}
        </div>
        {calculatedCommission !== null && (
          <Button variant="outline" onClick={handleSave} disabled={loading} className="w-full">
            {loading ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save</>}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" /> Commission Calculator
        </CardTitle>
        <CardDescription>Calculate commission based on rules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded">Error loading calculator</div>}>
          {renderCalculator()}
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
