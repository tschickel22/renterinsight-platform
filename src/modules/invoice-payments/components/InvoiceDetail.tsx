import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Edit, Receipt, DollarSign, Calendar, Clock, User, Printer, Download, Send, CreditCard, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Invoice, InvoiceStatus, Payment } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { RecordPaymentForm } from './RecordPaymentForm'

interface InvoiceDetailProps {
  invoice: Invoice
  payments: Payment[]
  onClose: () => void
  onEdit: (invoice: Invoice) => void
  onSendPaymentRequest?: (invoiceId: string) => Promise<void>
  onRecordPayment?: (paymentData: Partial<Payment>) => Promise<void>
}

export function InvoiceDetail({ 
  invoice, 
  payments, 
  onClose, 
  onEdit,
  onSendPaymentRequest,
  onRecordPayment
}: InvoiceDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('details')
  const [sendingRequest, setSendingRequest] = useState(false)
  const [showRecordPaymentForm, setShowRecordPaymentForm] = useState(false)

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

  const getPaymentStatusIcon = (status: string) => {
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
        return <AlertCircle className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case 'bank_transfer':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'cash':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'check':
        return <Receipt className="h-4 w-4 text-blue-500" />
      case 'financing':
        return <DollarSign className="h-4 w-4 text-purple-500" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const handlePrintPDF = () => {
    try {
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(20)
      doc.text('INVOICE', 105, 15, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Invoice #: ${invoice.number}`, 20, 30)
      doc.text(`Date: ${formatDate(invoice.createdAt)}`, 20, 40)
      doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 50)
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 60)
      
      // Add customer info
      doc.setFontSize(14)
      doc.text('Bill To:', 20, 75)
      
      doc.setFontSize(12)
      doc.text(`Customer ID: ${invoice.customerId}`, 20, 85)
      
      // Items table
      doc.setFontSize(14)
      doc.text('Invoice Items', 20, 105)
      
      // @ts-ignore
      doc.autoTable({
        startY: 110,
        head: [['Description', 'Quantity', 'Unit Price', 'Total']],
        body: invoice.items.map(item => [
          item.description,
          item.quantity,
          formatCurrency(item.unitPrice),
          formatCurrency(item.total)
        ]),
        foot: [
          ['', '', 'Subtotal:', formatCurrency(invoice.subtotal)],
          ['', '', 'Tax:', formatCurrency(invoice.tax)],
          ['', '', 'Total:', formatCurrency(invoice.total)]
        ],
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] }
      })
      
      // Notes
      if (invoice.notes) {
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY || 110
        
        doc.setFontSize(14)
        doc.text('Notes', 20, finalY + 20)
        
        doc.setFontSize(12)
        const splitNotes = doc.splitTextToSize(invoice.notes, 170)
        doc.text(splitNotes, 20, finalY + 30)
      }
      
      // Save the PDF
      doc.save(`invoice-${invoice.number}.pdf`)
      
      toast({
        title: 'PDF Generated',
        description: 'Invoice PDF has been downloaded',
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

  const handleSendPaymentRequest = async () => {
    if (!onSendPaymentRequest) return
    
    setSendingRequest(true)
    try {
      await onSendPaymentRequest(invoice.id)
      toast({
        title: 'Payment Request Sent',
        description: 'Payment request has been sent to the customer',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send payment request',
        variant: 'destructive'
      })
    } finally {
      setSendingRequest(false)
    }
  }

  const handleRecordPayment = async (paymentData: Partial<Payment>) => {
    if (!onRecordPayment) return
    
    try {
      await onRecordPayment(paymentData)
      setShowRecordPaymentForm(false)
    } catch (error) {
      throw error
    }
  }

  const invoicePayments = payments.filter(payment => payment.invoiceId === invoice.id)
  const totalPaid = invoicePayments.reduce((sum, payment) => sum + payment.amount, 0)
  const remainingBalance = invoice.total - totalPaid

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Record Payment Form Modal */}
      {showRecordPaymentForm && (
        <RecordPaymentForm
          invoiceId={invoice.id}
          invoiceTotal={invoice.total}
          remainingBalance={remainingBalance}
          onSave={handleRecordPayment}
          onCancel={() => setShowRecordPaymentForm(false)}
        />
      )}
      
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Invoice #{invoice.number}</CardTitle>
              <CardDescription>
                Invoice details and payment information
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(invoice)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Invoice
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="payments">
                Payments
                {invoicePayments.length > 0 && (
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
                    {invoicePayments.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Invoice Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("ri-badge-status", getStatusColor(invoice.status))}>
                  {invoice.status.toUpperCase()}
                </Badge>
                {invoice.paidDate && (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    PAID ON {formatDate(invoice.paidDate)}
                  </Badge>
                )}
                {invoice.status === InvoiceStatus.OVERDUE && (
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    OVERDUE
                  </Badge>
                )}
              </div>

              {/* Invoice Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{invoice.customerId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                  <p className="font-medium">{invoice.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                  <p className="font-medium">{formatDate(invoice.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
                {invoice.paidDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Paid Date</label>
                    <p className="font-medium">{formatDate(invoice.paidDate)}</p>
                  </div>
                )}
                {invoice.paymentMethod && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="font-medium">{invoice.paymentMethod}</p>
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
                <div className="space-y-3">
                  {invoice.items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(item.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                  {invoicePayments.length > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Paid:</span>
                        <span>{formatCurrency(totalPaid)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Balance Due:</span>
                        <span>{formatCurrency(remainingBalance)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm">{invoice.notes}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment History</h3>
                <div className="flex space-x-2">
                  {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED && (
                    <>
                      <Button 
                        onClick={handleSendPaymentRequest} 
                        disabled={sendingRequest}
                        size="sm"
                        variant="outline"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sendingRequest ? 'Sending...' : 'Send Payment Request'}
                      </Button>
                      
                      {onRecordPayment && remainingBalance > 0 && (
                        <Button 
                          onClick={() => setShowRecordPaymentForm(true)} 
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Record Payment
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {invoicePayments.length > 0 ? (
                <div className="space-y-4">
                  {invoicePayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">Payment #{payment.id.substring(0, 8)}</h4>
                          <Badge className={
                            payment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                            payment.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            payment.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            payment.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                            payment.status === 'refunded' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }>
                            <span className="flex items-center">
                              {getPaymentStatusIcon(payment.status)}
                              <span className="ml-1">
                            {payment.status.toUpperCase()}
                              </span>
                            </span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                            <span className="font-medium">Date:</span> 
                            <span className="ml-1">{formatDate(payment.processedDate)}</span>
                          </div>
                          <div className="flex items-center">
                            {getPaymentMethodIcon(payment.method)}
                            <span className="font-medium ml-1">Method:</span> 
                            <span className="ml-1">{payment.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                          {payment.transactionId && (
                            <div className="flex items-center">
                              <Receipt className="h-3 w-3 mr-1 text-purple-500" />
                              <span className="font-medium">Transaction ID:</span> 
                              <span className="ml-1 font-mono text-xs">{payment.transactionId}</span>
                            </div>
                          )}
                        </div>
                        {payment.notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted/20 p-2 rounded-md">
                            {payment.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">{formatCurrency(payment.amount)}</div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Invoice Total:</span>
                        <span>{formatCurrency(invoice.total)}</span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span className="font-medium">Total Paid:</span>
                        <span>{formatCurrency(totalPaid)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span className={remainingBalance > 0 ? 'text-red-700' : 'text-green-700'}>Balance Due:</span>
                        <span className={remainingBalance > 0 ? 'text-red-700' : 'text-green-700'}>{formatCurrency(remainingBalance)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No payments recorded for this invoice</p>
                  {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED && onRecordPayment && (
                    <Button 
                      onClick={() => setShowRecordPaymentForm(true)} 
                      className="mt-4"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  )}
                </div>
              )}

              {/* Zego Payment Information */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-800">Zego Payment Integration</CardTitle>
                  <CardDescription className="text-blue-700">
                    Secure payment processing for your customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-blue-700">
                    <p className="text-sm">
                      When you send a payment request, your customer will receive an email with a secure link to make their payment online.
                    </p>
                    <p className="text-sm">
                      Payments are processed securely through Zego's payment gateway, supporting credit cards, ACH transfers, and more.
                    </p>
                    <p className="text-sm font-medium">
                      Processing fee: 2.9% + $0.30 per transaction
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <h3 className="text-lg font-semibold">Invoice History</h3>
              
              <div className="space-y-4">
                <div className="relative pl-6 pb-6 border-l-2 border-muted">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="font-medium">Invoice Created</div>
                  <div className="text-sm text-muted-foreground">{formatDate(invoice.createdAt)}</div>
                </div>
                
                {invoice.status !== InvoiceStatus.DRAFT && (
                  <div className="relative pl-6 pb-6 border-l-2 border-muted">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
                    <div className="font-medium">Invoice Sent</div>
                    <div className="text-sm text-muted-foreground">{formatDate(invoice.updatedAt)}</div>
                  </div>
                )}
                
                {invoice.status === InvoiceStatus.VIEWED && (
                  <div className="relative pl-6 pb-6 border-l-2 border-muted">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                    <div className="font-medium">Invoice Viewed by Customer</div>
                    <div className="text-sm text-muted-foreground">{formatDate(invoice.updatedAt)}</div>
                  </div>
                )}
                
                {invoice.status === InvoiceStatus.PAID && invoice.paidDate && (
                  <div className="relative pl-6">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                    <div className="font-medium">Payment Received</div>
                    <div className="text-sm text-muted-foreground">{formatDate(invoice.paidDate)}</div>
                  </div>
                )}
                
                {invoice.status === InvoiceStatus.OVERDUE && (
                  <div className="relative pl-6">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-red-500"></div>
                    <div className="font-medium">Invoice Overdue</div>
                    <div className="text-sm text-muted-foreground">{formatDate(invoice.dueDate)}</div>
                  </div>
                )}
                
                {invoice.status === InvoiceStatus.CANCELLED && (
                  <div className="relative pl-6">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-500"></div>
                    <div className="font-medium">Invoice Cancelled</div>
                    <div className="text-sm text-muted-foreground">{formatDate(invoice.updatedAt)}</div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={handlePrintPDF}>
              <Printer className="h-4 w-4 mr-2" />
              Print PDF
            </Button>
            <div className="flex space-x-2">
              {invoice.status === InvoiceStatus.DRAFT && (
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </Button>
              )}
              {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED && (
                <>
                  <Button onClick={handleSendPaymentRequest} disabled={sendingRequest} variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    {sendingRequest ? 'Sending...' : 'Request Payment'}
                  </Button>
                  {onRecordPayment && remainingBalance > 0 && (
                    <Button onClick={() => setShowRecordPaymentForm(true)}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}