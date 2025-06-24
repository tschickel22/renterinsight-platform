import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Plus, Search, Filter, Eye, Edit, Send, Copy, Trash2, Download, TrendingUp, DollarSign, Calendar, X } from 'lucide-react'
import { QuoteBuilder } from './QuoteBuilder'
import { useQuoteManagement, Quote } from '../hooks/useQuoteManagement'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// Quote Detail Modal Component
interface QuoteDetailModalProps {
  quote: Quote
  onClose: () => void
  onEdit: (quote: Quote) => void
}

function QuoteDetailModal({ quote, onClose, onEdit }: QuoteDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Quote #{quote.id}</CardTitle>
              <CardDescription>
                Quote details and line items
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(quote)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Quote
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quote Header Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
              <p className="font-medium">{quote.customerId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                  {quote.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created Date</label>
              <p className="font-medium">{formatDate(quote.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Valid Until</label>
              <p className="font-medium">{formatDate(quote.validUntil)}</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            <div className="space-y-3">
              {quote.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                    {item.isBundle && (
                      <Badge className="mt-1 bg-purple-50 text-purple-700 border-purple-200">
                        Bundle
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatCurrency(item.total)}</div>
                    {item.discount > 0 && (
                      <div className="text-sm text-green-600">
                        -{item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)} discount
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Totals */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
              {quote.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Total Discount:</span>
                  <span>-{formatCurrency(quote.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(quote.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <div className="mt-1 p-3 bg-muted/30 rounded-md">
                <p className="text-sm">{quote.notes}</p>
              </div>
            </div>
          )}

          {/* Terms */}
          {quote.terms && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Terms & Conditions</label>
              <div className="mt-1 p-3 bg-muted/30 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{quote.terms}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function for status colors (moved outside component to avoid re-creation)
function getStatusColor(status: Quote['status']) {
  switch (status) {
    case 'draft':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'sent':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'viewed':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'accepted':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'expired':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export function QuotesList() {
  const {
    quotes,
    loading,
    createQuote,
    updateQuote,
    deleteQuote,
    duplicateQuote,
    sendQuote,
    acceptQuote,
    rejectQuote
  } = useQuoteManagement()

  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'viewed':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'expired':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateQuote = () => {
    setEditingQuote(null)
    setSelectedCustomerId('')
    setShowQuoteBuilder(true)
  }

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote)
    setSelectedCustomerId(quote.customerId)
    setShowQuoteBuilder(true)
  }

  const handleViewQuote = (quote: Quote) => {
    setViewingQuote(quote)
  }

  const handleCloseView = () => setViewingQuote(null)

  const handleSaveQuote = async (quoteData: any) => {
    try {
      if (editingQuote) {
        await updateQuote(editingQuote.id, quoteData)
        toast({
          title: 'Success',
          description: 'Quote updated successfully',
        })
      } else {
        await createQuote(quoteData)
        toast({
          title: 'Success',
          description: 'Quote created successfully',
        })
      }
      setShowQuoteBuilder(false)
      setEditingQuote(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive'
      })
    }
  }

  const handleSendQuote = async (quoteId: string) => {
    try {
      await sendQuote(quoteId)
      toast({
        title: 'Success',
        description: 'Quote sent to customer',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send quote',
        variant: 'destructive'
      })
    }
  }

  const handleDuplicateQuote = async (quoteId: string) => {
    try {
      await duplicateQuote(quoteId)
      toast({
        title: 'Success',
        description: 'Quote duplicated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate quote',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteQuote(quoteId)
        toast({
          title: 'Success',
          description: 'Quote deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete quote',
          variant: 'destructive'
        })
      }
    }
  }

  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.reduce((sum, q) => sum + q.total, 0),
    acceptedValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0)
  }

  return (
    <div className="space-y-8">
      {/* Quote Builder Modal */}
      {showQuoteBuilder && (
        <QuoteBuilder
          quote={editingQuote}
          customerId={selectedCustomerId}
          onSave={handleSaveQuote}
          onCancel={() => {
            setShowQuoteBuilder(false)
            setEditingQuote(null)
          }}
        />
      )}

      {/* Quote Detail Modal */}
      {viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={handleCloseView}
          onEdit={handleEditQuote}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Quote Builder</h1>
            <p className="ri-page-description">
              Create and manage customer quotes with advanced pricing rules
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateQuote}>
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All quotes
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.sent}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Awaiting response
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Accepted</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.accepted}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% acceptance rate
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Quote Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatCurrency(stats.acceptedValue)} accepted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search quotes..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Quotes Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quotes ({filteredQuotes.length})</CardTitle>
          <CardDescription>
            Manage customer quotes with advanced pricing and bundling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">Quote #{quote.id}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                        {quote.status.toUpperCase()}
                      </Badge>
                      {quote.items.some(item => item.isBundle) && (
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                          Bundle
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {quote.customerId}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> 
                        <span className="font-bold text-primary ml-1">{formatCurrency(quote.total)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(quote.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span> {formatDate(quote.validUntil)}
                      </div>
                    </div>
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {quote.items.length} item(s)
                        {quote.totalDiscount > 0 && (
                          <span className="text-green-600 ml-2">
                            • {formatCurrency(quote.totalDiscount)} discount applied
                          </span>
                        )}
                      </p>
                      {quote.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Notes:</span> {quote.notes}
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
                    onClick={() => handleViewQuote(quote)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleEditQuote(quote)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {quote.status === 'draft' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => handleSendQuote(quote.id)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleDuplicateQuote(quote.id)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteQuote(quote.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No quotes found</p>
                <p className="text-sm">Create your first quote to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}