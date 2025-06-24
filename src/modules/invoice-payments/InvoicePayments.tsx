import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Receipt, Plus, Search, Filter, Send, Eye, Download, CreditCard, TrendingUp, DollarSign } from 'lucide-react'
import { Invoice, InvoiceStatus, Payment, PaymentStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const mockInvoices: Invoice[] = [
  {
    id: '1',
    customerId: 'cust-1',
    number: 'INV-2024-001',
    items: [
      {
        id: '1',
        description: '2024 Forest River Georgetown',
        quantity: 1,
        unitPrice: 125000,
        total: 125000
      },
      {
        id: '2',
        description: 'Extended Warranty',
        quantity: 1,
        unitPrice: 2500,
        total: 2500
      }
    ],
    subtotal: 127500,
    tax: 10200,
    total: 137700,
    status: InvoiceStatus.PAID,
    dueDate: new Date('2024-02-15'),
    paidDate: new Date('2024-01-20'),
    paymentMethod: 'Credit Card',
    notes: 'Payment received via Zego',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    customerId: 'cust-2',
    number: 'INV-2024-002',
    items: [
      {
        id: '3',
        description: 'Service - AC Repair',
        quantity: 1,
        unitPrice: 620,
        total: 620
      }
    ],
    subtotal: 620,
    tax: 49.60,
    total: 669.60,
    status: InvoiceStatus.SENT,
    dueDate: new Date('2024-02-20'),
    notes: 'Service invoice for AC repair',
    customFields: {},
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18')
  }
]

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 137700,
    method: 'CREDIT_CARD' as any,
    status: 'COMPLETED' as PaymentStatus,
    transactionId: 'txn_1234567890',
    processedDate: new Date('2024-01-20'),
    notes: 'Processed via Zego payment gateway',
    customFields: {},
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

function InvoicesList() {
  const [invoices] = useState<Invoice[]>(mockInvoices)
  const [payments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case InvoiceStatus.SENT:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case InvoiceStatus.VIEWED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case InvoiceStatus.PAID:
        return 'bg-green-50 text-green-700 border-green-200'
      case InvoiceStatus.OVERDUE:
        return 'bg-red-50 text-red-700 border-red-200'
      case InvoiceStatus.CANCELLED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Invoice & Payments</h1>
            <p className="ri-page-description">
              Manage invoices and process payments via Zego integration
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{invoices.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All invoices
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Outstanding</CardTitle>
            <Receipt className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(invoices.filter(i => i.status !== InvoiceStatus.PAID).reduce((sum, i) => sum + i.total, 0))}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Unpaid invoices
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Paid This Month</CardTitle>
            <Receipt className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, i) => sum + i.total, 0))}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Revenue collected
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Payment Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">98.5%</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Excellent rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zego Integration Info */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Zego Payment Integration</span>
          </CardTitle>
          <CardDescription className="text-blue-700">
            Seamlessly process payments and send payment requests to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <p className="text-sm text-blue-700">Uptime</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.9%</div>
              <p className="text-sm text-blue-700">Processing Fee</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <p className="text-sm text-blue-700">Support</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search invoices..."
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

      {/* Invoices Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Invoices</CardTitle>
          <CardDescription>
            Manage invoices and track payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{invoice.number}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(invoice.status))}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> 
                        <span className="ml-1">{invoice.customerId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> 
                        <span className="ml-1 font-bold text-primary">{formatCurrency(invoice.total)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> 
                        <span className="ml-1">{formatDate(invoice.dueDate)}</span>
                      </div>
                      {invoice.paidDate && (
                        <div>
                          <span className="font-medium">Paid Date:</span> 
                          <span className="ml-1">{formatDate(invoice.paidDate)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {invoice.items.length} item(s) - {invoice.notes}
                      </p>
                      {invoice.paymentMethod && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Payment Method:</span> {invoice.paymentMethod}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  {invoice.status !== InvoiceStatus.PAID && (
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Send className="h-3 w-3 mr-1" />
                      Send Payment Request
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InvoicePayments() {
  return (
    <Routes>
      <Route path="/" element={<InvoicesList />} />
      <Route path="/*" element={<InvoicesList />} />
    </Routes>
  )
}