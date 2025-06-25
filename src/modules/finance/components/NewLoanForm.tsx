import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, DollarSign, Calendar, User, Package, Calculator } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { LoanCalculator } from './LoanCalculator'
import { formatCurrency } from '@/lib/utils'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'

interface NewLoanFormProps {
  onSave: (loanData: any) => Promise<void>
  onCancel: () => void
}

export function NewLoanForm({ onSave, onCancel }: NewLoanFormProps) {
  const { toast } = useToast()
  const { leads } = useLeadManagement()
  const { vehicles, getAvailableVehicles } = useInventoryManagement()
  const [loading, setLoading] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorResults, setCalculatorResults] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    vehicleId: '',
    vehicleInfo: '',
    amount: 0,
    downPayment: 0,
    term: 60,
    rate: 6.99,
    paymentAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: '',
    loanType: 'standard', // standard, in-house, etc.
    paymentFrequency: 'monthly',
    includeInsurance: false,
    insuranceAmount: 0,
    includeTax: false,
    taxRate: 0
  })

  const availableVehicles = getAvailableVehicles()

  // Update customer name when customer is selected
  useEffect(() => {
    if (formData.customerId) {
      const customer = leads.find(c => c.id === formData.customerId)
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: `${customer.firstName} ${customer.lastName}`
        }))
      }
    }
  }, [formData.customerId, leads])

  // Update vehicle info when vehicle is selected
  useEffect(() => {
    if (formData.vehicleId) {
      const vehicle = vehicles.find(v => v.id === formData.vehicleId)
      if (vehicle) {
        setFormData(prev => ({
          ...prev,
          vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          amount: vehicle.price,
          downPayment: Math.round(vehicle.price * 0.1) // Default 10% down payment
        }))
      }
    }
  }, [formData.vehicleId, vehicles])

  // Update payment amount when calculator results change
  useEffect(() => {
    if (calculatorResults) {
      setFormData(prev => ({
        ...prev,
        paymentAmount: calculatorResults.monthlyPayment,
        term: calculatorResults.loanTerm,
        rate: calculatorResults.interestRate,
        amount: calculatorResults.loanAmount,
        downPayment: calculatorResults.downPayment,
        paymentFrequency: calculatorResults.paymentFrequency,
        includeInsurance: calculatorResults.includeInsurance,
        insuranceAmount: calculatorResults.insuranceAmount,
        includeTax: calculatorResults.includeTax,
        taxRate: calculatorResults.taxRate * 100
      }))
    }
  }, [calculatorResults])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.vehicleId || !formData.amount || !formData.term || !formData.rate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: 'Loan created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create loan',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCalculatorSave = (results: any) => {
    setCalculatorResults(results)
    setShowCalculator(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {showCalculator ? (
        <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Loan Calculator</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCalculator(false)}
              >
                ✕
              </Button>
            </div>
            <LoanCalculator 
              initialValues={{
                loanAmount: formData.amount,
                downPayment: formData.downPayment,
                interestRate: formData.rate,
                loanTerm: formData.term
              }}
              onSave={handleCalculatorSave}
              onClose={() => setShowCalculator(false)}
            />
          </div>
        </div>
      ) : (
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Loan</CardTitle>
                <CardDescription>
                  Set up a new loan for a customer
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer and Vehicle Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer & Vehicle</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="customerId">Customer *</Label>
                    <Select 
                      value={formData.customerId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="vehicleId">Home/Vehicle *</Label>
                    <Select 
                      value={formData.vehicleId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select home/vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.year} {vehicle.make} {vehicle.model} - {formatCurrency(vehicle.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Loan Details</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCalculator(true)}
                    className="flex items-center"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Use Loan Calculator
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="amount">Loan Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
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
                        value={formData.downPayment}
                        onChange={(e) => setFormData(prev => ({ ...prev, downPayment: parseFloat(e.target.value) || 0 }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="term">Loan Term (months) *</Label>
                    <Select
                      value={formData.term.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, term: parseInt(value) }))}
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
                    <Label htmlFor="rate">Interest Rate (%) *</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <Select
                      value={formData.paymentFrequency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentFrequency: value }))}
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
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="paymentAmount">Payment Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={formData.paymentAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentAmount: parseFloat(e.target.value) || 0 }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Options</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="loanType">Loan Type</Label>
                    <Select
                      value={formData.loanType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, loanType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Financing</SelectItem>
                        <SelectItem value="in-house">In-House Financing</SelectItem>
                        <SelectItem value="balloon">Balloon Payment</SelectItem>
                        <SelectItem value="lease">Lease</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeInsurance"
                      checked={formData.includeInsurance}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        includeInsurance: !!checked 
                      }))}
                    />
                    <Label htmlFor="includeInsurance">Include Insurance</Label>
                  </div>
                  
                  {formData.includeInsurance && (
                    <div>
                      <Label htmlFor="insuranceAmount">Monthly Insurance Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="insuranceAmount"
                          type="number"
                          value={formData.insuranceAmount}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            insuranceAmount: parseFloat(e.target.value) || 0 
                          }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeTax"
                      checked={formData.includeTax}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        includeTax: !!checked 
                      }))}
                    />
                    <Label htmlFor="includeTax">Include Tax</Label>
                  </div>
                  
                  {formData.includeTax && (
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          taxRate: parseFloat(e.target.value) || 0 
                        }))}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes</h3>
                
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this loan..."
                  rows={3}
                />
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Loan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}