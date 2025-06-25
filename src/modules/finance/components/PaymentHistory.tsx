import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, CreditCard, Calendar, Download, Printer, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Mock payment history data
const mockPayments = [
  {
    id: '1',
    loanId: '1',
    customerId: 'cust-1',
    customerName: 'John Smith',
    amount: 1621.23,
    scheduledDate: new Date('2024-01-15'),
    paymentDate: new Date('2024-01-15'),
    status: 'completed',
    method: 'credit_card',
    notes: 'On-time payment',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    loanId: '2',
    customerId: 'cust-2',
    customerName: 'Sarah Johnson',
    amount: 1142.62,
    scheduledDate: new Date('2024-01-01'),
    paymentDate: new Date('2024-01-03'),
    status: 'completed',
    method: 'bank_transfer',
    notes: 'Payment received 2 days late',
    createdAt: new Date('2024-01-03')
  },
  {
    id: '3',
    loanId: '1',
    customerId: 'cust-1',
    customerName: 'John Smith',
    amount: 1621.23,
    scheduledDate: new Date('2024-02-15'),
    status: 'pending',
    createdAt: new Date('2024-01-15')
  }
]

export function PaymentHistory() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'late':
        return 'bg-orange-50 text-orange-700 border-orange-200'
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
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'late':
        return <Clock className="h-4 w-4 text-orange-500" />
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
      default:
        return method
    }
  }

  // Filter payments based on search term and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    let matchesDate = true
    const now = new Date()
    const paymentDate = payment.scheduledDate
    
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
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleExport = () => {
    // Create CSV content
    const headers = ["ID", "Customer", "Amount", "Scheduled Date", "Payment Date", "Status", "Method", "Notes"]
    const csvContent = [
      headers.join(","),
      ...filteredPayments.map(payment => [
        payment.id,
        payment.customerName,
        payment.amount.toFixed(2),
        payment.scheduledDate.toISOString().split('T')[0],
        payment.paymentDate ? payment.paymentDate.toISOString().split('T')[0] : '',
        payment.status,
        payment.method || '',
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
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Payment History
              </CardTitle>
              <CardDescription>
                Track and manage customer loan payments
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
        <CardContent className="space-y-4">
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
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="late">Late</SelectItem>
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Scheduled Date</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Payment Date</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Method</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/10">
                    <td className="p-3">
                      <div className="font-medium">{payment.customerName}</div>
                      <div className="text-xs text-muted-foreground">Loan #{payment.loanId}</div>
                    </td>
                    <td className="p-3 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="p-3">{formatDate(payment.scheduledDate)}</td>
                    <td className="p-3">{payment.paymentDate ? formatDate(payment.paymentDate) : '-'}</td>
                    <td className="p-3">
                      <Badge className={cn("flex items-center space-x-1", getStatusColor(payment.status))}>
                        {getStatusIcon(payment.status)}
                        <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                      </Badge>
                    </td>
                    <td className="p-3">{payment.method ? getMethodLabel(payment.method) : '-'}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {payment.status === 'pending' && (
                          <Button variant="ghost" size="sm">
                            Record
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No payments found matching your filters
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