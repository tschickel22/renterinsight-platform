// src/modules/finance/FinanceModule.tsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Calculator, CreditCard, FileText, Plus, Search, Filter, TrendingUp, Clock, Calendar } from 'lucide-react'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { LoanCalculator } from './components/LoanCalculator'
import { PaymentHistory } from './components/PaymentHistory'
import { LoanSettings } from './components/LoanSettings'
import { NewLoanForm } from './components/NewLoanForm'
import { LoanPaymentHistory } from './components/LoanPaymentHistory' // Import the new component
import { Payment, PaymentMethod, PaymentStatus } from '@/types' 

// Define interfaces
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
  payments: Payment[];
}

interface Payment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed';
  method: string;
}

export const FinanceModule: React.FC = () => {
  const { toast } = useToast()
  const { vehicles } = useInventoryManagement()
  const [loans, setLoans] = useState<Loan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewLoanForm, setShowNewLoanForm] = useState(false) 
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false) 
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null) 

  // Safe mock data for demonstration
  const mockLoans: Loan[] = [
    {
      id: '1',
      customerId: 'cust-1',
      customerName: 'John Smith',
      vehicleId: 'veh-1',
      vehicleInfo: '2023 Honda Civic',
      amount: 25000,
      downPayment: 5000,
      term: 60,
      rate: 4.5,
      paymentAmount: 372.86,
      startDate: new Date('2024-01-15'),
      status: 'active',
      remainingBalance: 22000,
      nextPaymentDate: new Date('2024-02-15'),
      createdAt: new Date('2024-01-10'),
      payments: [
        {
          id: 'payment-1',
          invoiceId: '1',
          amount: 372.86,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          processedDate: new Date('2024-01-15'),
          notes: 'Initial payment',
          transactionId: 'txn_123456',
          customFields: {},
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ]
    }
  ]

  React.useEffect(() => {
    setLoans(mockLoans)
  }, [])

  const filteredLoans = loans.filter(loan => {
    // Safe string comparisons with null checks
    const matchesSearch = 
      (loan?.customerName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false) ||
      (loan?.vehicleInfo?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false)
    const matchesFilter = filterStatus === 'all' || loan?.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleViewPaymentHistory = (loan: Loan) => { 
    if (loan) {
      setSelectedLoan(loan);
      setShowPaymentHistoryModal(true);
    }
  }

  const handleRecordPayment = async (paymentData: Partial<Payment>): Promise<void> => {
    if (!selectedLoan) {
      toast({
        title: "Error",
        description: "No loan selected",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a new payment
      const newPayment: Payment = {
        id: `payment-${Math.random().toString(36).substring(2, 9)}`,
        invoiceId: selectedLoan.id,
        amount: paymentData.amount || 0,
        method: paymentData.method || PaymentMethod.CASH,
        status: paymentData.status || PaymentStatus.COMPLETED,
        processedDate: paymentData.processedDate || new Date(),
        notes: paymentData.notes || '',
        transactionId: paymentData.transactionId || `txn_${Math.random().toString(36).substring(2, 9)}`,
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Update the loans state with the new payment
      setLoans(prevLoans => {
        if (!Array.isArray(prevLoans)) return [];
        
        return prevLoans.map(loan => {
          if (loan?.id === selectedLoan?.id) {
            return { 
              ...loan, 
              payments: Array.isArray(loan.payments) 
                ? [...loan.payments, newPayment] 
                : [newPayment] 
            };
          }
          return loan;
        });
      });

      toast({
        title: "Payment Recorded",
        description: `Payment of ${formatCurrency(newPayment.amount)} has been recorded.`
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Management</h1>
          <p className="text-muted-foreground">
            Manage loans, payments, and financial operations
          </p>
        </div>
        <Button onClick={() => setShowNewLoanForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Loan
        </Button>
      </div>

      <Tabs defaultValue="loans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>

          <div className="grid gap-4">
            {Array.isArray(filteredLoans) && filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => loan && (
              <Card key={loan?.id || Math.random().toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {loan?.customerName || 'Unknown Customer'}
                    </CardTitle>
                    <Badge variant={loan?.status === 'active' ? 'default' : 'secondary'}>
                      {loan?.status || 'Unknown'}
                    </Badge>
                  </div>
                  <CardDescription>{loan?.vehicleInfo || 'No vehicle information'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan?.amount || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan?.paymentAmount || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payments</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">{Array.isArray(loan?.payments) ? loan.payments.length : 0}</p>
                        <Button 
                          variant="outline" 
                          size="sm"  
                          onClick={(e) => {
                            e.stopPropagation();
                            if (loan) handleViewPaymentHistory(loan);
                          }}
                        >
                          View History
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next Payment</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {loan?.nextPaymentDate ? loan.nextPaymentDate.toLocaleDateString() : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No loans found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <LoanCalculator />
        </TabsContent>

        <TabsContent value="payments">
          <LoanPaymentHistory 
            loan={Array.isArray(filteredLoans) && filteredLoans.length > 0 ? filteredLoans[0] : {
              id: '0',
              customerId: '',
              customerName: '',
              vehicleId: '',
              vehicleInfo: '',
              amount: 0,
              downPayment: 0,
              term: 0,
              rate: 0,
              paymentAmount: 0,
              startDate: new Date(),
              status: '',
              remainingBalance: 0,
              nextPaymentDate: new Date(),
              createdAt: new Date(),
              payments: []
            }}
            onClose={() => {}}
          />
        </TabsContent>

        <TabsContent value="settings">
          <LoanSettings />
        </TabsContent>
      </Tabs>

      {/* Payment History Modal */}
      {showPaymentHistoryModal && selectedLoan && (
        <LoanPaymentHistory
          loan={selectedLoan}
          onClose={() => setShowPaymentHistoryModal(false)}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {showNewLoanForm && (
        <NewLoanForm
          onClose={() => setShowNewLoanForm(false)}
          onSave={async (loanData) => {
            // Handle loan creation
            toast({
              title: "Loan Created",
              description: "New loan has been successfully created.",
            })
            setShowNewLoanForm(false)
          }}
          onAddNewCustomer={() => {}}
        />
      )}
    </div>
  )
}