import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DollarSign, Calculator, Calendar, TrendingDown, Download, Printer } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AmortizationSchedule } from './AmortizationSchedule'
import { useToast } from '@/hooks/use-toast'

interface LoanCalculatorProps {
  initialValues?: {
    loanAmount: number
    downPayment: number
    interestRate: number
    loanTerm: number
  }
  onSave?: (loanData: any) => void
  onClose?: () => void
}

export function LoanCalculator({ initialValues, onSave, onClose }: LoanCalculatorProps) {
  const { toast } = useToast()
  const [loanAmount, setLoanAmount] = useState(initialValues?.loanAmount || 100000)
  const [downPayment, setDownPayment] = useState(initialValues?.downPayment || 20000)
  const [interestRate, setInterestRate] = useState(initialValues?.interestRate || 6.99)
  const [loanTerm, setLoanTerm] = useState(initialValues?.loanTerm || 60)
  const [paymentFrequency, setPaymentFrequency] = useState('monthly')
  const [includeInsurance, setIncludeInsurance] = useState(false)
  const [insuranceAmount, setInsuranceAmount] = useState(0)
  const [includeTax, setIncludeTax] = useState(false)
  const [taxRate, setTaxRate] = useState(0)
  const [activeTab, setActiveTab] = useState('calculator')
  
  // Calculated values
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([])

  // Calculate loan details
  useEffect(() => {
    calculateLoan()
  }, [loanAmount, downPayment, interestRate, loanTerm, paymentFrequency, includeInsurance, insuranceAmount, includeTax, taxRate])

  const calculateLoan = () => {
    // Calculate principal amount
    const principal = loanAmount - downPayment
    
    if (principal <= 0) {
      setMonthlyPayment(0)
      setTotalInterest(0)
      setTotalCost(0)
      setAmortizationSchedule([])
      return
    }

    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12
    
    // Calculate base monthly payment using the formula: P = (PV*r) / (1-(1+r)^-n)
    const baseMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm))
    
    // Calculate additional costs
    let additionalCosts = 0
    
    if (includeInsurance) {
      additionalCosts += insuranceAmount
    }
    
    if (includeTax) {
      // Calculate tax on the monthly payment
      additionalCosts += baseMonthlyPayment * (taxRate / 100)
    }
    
    // Adjust payment based on frequency
    let paymentMultiplier = 1
    switch (paymentFrequency) {
      case 'biweekly':
        paymentMultiplier = 12 / 26
        break
      case 'weekly':
        paymentMultiplier = 12 / 52
        break
      default: // monthly
        paymentMultiplier = 1
        break
    }
    
    const adjustedPayment = (baseMonthlyPayment * paymentMultiplier) + (additionalCosts * paymentMultiplier)
    
    // Calculate total interest
    const totalPayments = loanTerm
    const calculatedTotalInterest = (baseMonthlyPayment * totalPayments) - principal
    
    // Calculate total cost
    const calculatedTotalCost = principal + calculatedTotalInterest + (additionalCosts * totalPayments)
    
    // Generate amortization schedule
    const schedule = generateAmortizationSchedule(principal, monthlyRate, loanTerm, baseMonthlyPayment, additionalCosts)
    
    setMonthlyPayment(adjustedPayment)
    setTotalInterest(calculatedTotalInterest)
    setTotalCost(calculatedTotalCost)
    setAmortizationSchedule(schedule)
  }

  const generateAmortizationSchedule = (principal: number, monthlyRate: number, term: number, monthlyPayment: number, additionalCosts: number) => {
    let balance = principal
    let totalInterestPaid = 0
    const schedule = []
    
    for (let month = 1; month <= term; month++) {
      // Calculate interest for this period
      const interestPayment = balance * monthlyRate
      
      // Calculate principal for this period
      let principalPayment = monthlyPayment - interestPayment
      
      // Adjust for final payment
      if (balance < principalPayment) {
        principalPayment = balance
      }
      
      // Update balance
      balance -= principalPayment
      
      // Update total interest
      totalInterestPaid += interestPayment
      
      // Add to schedule
      schedule.push({
        month,
        payment: monthlyPayment + additionalCosts,
        principal: principalPayment,
        interest: interestPayment,
        additionalCosts,
        balance,
        totalInterestPaid
      })
      
      // If balance is paid off, break
      if (balance <= 0) break
    }
    
    return schedule
  }

  const handleSave = () => {
    if (onSave) {
      onSave({
        loanAmount,
        downPayment,
        interestRate,
        loanTerm,
        paymentFrequency,
        includeInsurance,
        insuranceAmount,
        includeTax,
        taxRate,
        monthlyPayment,
        totalInterest,
        totalCost,
        amortizationSchedule
      })
    }
    
    toast({
      title: "Loan Calculation Saved",
      description: "Your loan calculation has been saved successfully.",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ["Month", "Payment", "Principal", "Interest", "Additional Costs", "Balance", "Total Interest Paid"]
    const csvContent = [
      headers.join(","),
      ...amortizationSchedule.map(row => [
        row.month,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.additionalCosts.toFixed(2),
        row.balance.toFixed(2),
        row.totalInterestPaid.toFixed(2)
      ].join(","))
    ].join("\n")
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'amortization_schedule.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Export Successful",
      description: "Amortization schedule exported to CSV.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="amortization">Amortization Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Loan Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  Loan Details
                </CardTitle>
                <CardDescription>
                  Enter the details of your loan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loanAmount">Vehicle Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="downPayment">Down Payment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="loanTerm">Loan Term (months)</Label>
                  <Select
                    value={loanTerm.toString()}
                    onValueChange={(value) => setLoanTerm(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 months (1 year)</SelectItem>
                      <SelectItem value="24">24 months (2 years)</SelectItem>
                      <SelectItem value="36">36 months (3 years)</SelectItem>
                      <SelectItem value="48">48 months (4 years)</SelectItem>
                      <SelectItem value="60">60 months (5 years)</SelectItem>
                      <SelectItem value="72">72 months (6 years)</SelectItem>
                      <SelectItem value="84">84 months (7 years)</SelectItem>
                      <SelectItem value="96">96 months (8 years)</SelectItem>
                      <SelectItem value="120">120 months (10 years)</SelectItem>
                      <SelectItem value="180">180 months (15 years)</SelectItem>
                      <SelectItem value="240">240 months (20 years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                  <Select
                    value={paymentFrequency}
                    onValueChange={setPaymentFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Additional Costs */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Additional Costs
                </CardTitle>
                <CardDescription>
                  Include additional costs in your calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeInsurance"
                    checked={includeInsurance}
                    onCheckedChange={(checked) => setIncludeInsurance(!!checked)}
                  />
                  <Label htmlFor="includeInsurance">Include Insurance</Label>
                </div>
                
                {includeInsurance && (
                  <div>
                    <Label htmlFor="insuranceAmount">Monthly Insurance Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="insuranceAmount"
                        type="number"
                        value={insuranceAmount}
                        onChange={(e) => setInsuranceAmount(parseFloat(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeTax"
                    checked={includeTax}
                    onCheckedChange={(checked) => setIncludeTax(!!checked)}
                  />
                  <Label htmlFor="includeTax">Include Tax</Label>
                </div>
                
                {includeTax && (
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
                
                {/* Loan Summary */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Loan Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal Amount:</span>
                      <span className="font-medium">{formatCurrency(loanAmount - downPayment)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {paymentFrequency === 'monthly' ? 'Monthly' : 
                         paymentFrequency === 'biweekly' ? 'Bi-weekly' : 'Weekly'} Payment:
                      </span>
                      <span className="font-bold text-primary">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interest:</span>
                      <span className="font-medium">{formatCurrency(totalInterest)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-medium">{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
            <Button variant="outline" onClick={() => setActiveTab('amortization')}>
              <Calendar className="h-4 w-4 mr-2" />
              View Amortization
            </Button>
            {onSave && (
              <Button onClick={handleSave}>
                Save Calculation
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="amortization">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Amortization Schedule
                  </CardTitle>
                  <CardDescription>
                    Detailed payment schedule over the life of the loan
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AmortizationSchedule schedule={amortizationSchedule} />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setActiveTab('calculator')}>
              <Calculator className="h-4 w-4 mr-2" />
              Back to Calculator
            </Button>
            {onSave && (
              <Button onClick={handleSave}>
                Save Calculation
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}