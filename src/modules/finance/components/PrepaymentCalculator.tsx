import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Calculator, TrendingDown, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface PrepaymentCalculatorProps {
  loanAmount: number
  interestRate: number
  loanTerm: number
  monthlyPayment: number
  amortizationSchedule: any[]
  onCalculate?: (results: any) => void
}

export function PrepaymentCalculator({
  loanAmount,
  interestRate,
  loanTerm,
  monthlyPayment,
  amortizationSchedule,
  onCalculate
}: PrepaymentCalculatorProps) {
  const { toast } = useToast()
  const [prepaymentType, setPrepaymentType] = useState('one_time')
  const [prepaymentAmount, setPrepaymentAmount] = useState(5000)
  const [prepaymentFrequency, setPrepaymentFrequency] = useState('monthly')
  const [prepaymentStartMonth, setPrepaymentStartMonth] = useState(1)
  const [applyTowards, setApplyTowards] = useState('principal')
  
  // Results
  const [newLoanTerm, setNewLoanTerm] = useState(0)
  const [totalInterestSaved, setTotalInterestSaved] = useState(0)
  const [totalPaymentSaved, setTotalPaymentSaved] = useState(0)
  const [newAmortizationSchedule, setNewAmortizationSchedule] = useState<any[]>([])

  useEffect(() => {
    if (amortizationSchedule.length > 0) {
      calculatePrepayment()
    }
  }, [prepaymentType, prepaymentAmount, prepaymentFrequency, prepaymentStartMonth, applyTowards, amortizationSchedule])

  const calculatePrepayment = () => {
    if (!amortizationSchedule.length) return
    
    // Clone the original schedule
    let newSchedule = JSON.parse(JSON.stringify(amortizationSchedule))
    
    // Calculate monthly interest rate
    const monthlyRate = interestRate / 100 / 12
    
    // Apply prepayments based on type
    if (prepaymentType === 'one_time') {
      // One-time prepayment
      if (prepaymentStartMonth <= newSchedule.length) {
        // Apply the prepayment
        applyPrepayment(newSchedule, prepaymentStartMonth - 1, prepaymentAmount)
      }
    } else {
      // Recurring prepayment
      let frequency = 1 // monthly
      if (prepaymentFrequency === 'quarterly') frequency = 3
      if (prepaymentFrequency === 'annually') frequency = 12
      
      for (let i = prepaymentStartMonth - 1; i < newSchedule.length; i += frequency) {
        applyPrepayment(newSchedule, i, prepaymentAmount)
      }
    }
    
    // Calculate new loan term and savings
    const originalTotalPayments = loanTerm * monthlyPayment
    const originalTotalInterest = originalTotalPayments - loanAmount
    
    const newTotalPayments = newSchedule.reduce((sum, payment) => sum + payment.payment, 0)
    const newTotalInterest = newTotalPayments - loanAmount
    
    const interestSaved = originalTotalInterest - newTotalInterest
    const paymentsSaved = originalTotalPayments - newTotalPayments
    
    // Find the new loan term (last month with a balance > 0)
    const lastPaymentIndex = newSchedule.findIndex(payment => payment.balance <= 0)
    const newTerm = lastPaymentIndex !== -1 ? lastPaymentIndex + 1 : newSchedule.length
    
    setNewLoanTerm(newTerm)
    setTotalInterestSaved(interestSaved)
    setTotalPaymentSaved(paymentsSaved)
    setNewAmortizationSchedule(newSchedule.slice(0, newTerm))
    
    if (onCalculate) {
      onCalculate({
        newLoanTerm: newTerm,
        totalInterestSaved: interestSaved,
        totalPaymentSaved: paymentsSaved,
        newAmortizationSchedule: newSchedule.slice(0, newTerm)
      })
    }
  }

  const applyPrepayment = (schedule: any[], index: number, amount: number) => {
    if (index >= schedule.length || schedule[index].balance <= 0) return
    
    // Apply the prepayment
    if (applyTowards === 'principal') {
      // Reduce principal directly
      schedule[index].principal += amount
      schedule[index].payment += amount
      schedule[index].balance -= amount
      
      // If balance is paid off
      if (schedule[index].balance <= 0) {
        schedule[index].balance = 0
        
        // Remove remaining payments
        schedule.splice(index + 1)
        return
      }
      
      // Recalculate future payments
      const monthlyRate = interestRate / 100 / 12
      
      for (let i = index + 1; i < schedule.length; i++) {
        // Calculate new interest based on new balance
        const interest = schedule[i-1].balance * monthlyRate
        
        // Principal remains the same (or adjust if it's the last payment)
        const principal = Math.min(monthlyPayment - interest, schedule[i-1].balance)
        
        // Update the payment
        schedule[i].interest = interest
        schedule[i].principal = principal
        schedule[i].payment = interest + principal
        schedule[i].balance = schedule[i-1].balance - principal
        
        // Update total interest paid
        schedule[i].totalInterestPaid = schedule[i-1].totalInterestPaid + interest
        
        // If balance is paid off
        if (schedule[i].balance <= 0) {
          schedule[i].balance = 0
          
          // Remove remaining payments
          schedule.splice(i + 1)
          break
        }
      }
    } else {
      // Apply towards future payments (doesn't change the amortization schedule,
      // just prepays the next payment(s))
      let remainingAmount = amount
      let currentIndex = index
      
      while (remainingAmount > 0 && currentIndex < schedule.length) {
        const currentPayment = schedule[currentIndex]
        
        if (remainingAmount >= currentPayment.payment) {
          // Can cover the entire payment
          remainingAmount -= currentPayment.payment
          currentPayment.prepaid = true
          currentPayment.prepaidAmount = currentPayment.payment
        } else {
          // Partial payment
          currentPayment.prepaidAmount = remainingAmount
          remainingAmount = 0
        }
        
        currentIndex++
      }
    }
  }

  const handleCalculate = () => {
    calculatePrepayment()
    
    toast({
      title: "Prepayment Calculated",
      description: `You'll save ${formatCurrency(totalInterestSaved)} in interest with this prepayment plan.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Prepayment Calculator
          </CardTitle>
          <CardDescription>
            See how prepayments can save you money and time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Loan Summary */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Current Loan</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal:</span>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span className="font-medium">{interestRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term:</span>
                  <span className="font-medium">{loanTerm} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Payment:</span>
                  <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* Prepayment Options */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="prepaymentType">Prepayment Type</Label>
                <Select
                  value={prepaymentType}
                  onValueChange={setPrepaymentType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time Prepayment</SelectItem>
                    <SelectItem value="recurring">Recurring Prepayment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="prepaymentAmount">Prepayment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="prepaymentAmount"
                    type="number"
                    value={prepaymentAmount}
                    onChange={(e) => setPrepaymentAmount(parseFloat(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {prepaymentType === 'recurring' && (
                <div>
                  <Label htmlFor="prepaymentFrequency">Frequency</Label>
                  <Select
                    value={prepaymentFrequency}
                    onValueChange={setPrepaymentFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="prepaymentStartMonth">Start Month</Label>
                <Input
                  id="prepaymentStartMonth"
                  type="number"
                  min="1"
                  max={loanTerm}
                  value={prepaymentStartMonth}
                  onChange={(e) => setPrepaymentStartMonth(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <Label htmlFor="applyTowards">Apply Towards</Label>
                <Select
                  value={applyTowards}
                  onValueChange={setApplyTowards}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Principal (Reduce Term)</SelectItem>
                    <SelectItem value="future_payments">Future Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Prepayment Results</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-sm text-blue-700">New Loan Term</div>
                <div className="text-2xl font-bold text-blue-900">{newLoanTerm} months</div>
                <div className="text-xs text-blue-600">
                  {loanTerm - newLoanTerm > 0 ? `${loanTerm - newLoanTerm} months saved` : 'No change'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-blue-700">Interest Saved</div>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalInterestSaved)}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-blue-700">Total Savings</div>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalPaymentSaved)}</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button onClick={handleCalculate}>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Savings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}