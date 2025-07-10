import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Receipt, Plus, Search, Filter, Send, Eye, Download, CreditCard, TrendingUp, DollarSign, CheckCircle, XCircle, Clock, Table as Tabs } from 'lucide-react'
import { Invoice, InvoiceStatus, Payment, PaymentStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useInvoiceManagement } from './hooks/useInvoiceManagement'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoiceDetail } from './components/InvoiceDetail'
import { PaymentHistory } from './components/PaymentHistory'
import { Tabs as TabsComponent, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateInvoicePDF } from './utils' // Import the new utility function
import { useTenant } from '@/contexts/TenantContext' // Import useTenant

function InvoicesList() {
  const {
    invoices,
    payments,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    sendInvoice,
    sendPaymentRequest,
    recordPayment
  } = useInvoiceManagement()
  const { toast } = useToast()
  const { tenant } = useTenant() // Use useTenant hook
  const [searchTerm, setSearchTerm] = useState('')
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('invoices')
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

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

  const filteredInvoices = Array.isArray(invoices)
    ? invoices.filter(invoice => {
        const matchesSearch =
          (invoice?.number?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false) ||
          (invoice?.customerId?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false)

        let matchesStatus = true;
        if (invoiceStatusFilter === 'all') {
          matchesStatus = true;
        } else if (invoiceStatusFilter === 'outstanding') {
          matchesStatus = invoice?.status !== InvoiceStatus.PAID;
        } else if (invoiceStatusFilter === 'paidThisMonth') {
          const now = new Date();
          matchesStatus = invoice?.status === InvoiceStatus.PAID &&
                          invoice?.paidDate?.getMonth() === now.getMonth() &&
                          invoice?.paidDate?.getFullYear() === now.getFullYear();
        } else {
          matchesStatus = invoice?.status === invoiceStatusFilter;
        }

        return matchesSearch && matchesStatus
      })
    : []

  const handleCreateInvoice = () => {
    setSelectedInvoice(null)
    setShowInvoiceForm(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceForm(true)
    setShowInvoiceDetail(false)
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDetail(true)
  }

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (selectedInvoice) {
        // Update existing invoice
        await updateInvoice(selectedInvoice.id, invoiceData)
        toast({
          title: 'Success',
          description: 'Invoice updated successfully',
        })
      } else {
        // Create new invoice
        await createInvoice(invoiceData)
        toast({
          title: 'Success',
          description: 'Invoice created successfully',
        })
      }
      setShowInvoiceForm(false)
      setSelectedInvoice(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedInvoice ? 'update' : 'create'} invoice`,
        variant: 'destructive'
      })
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(invoiceId)
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete invoice',
          variant: 'destructive'
        })
      }
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoice(invoiceId)
      toast({
        title: 'Success',
        description: 'Invoice sent successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invoice',
        variant: 'destructive'
      })
    }
  }

  const handleSendPaymentRequest = async (invoiceId: string) => {
    try {
      await sendPaymentRequest(invoiceId)
      return true
    } catch (error) {
      console.error('Error sending payment request:', error)
      throw error
    }
  }

  const handleRecordPayment = async (paymentData: Partial<Payment>) => {
    try {
      await recordPayment(paymentData)
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      })
      return true
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment',
        variant: 'destructive'
      })
      throw error
    }
  }

  const handlePrintInvoicePDF = (invoice: Invoice) => {
    try {
      generateInvoicePDF(invoice, tenant) // Call the utility function
      toast({
        title: 'PDF Generated',
        description: `Invoice ${invoice?.number} PDF has been downloaded`,
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      })
    }
  }

  const totalPaymentsCount = Array.isArray(payments) ? payments.filter(p => p?.status === 'completed')?.length || 0 : 0;
  const totalInvoicesCount = Array.isArray(invoices) ? invoices.length : 0;
  const outstandingInvoicesValue = Array.isArray(invoices)
    ? invoices.filter(i => i?.status !== InvoiceStatus.PAID).reduce((sum, i) => sum + (i?.total || 0), 0)
    : 0;
  const paidThisMonthValue = Array.isArray(invoices)
    ? invoices.filter(i => {
        const paidDate = i?.paidDate;
        if (!paidDate) return false;
        const now = new Date();
        return i?.status === InvoiceStatus.PAID &&
               paidDate.getMonth() === now.getMonth() &&
               paidDate.getFullYear() === now.getFullYear();
      }).reduce((sum, i) => sum + (i?.total || 0), 0)
    : 0;

  return (
    <div className="space-y-8">
      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={selectedInvoice || undefined}
          onSave={handleSaveInvoice}
          onCancel={() => {
            setShowInvoiceForm(false)
            setSelectedInvoice(null)
          }}
        />
      )}

      {/* Invoice Detail Modal */}
      {showInvoiceDetail && selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          payments={Array.isArray(payments) ? payments.filter(p => p?.invoiceId === selectedInvoice?.id) : []}
          onClose={() => setShowInvoiceDetail(false)}
          onEdit={handleEditInvoice}
          onSendPaymentRequest={handleSendPaymentRequest}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Invoice & Payments</h1>
            <p className="ri-page-description">
              Manage invoices and process payments
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer"
          onClick={() => { setActiveTab('invoices'); setInvoiceStatusFilter('all'); setPaymentStatusFilter('all'); }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalInvoicesCount}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All invoices
            </p>
          </CardContent>
        </Card>
        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 cursor-pointer"
          onClick={() => { setActiveTab('invoices'); setInvoiceStatusFilter('outstanding'); setPaymentStatusFilter('all'); }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Outstanding</CardTitle>
            <Receipt className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(outstandingInvoicesValue)}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Unpaid invoices
            </p>
          </CardContent>
        </Card>
        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer"
          onClick={() => { setActiveTab('invoices'); setInvoiceStatusFilter('paidThisMonth'); setPaymentStatusFilter('all'); }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Paid This Month</CardTitle>
            <Receipt className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(paidThisMonthValue)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Revenue collected
            </p>
          </CardContent>
        </Card>
        <Card
          className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 cursor-pointer"
          onClick={() => { setActiveTab('payments'); setPaymentStatusFilter('completed'); setInvoiceStatusFilter('all'); }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Payment Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {totalPaymentsCount > 0 ? ((totalPaymentsCount / (Array.isArray(payments) ? payments.length : 1)) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              {totalPaymentsCount} successful payments
            </p>
          </CardContent>
        </Card>
      </div>

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
        <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
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
            {Array.isArray(filteredInvoices) && filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div key={invoice?.id} className="ri-table-row">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{invoice?.number}</h3>
                        <Badge className={cn("ri-badge-status", getStatusColor(invoice?.status || InvoiceStatus.DRAFT))}>
                          {invoice?.status?.toUpperCase() || 'N/A'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Customer:</span>
                          <span className="ml-1">{invoice?.customerId}</span>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <span className="ml-1 font-bold text-primary">{formatCurrency(invoice?.total || 0)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Due Date:</span>
                          <span className="ml-1">{invoice?.dueDate ? formatDate(invoice.dueDate) : 'N/A'}</span>
                        </div>
                        {invoice?.paidDate && (
                          <div>
                            <span className="font-medium">Paid Date:</span>
                            <span className="ml-1">{formatDate(invoice.paidDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 bg-muted/30 p-2 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(invoice?.items) ? invoice.items.length : 0} item(s)
                        </p>
                        {invoice?.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Notes:</span> {invoice.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ri-action-buttons">
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm"
                      onClick={() => invoice && handleViewInvoice(invoice)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm"
                      onClick={() => invoice && handleEditInvoice(invoice)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm"
                      onClick={() => invoice && handlePrintInvoicePDF(invoice)} // Call the new function here
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                    {invoice?.status !== InvoiceStatus.PAID && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-sm"
                        onClick={() => invoice?.id && handleSendPaymentRequest(invoice.id)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send Payment Request
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No invoices found</p>
                <p className="text-sm">Create your first invoice to get started</p>
              </div>
            )}
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

