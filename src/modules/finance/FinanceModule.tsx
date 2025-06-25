import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Calculator, Clock, Calendar, CreditCard, FileText, Plus, Search, Filter, TrendingUp, Users } from 'lucide-react'
import { LoanCalculator } from './components/LoanCalculator'
import { PaymentHistory } from './components/PaymentHistory'
import { LoanSettings } from './components/LoanSettings'
import { NewLoanForm } from './components/NewLoanForm'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

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

const mockLoans = [
  {
    id: '1',
    customerId: 'cust-1',
    customerName: 'John Smith',
    vehicleId: 'veh-1',
    vehicleInfo: '2024 Forest River Georgetown',
    amount: 125000,
    downPayment: 25000,
    term: 84,
    rate: 6.99,
    paymentAmount: 1621.23,
    startDate: new Date('2024-01-15'),
    status: 'active',
    remainingBalance: 123378.77,
    nextPaymentDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    customerId: 'cust-2',
    customerName: 'Sarah Johnson',
    vehicleId: 'veh-2',
    vehicleInfo: '2023 Airstream Flying Cloud',
    amount: 75000,
    downPayment: 15000,
    term: 60,
    rate: 5.49,
    paymentAmount: 1142.62,
    startDate: new Date('2023-12-01'),
    status: 'active',
    remainingBalance: 73857.38,
    nextPaymentDate: new Date('2024-02-01'),
    createdAt: new Date('2023-11-25')
  }
]

function FinanceDashboard() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNewLoanForm, setShowNewLoanForm] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const { toast } = useToast()

  const totalLoans = loans.length
  const totalPortfolio = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleCreateLoan = () => setShowNewLoanForm(true)
  const avgInterestRate = loans.reduce((sum, loan) => sum + loan.rate, 0) / loans.length
  const monthlyRevenue = loans.reduce((sum, loan) => sum + loan.paymentAmount, 0)

  const handleSaveLoan = async (loanData: any) => {
    try {
      // In a real app, this would save to the database
      console.log('Creating new loan:', loanData)
      
      // Add the new loan to the state
      const newLoan = {
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
      
      // Update the loans state
      setLoans([...loans, newLoan])
      
      // Close the form
      setShowNewLoanForm(false)
      
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
    }
  }

  const filteredLoans = loans.filter(loan =>
    loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* New Loan Form Modal */}
      {showNewLoanForm && (
        <NewLoanForm
          onSave={(loanData) => handleSaveLoan(loanData)}
          onCancel={() => setShowNewLoanForm(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Finance Management</h1>
            <p className="ri-page-description">
              Manage loans, calculate payments, and track customer financing
            </p>
          </div>
          <div className="flex space-x-2">  
            <Button
              variant="outline" 
              className="shadow-sm"
              onClick={() => setShowCalculator(true)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Loan Calculator
            </Button>
            <Button className="shadow-sm" onClick={handleCreateLoan}>
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Loans</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalLoans}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active loans
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Loan Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(totalPortfolio)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Total outstanding
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Avg Interest Rate</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{avgInterestRate.toFixed(2)}%</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Portfolio average
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              From loan payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="settings">Loan Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Loans Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Active Loans</CardTitle>
              <CardDescription>
                Manage customer loans and financing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLoans.map((loan) => (
                  <div key={loan.id} className="ri-table-row">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{loan.customerName}</h3>
                          <div className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {loan.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Vehicle:</span> {loan.vehicleInfo}
                          </div>
                          <div>
                            <span className="font-medium">Loan Amount:</span> {formatCurrency(loan.amount)}
                          </div>
                          <div>
                            <span className="font-medium">Payment:</span> {formatCurrency(loan.paymentAmount)}/mo
                          </div>
                          <div>
                            <span className="font-medium">Next Payment:</span> {loan.nextPaymentDate.toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Term:</span> {loan.term} months @ {loan.rate}%
                          </div>
                          <div>
                            <span className="font-medium">Balance:</span> {formatCurrency(loan.remainingBalance)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Payments
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Loan Management</CardTitle>
                <CardDescription>
                  View and manage all customer loans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Detailed loan management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="settings">
          <LoanSettings />
        </TabsContent>
      </Tabs>

      {/* Loan Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
              <LoanCalculator onClose={() => setShowCalculator(false)} />
            </div>
          </div>
        </div>
      )}
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