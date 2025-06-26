import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calculator, DollarSign, Percent, Save, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { CommissionRule, CommissionRuleType } from './CommissionRuleForm'
import { ErrorBoundary } from 'react-error-boundary'
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

  // Reset calculation when rule or amount changes
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

    const rule = rules?.find(r => r.id === selectedRuleId)
    if (!rule) {
      toast({
        title: 'Rule Not Found',
        description: 'Selected rule not found',
        variant: 'destructive'
      })
      return
    }

    try {
      const { commission, breakdown } = calculateCommission(rule, dealAmount)
      if (commission !== null && breakdown) {
        setCalculatedCommission(commission)
        setCalculationBreakdown(breakdown)
      }
    } catch (error) {
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate commission',
        variant: 'destructive'
      })
    }
  }

  const calculateCommission = (rule: CommissionRule, amount: number): { commission: number, breakdown: string[] } => {
    const breakdown: string[] = []
    let commission = 0

    if (!rule || !rule.type) {
      breakdown.push('Invalid rule configuration')
      return { commission: 0, breakdown }
    }

    switch (rule.type) {
      case 'flat':
        commission = rule.flatAmount ?? 0
        breakdown.push(`Flat commission: ${formatCurrency(commission)}`)
        break
        
      case 'percentage':
        const rate = rule.percentageRate ?? 0
        commission = (amount * rate) / 100
        breakdown.push(`${rate}% of ${formatCurrency(amount)} = ${formatCurrency(commission)}`)
        break
        
      case 'tiered':
        if (!Array.isArray(rule.tiers) || rule.tiers.length === 0) {
          breakdown.push('No tiers defined for this rule')
          break
        }
        
        // Sort tiers by min amount
        const sortedTiers = [...rule.tiers].sort((a, b) => (a?.minAmount ?? 0) - (b?.minAmount ?? 0))
        
        // Find applicable tier
        let applicableTier = sortedTiers[0] ?? { minAmount: 0, maxAmount: null, rate: 0, isPercentage: true }
        for (const tier of sortedTiers) {
          if (tier && amount >= (tier.minAmount ?? 0) && (tier.maxAmount === null || amount <= tier.maxAmount)) {
            applicableTier = tier
            break
          }
        }
        
        if (applicableTier?.isPercentage) {
          const tierRate = applicableTier.rate ?? 0
          commission = (amount * tierRate) / 100
          breakdown.push(`Tier: $${(applicableTier.minAmount ?? 0).toLocaleString()} to ${applicableTier.maxAmount === null ? 'Unlimited' : '$' + applicableTier.maxAmount.toLocaleString()}`)
          breakdown.push(`${tierRate}% of ${formatCurrency(amount)} = ${formatCurrency(commission)}`)
        } else {
          commission = applicableTier?.rate ?? 0
          breakdown.push(`Tier: $${(applicableTier?.minAmount ?? 0).toLocaleString()} to ${applicableTier?.maxAmount === null ? 'Unlimited' : '$' + (applicableTier?.maxAmount ?? 0).toLocaleString()}`)
          breakdown.push(`Flat amount: ${formatCurrency(commission)}`)
        }
        break
        
      default:
        breakdown.push('Unknown rule type')
    }

    return { commission, breakdown }
  }

  const handleSave = async () => {
    if (calculatedCommission === null) {
      toast({
        title: 'Calculate First',
        description: 'Please calculate commission first',
        variant: 'destructive'
      })
      return
    }

    if (!onSaveCalculation) return

    setLoading(true)
    try {
      const rule = rules?.find(r => r.id === selectedRuleId)
      
      if (rule) {
        await onSaveCalculation({
          dealAmount,
          ruleId: selectedRuleId,
          ruleName: rule.name,
          ruleType: rule.type,
          commission: calculatedCommission,
          breakdown: calculationBreakdown,
          calculatedAt: new Date()
        })
      }
      
      toast({
        title: 'Success',
        description: 'Commission calculation saved',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save calculation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter to only active rules
  const activeRules = Array.isArray(rules) ? rules.filter(rule => rule?.isActive) : []

  const renderCalculator = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="dealAmount">Deal Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="dealAmount"
              type="number"
              min="0"
              step="0.01"
              value={dealAmount}
              onChange={(e) => setDealAmount(parseFloat(e.target.value) || 0)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="commissionRule">Commission Rule</Label>
          <Select value={selectedRuleId} onValueChange={setSelectedRuleId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a commission rule" />
            </SelectTrigger>
            <SelectContent>
              {activeRules.length > 0 ? (
                activeRules.map(rule => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.name} ({rule.type})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No active rules available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleCalculate} 
          disabled={!selectedRuleId || dealAmount <= 0}
          className="w-full"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Commission
        </Button>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">Calculation Result</h3>
          
          {calculatedCommission !== null ? (
            <>
              <div className="text-2xl font-bold text-primary mb-2">
                {formatCurrency(calculatedCommission)}
              </div>
              
              <div className="space-y-1 text-sm">
                {calculationBreakdown.map((line, index) => (
                  <div key={index} className="flex items-center">
                    {index === 0 ? (
                      <ArrowRight className="h-3 w-3 mr-1 text-muted-foreground" />
                    ) : (
                      <span className="w-4"></span>
                    )}
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>Enter deal amount and select a rule to calculate commission</p>
            </div>
          )}
        </div>
        
        {calculatedCommission !== null && onSaveCalculation && (
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Calculation
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" />
          Commission Calculator
        </CardTitle>
        <CardDescription>
          Calculate potential commission based on deal amount
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading calculator. Please try refreshing the page.</div>}>
          {renderCalculator()}
        </ErrorBoundary>
      </CardContent>
    </Card>
  )

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" />
          Commission Calculator
        </CardTitle>
        <CardDescription>
          Calculate potential commission based on deal amount
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading calculator. Please try refreshing the page.</div>}>
          {renderCalculator()}
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}