// src/modules/finance/components/LoanPaymentHistory.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, CreditCard, Calendar, Download, Printer, CheckCircle, XCircle, Clock, Receipt, X } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Payment, PaymentStatus, PaymentMethod } from '@/types'
import { useToast } from '@/hooks/use-toast' 
import { useEffect } from 'react'

interface LoanPaymentHistoryProps {
  loan: any // Using 'any' for now, but ideally a Loan type
  onClose: () => void
  onRecordPayment?: (paymentData: Partial<Payment>) => Promise<void>
}

export function LoanPaymentHistory({ loan, onClose, onRecordPayment }: LoanPaymentHistoryProps) {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Initialize payments safely from loan prop 
  useEffect(() => {
    if (loan && Array.isArray(loan.payments)) {
      setPayments(loan.payments);
    }
  }, [loan]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'refunded':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'refunded':
        return <Receipt className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card'
      case 'bank_transfer':
        return 'Bank Transfer'
      case 'cash':
        return 'Cash'
      case 'check':
        return 'Check'
      case 'financing':
        return 'Financing'
      default:
        return method
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case 'bank_transfer':
        return <Receipt className="h-4 w-4 text-green-500" />
      case 'cash':
        return <Receipt className="h-4 w-4 text-green-500" />
      case 'check':
        return <Receipt className="h-4 w-4 text-blue-500" />
      case 'financing':
        return <Receipt className="h-4 w-4 text-purple-500" />
      default:
        return <Receipt className="h-4 w-4 text-gray-500" />
    }
  }

  // Filter payments based on search term and filters
  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
      const matchesSearch = (payment.invoiceId && payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.id && payment.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter

    let matchesDate = true
    const now = new Date()
    const paymentDate = payment.processedDate || new Date()

    if (dateFilter === 'today') {
      matchesDate = paymentDate.toDateString() === now.toDateString()
    } else if (dateFilter === 'this_week') {
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      matchesDate = paymentDate >= startOfWeek && paymentDate <= endOfWeek
    } else if (dateFilter === 'this_month') {
      matchesDate =
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesDate
  }) : []

  const handleExport = () => {
    // Create CSV content
    try {
      if (!Array.isArray(filteredPayments) || filteredPayments.length === 0) {
        toast({
          title: 'Export Failed',
          description: 'No payment data to export',
          variant: 'destructive'
        });
        return;
      }
      
      const headers = ["ID", "Invoice ID", "Amount", "Method", "Status", "Transaction ID", "Date", "Notes"];
      const csvContent = [
        headers.join(","),
        ...filteredPayments.map(payment => [
          payment.id || '',
          payment.invoiceId || '',
          (payment.amount || 0).toFixed(2),
          payment.method || '',
          payment.status || '',
          payment.transactionId || '',
          payment.processedDate ? payment.processedDate.toISOString().split('T')[0] : '',
          payment.notes || ''
        ].join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `loan_${loan?.id || 'unknown'}_payment_history.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Successful',
        description: 'Payment history exported to CSV',
      });
    } catch (error) {
      console.error('Error exporting payment history:', error);
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting data',
        variant: 'destructive'
      });
    }
  }

  const handleRecordNewPayment = async () => {
    if (!onRecordPayment || !loan?.id) {
      toast({
        title: "Error",
        description: "Cannot record payment at this time",
        variant: "destructive"
      });
      return;
    }

    // Mock data for a new payment
    const newPayment: Partial<Payment> = {
      invoiceId: loan.id,
      amount: 100, // Example amount
      method: PaymentMethod.CASH,
      status: PaymentStatus.COMPLETED,
      processedDate: new Date(),
      notes: 'Manual payment recorded',
      transactionId: Math.random().toString(36).substr(2, 9)
    };

    try {
      await onRecordPayment(newPayment);
      // Safely update payments array
      setPayments(prev => Array.isArray(prev) ? 
        [...prev, { ...newPayment, id: Math.random().toString(36).substr(2, 9) } as Payment] : 
        [{ ...newPayment, id: Math.random().toString(36).substr(2, 9) } as Payment]
      );
      toast({ title: "Payment Recorded", description: "New payment added to history." });
    } catch (error) {
      console.error("Failed to record payment:", error);
      toast({ title: "Error", description: "Failed to record payment.", variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> 
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {loan && (
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment History for Loan #{loan.id || 'Unknown'}</CardTitle>
                <CardDescription>
                  {loan.customerName ? `Customer: ${loan.customerName}` : 'No customer information'} 
                  {loan.vehicleInfo ? ` | Vehicle: ${loan.vehicleInfo}` : ''}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" /> 
              </Button>
            </div>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="financing">Financing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="flex justify-end space-x-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              disabled={!Array.isArray(filteredPayments) || filteredPayments.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRecordNewPayment} 
              disabled={!onRecordPayment || !loan?.id}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>

          <div className="overflow-x-auto">
            {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Method</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Transaction ID</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/10">
                      <td className="p-3 font-medium">{formatCurrency(payment.amount || 0)}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          {getMethodIcon(payment.method || '')}
                          <span>{getMethodLabel(payment.method || '')}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={cn("flex items-center space-x-1", getStatusColor(payment.status || ''))}>
                          {getStatusIcon(payment.status || '')}
                          <span>{payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}</span>
                        </Badge>
                      </td>
                      <td className="p-3">{payment.processedDate ? formatDate(payment.processedDate) : '-'}</td>
                      <td className="p-3">
                        <span className="font-mono text-xs">
                          {payment.transactionId ? payment.transactionId : '-'}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {payment.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : ( 
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payments found</p>
                <p className="text-sm mt-2">
                  {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' || dateFilter !== 'all' 
                    ? 'Try adjusting your search filters' 
                    : 'Record a payment to get started'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

