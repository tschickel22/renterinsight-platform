import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, CreditCard, Calendar, Download, Printer, CheckCircle, XCircle, Clock, Receipt } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Payment, PaymentStatus, PaymentMethod } from '@/types'
import { useToast } from '@/hooks/use-toast'
import Papa from 'papaparse'

interface PaymentHistoryProps {
  payments: Payment[]
  onViewPaymentDetails?: (payment: Payment) => void
}

export function PaymentHistory({ payments, onViewPaymentDetails }: PaymentHistoryProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

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
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    
    let matchesDate = true
    const now = new Date()
    const paymentDate = payment.processedDate
    
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
  })

  const handleExport = () => {
    // Create CSV content
    const headers = ["ID", "Invoice ID", "Amount", "Method", "Status", "Transaction ID", "Date", "Notes"]
    const csvContent = [
      headers.join(","),
      ...filteredPayments.map(payment => [
        payment.id,
        payment.invoiceId,
        payment.amount.toFixed(2),
        payment.method,
        payment.status,
        payment.transactionId || '',
        payment.processedDate.toISOString().split('T')[0],
        payment.notes || ''
      ].join(","))
    ].join("\n")
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'payment_history.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Export Successful',
      description: 'Payment history exported to CSV',
    })
  }

  // Calculate payment statistics
  const totalPayments = payments.length
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const completedPayments = payments.filter(p => p.status === 'completed').length
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'processing').length
  const failedPayments = payments.filter(p => p.status === 'failed').length

  // Group payments by method
  const paymentsByMethod = payments.reduce((acc, payment) => {
    const method = payment.method
    if (!acc[method]) {
      acc[method] = 0
    }
    if (payment.status === 'completed') {
      acc[method] += payment.amount
    }
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalPayments}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              {formatCurrency(totalAmount)} processed
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedPayments}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              {((completedPayments / totalPayments) * 100 || 0).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{pendingPayments}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{failedPayments}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              {((failedPayments / totalPayments) * 100 || 0).toFixed(1)}% failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
          <CardDescription>
            Breakdown of payments by method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(paymentsByMethod).map(([method, amount]) => (
              <div key={method} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getMethodIcon(method)}
                  <span className="font-medium">{getMethodLabel(method)}</span>
                </div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(amount)}</div>
                <p className="text-sm text-muted-foreground">
                  {payments.filter(p => p.method === method && p.status === 'completed').length} payments
                </p>
              </div>
            ))}
            
            {Object.keys(paymentsByMethod).length === 0 && (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                <p>No payment data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
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

      {/* Payments Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Track and manage customer payments
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">Invoice</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Method</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Transaction ID</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/10">
                    <td className="p-3">
                      <div className="font-medium">#{payment.invoiceId.substring(0, 8)}</div>
                    </td>
                    <td className="p-3 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        {getMethodIcon(payment.method)}
                        <span>{getMethodLabel(payment.method)}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={cn("flex items-center space-x-1", getStatusColor(payment.status))}>
                        {getStatusIcon(payment.status)}
                        <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                      </Badge>
                    </td>
                    <td className="p-3">{formatDate(payment.processedDate)}</td>
                    <td className="p-3">
                      <span className="font-mono text-xs">
                        {payment.transactionId ? payment.transactionId : '-'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewPaymentDetails?.(payment)}>
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payments found matching your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}