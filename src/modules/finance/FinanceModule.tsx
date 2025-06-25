import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Calculator, CreditCard, FileText, Plus, Search, Filter, TrendingUp, Clock, Calendar } from 'lucide-react'
import { LoanCalculator } from './components/LoanCalculator'
import { PaymentHistory } from './components/PaymentHistory'
import { LoanSettings } from './components/LoanSettings'
import { NewLoanForm } from './components/NewLoanForm'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'

interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleInfo: string;
  amount: number;
  downPayment: number;
  term: number;
  rate: number;
  paymentAmount: number;
  startDate: Date;
  status: string;
  remainingBalance: number;
  nextPaymentDate: Date;
  createdAt: Date;
}

const mockLoans: Loan[] = [
  {
    id: '1',
    customerId: 'cust-1',
    customerName: 'John Smith',
    vehicleId: 'veh-1',
    vehicleInfo: '2024 Forest River Georgetown',
    amount: 125000,
    downPayment: 20000,
    term: 60,
    rate: 6.99,
    paymentAmount: 2100.42,
    startDate: new Date('2024-01-15'),
    status: 'active',
    remainingBalance: 105000,
    nextPaymentDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    customerId: 'cust-2',
    customerName: 'Sarah Johnson',
    vehicleId: 'veh-2',
    vehicleInfo: '2023 Winnebago View',
    amount: 89000,
    downPayment: 15000,
    term: 72,
    rate: 7.49,
    paymentAmount: 1250.33,
    startDate: new Date('2024-01-10'),
    status: 'active',
    remainingBalance: 74000,
    nextPaymentDate: new Date('2024-02-10'),
    createdAt: new Date('2024-01-10')
  }
]

function FinanceDashboard() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNewLoanForm, setShowNewLoanForm] = useState(false)
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const handleCreateLoan = () => {
    setPreselectedCustomerId(null)
    setShowNewLoanForm(true)
  }

  const handleNewCustomerSuccess = (newCustomer: any) => {
    toast({
      title: 'Customer Added',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added.`,
    })
    setPreselectedCustomerId(newCustomer.id)
    setShowLeadModal(false)
    setShowNewLoanForm(true)
  }

  const handleSaveLoan = async (loanData: any) => {
    const newLoan: Loan = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: loanData.customerId,
      customerName: loanData.customerName,
      vehicleId: loanData.vehicleId,
      vehicleInfo: loanData.vehicleInfo,
      amount: loanData.amount,
      downPayment: loanData.downPayment,
      term: loanData.term,
      rate: loanData.rate,
      paymentAmount: loanData.paymentAmount,
      startDate: new Date(loanData.startDate),
      status: loanData.status,
      remainingBalance: loanData.amount - loanData.downPayment,
      nextPaymentDate: new Date(new Date(loanData.startDate).setMonth(new Date(loanData.startDate).getMonth() + 1)),
      createdAt: new Date()
    }
    setLoans([...loans, newLoan])
    setShowNewLoanForm(false)
    toast({ title: 'Success', description: 'Loan created successfully' })
  }

  return (
    <div className="space-y-8">
      {showLeadModal && (
        <NewLeadForm
          onClose={() => setShowLeadModal(false)}
          onSuccess={handleNewCustomerSuccess}
        />
      )}
      {showNewLoanForm && (
        <NewLoanForm
          preselectedCustomerId={preselectedCustomerId}
          onSave={handleSaveLoan}
          onCancel={() => setShowNewLoanForm(false)}
          onAddNewCustomer={() => {
            setShowNewLoanForm(false)
            setShowLeadModal(true)
          }}
        />
      )}
      {/* ... (rest of UI like stats, cards, tabs, etc.) */}
      
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Finance & Loans</h1>
            <p className="ri-page-description">
              Manage loans, payments, and financial calculations
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateLoan}>
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Active Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{loans.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Current loans
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Financed</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Loan volume
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Avg Rate</CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {(loans.reduce((sum, loan) => sum + loan.rate, 0) / loans.length).toFixed(2)}%
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Average interest rate
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Monthly Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(loans.reduce((sum, loan) => sum + loan.paymentAmount, 0))}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Total monthly
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loans Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Loans</CardTitle>
          <CardDescription>
            Manage customer loans and financing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{loan.customerName}</h3>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {loan.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Vehicle:</span> 
                        <span className="ml-1">{loan.vehicleInfo}</span>
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> 
                        <span className="ml-1 font-bold text-primary">{formatCurrency(loan.amount)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Term:</span> 
                        <span className="ml-1">{loan.term} months @ {loan.rate}%</span>
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span> 
                        <span className="ml-1">{formatCurrency(loan.paymentAmount)}/month</span>
                      </div>
                    </div>
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Next Payment:</span> {loan.nextPaymentDate.toLocaleDateString()}
                        <span className="ml-4 font-medium">Balance:</span> {formatCurrency(loan.remainingBalance)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm" onClick={() => setShowCalculator(true)}>
                    <Calculator className="h-3 w-3 mr-1" />
                    Calculator
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Payments
                  </Button>
                </div>
              </div>
            ))}

            {loans.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No loans found</p>
                <p className="text-sm">Create your first loan to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FinanceModule() {
  return (
    <Routes>
      <Route path="/" element={<FinanceDashboard />} />
      <Route path="/*" element={<FinanceDashboard />} />
    </Routes>
  )
}
