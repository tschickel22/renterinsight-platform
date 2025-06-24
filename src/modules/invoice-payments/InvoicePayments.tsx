import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Receipt, Plus, Search, Filter, Send, Eye, Download, CreditCard } from 'lucide-react'
import { Invoice, InvoiceStatus, Payment, PaymentStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

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
        return 'bg-gray-100 text-gray-800'
      case InvoiceStatus.SENT:
        return 'bg-blue-100 text-blue-800'
      case InvoiceStatus.VIEWED:
        return 'bg-yellow-100 text-yellow-800'
      case InvoiceStatus.PAID:
        return 'bg-green-100 text-green-800'
      case InvoiceStatus.OVERDUE:
        return 'bg-red-100 text-red-800'
      case InvoiceStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice & Payments</h1>
          <p className="text-muted-foreground">
            Manage invoices and process payments via Zego integration
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(invoices.filter(i => i.status !== InvoiceStatus.PAID).reduce((sum, i) => sum + i.total, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, i) => sum + i.total, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Zego Integration Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Zego Payment Integration</span>
          </CardTitle>
          <CardDescription>
            Seamlessly process payments and send payment requests to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.9%</div>
              <p className="text-sm text-muted-foreground">Processing Fee</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage invoices and track payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{invoice.number}</h3>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {invoice.customerId}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {formatCurrency(invoice.total)}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}
                      </div>
                      {invoice.paidDate && (
                        <div>
                          <span className="font-medium">Paid Date:</span> {formatDate(invoice.paidDate)}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
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
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  {invoice.status !== InvoiceStatus.PAID && (
                    <Button variant="outline" size="sm">
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