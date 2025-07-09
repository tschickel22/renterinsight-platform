// src/modules/reporting-suite/ReportingSuite.tsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
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

  const filteredInvoices = invoices
    .filter(invoice =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(invoice => statusFilter === 'all' || invoice.status === statusFilter)

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
          payments={payments.filter(p => p.invoiceId === selectedInvoice.id)}
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
              Manage invoices and process payments via Zego integration
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
              <CheckCircle className="h-3 w-3 mr-1" />
              {payments.filter(p => p.status === 'completed').length} successful payments
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

      {/* Main Content Tabs */}
      <TabsComponent value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices" className="flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={InvoiceStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={InvoiceStatus.SENT}>Sent</SelectItem>
                <SelectItem value={InvoiceStatus.VIEWED}>Viewed</SelectItem>
                <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                <SelectItem value={InvoiceStatus.OVERDUE}>Overdue</SelectItem>
                <SelectItem value={InvoiceStatus.CANCELLED}>Cancelled</SelectItem>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shadow-sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shadow-sm"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shadow-sm"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      {invoice.status !== InvoiceStatus.PAID && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shadow-sm"
                          onClick={() => handleSendPaymentRequest(invoice.id)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send Payment Request
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredInvoices.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No invoices found</p>
                    <p className="text-sm">Create your first invoice to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory 
            payments={payments} 
            onViewPaymentDetails={(payment) => {
              // Find the invoice for this payment
              const invoice = invoices.find(i => i.id === payment.invoiceId)
              if (invoice) {
                setSelectedInvoice(invoice)
                setShowInvoiceDetail(true)
                // Set the active tab to payments
                setTimeout(() => {
                  const tabsElement = document.querySelector('[role="tablist"]')
                  if (tabsElement) {
                    const paymentsTab = Array.from(tabsElement.children).find(
                      child => child.textContent?.includes('Payments')
                    ) as HTMLButtonElement
                    if (paymentsTab) paymentsTab.click()
                  }
                }, 100)
              }
            }}
          />
        </TabsContent>
      </TabsComponent>
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
``````typescript
// src/modules/reporting-suite/ReportingSuite.tsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, DollarSign, Users, Package, Plus } from 'lucide-react'
import { Report, ReportType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ReportGeneratorForm } from './components/ReportGeneratorForm'
import { ReportDisplayTable } from './components/ReportDisplayTable' 
import { useReportGenerator } from './hooks/useReportGenerator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardReports } from './components/DashboardReports'

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    type: ReportType.SALES,
    module: 'sales',
    filters: [],
    columns: [],
    data: [],
    generatedAt: new Date('2024-01-20'),
    generatedBy: 'admin'
  },
  {
    id: '2',
    name: 'Inventory Valuation',
    type: ReportType.INVENTORY,
    module: 'inventory',
    filters: [],
    columns: [],
    data: [],
    generatedAt: new Date('2024-01-19'),
    generatedBy: 'manager'
  },
  {
    id: '3',
    name: 'Service Revenue Analysis',
    type: ReportType.SERVICE,
    module: 'service',
    filters: [],
    columns: [],
    data: [],
    generatedAt: new Date('2024-01-18'),
    generatedBy: 'admin'
  }
]

const reportTemplates = [
  {
    id: 'sales-summary',
    name: 'Sales Summary',
    description: 'Overview of sales performance and metrics',
    type: ReportType.SALES,
    icon: DollarSign,
    color: 'from-green-50 to-green-100/50'
  },
  {
    id: 'inventory-report',
    name: 'Inventory Report',
    description: 'Current inventory levels and valuation',
    type: ReportType.INVENTORY,
    icon: Package,
    color: 'from-blue-50 to-blue-100/50'
  },
  {
    id: 'customer-analysis',
    name: 'Customer Analysis',
    description: 'Customer demographics and behavior insights',
    type: ReportType.CUSTOM,
    icon: Users,
    color: 'from-purple-50 to-purple-100/50'
  },
  {
    id: 'financial-overview',
    name: 'Financial Overview',
    description: 'Revenue, expenses, and profitability analysis',
    type: ReportType.FINANCIAL,
    icon: TrendingUp,
    color: 'from-orange-50 to-orange-100/50'
  }
]

function ReportingDashboard() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const { 
    reportData, 
    reportColumns, 
    loading, 
    currentReportConfig, 
    generateReport, 
    exportToCSV 
  } = useReportGenerator()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [reportConfigForForm, setReportConfigForForm] = useState<any>(null)

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.SALES:
        return 'bg-green-50 text-green-700 border-green-200'
      case ReportType.INVENTORY:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ReportType.SERVICE:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case ReportType.FINANCIAL:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case ReportType.CUSTOM:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  
  const handleGenerateReport = (config: any) => {
    generateReport(config)
  }
  
  const handleExportCSV = () => {
    exportToCSV()
  }
  
  const handleGenerateTemplateReport = (template: any) => {
    // Create a report config based on the template
    const config = {
      type: template.type,
      name: template.name,
      dateRange: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      filters: {}
    }
    
    console.log('handleGenerateTemplateReport called with config:', config);
    
    // Set the config for the form
    setReportConfigForForm(config)
    
    // Switch to the generator tab
    setActiveTab('generator')
    
    // Generate the report
    generateReport(config)
  }

  // Function to handle "Create Report" button click
  const handleCreateNewReport = () => {
    setActiveTab('generator'); // Switch to the Report Generator tab
    setReportConfigForForm(null); // Reset the form to create a new report
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Reporting Suite</h1>
            <p className="ri-page-description">
              Generate insights and analytics for your dealership
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateNewReport}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{reports.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All reports
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {reports.filter(r => r.generatedAt.getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Generated this month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Scheduled</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">5</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Automated reports
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Templates</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{reportTemplates.length}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Available templates
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardReports />
        </TabsContent>

        <TabsContent value="generator">
          {/* Report Templates */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Report Templates</CardTitle>
              <CardDescription>
                Quick start templates for common reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className={cn("overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br", template.color)}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <template.icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <Badge className={cn("ri-badge-status mt-1", getTypeColor(template.type))}>
                            {template.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full shadow-sm"
                        onClick={() => handleGenerateTemplateReport(template)}
                      >
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Generator Form */}
          <ReportGeneratorForm 
            onGenerate={handleGenerateReport}
            onExportCSV={handleExportCSV}
            isGenerating={loading}
            hasData={reportData.length > 0}
            initialReportConfig={reportConfigForForm}
          />

          {/* Report Display Table */}
          {reportData.length > 0 && currentReportConfig && (
            <ReportDisplayTable
              reportType={currentReportConfig.type}
              reportName={currentReportConfig.name}
              data={reportData}
              columns={reportColumns}
              onExportCSV={handleExportCSV}
            />
          )}
        </TabsContent>

        <TabsContent value="saved">
          {/* Previously Generated Reports */}
          {reports.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Saved Reports</CardTitle>
                <CardDescription>
                  Previously generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select a report template above to generate a new report</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ReportingSuite() {
  return (
    <Routes>
      <Route path="/" element={<ReportingDashboard />} />
      <Route path="/*" element={<ReportingDashboard />} />
    </Routes>
  )
}
