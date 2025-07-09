import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Plus, Search, Filter, Eye, Edit, Send, Copy, Trash2, DollarSign, Calendar, X } from 'lucide-react'
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
              {Array.isArray(quote.items) && quote.items.length > 0 ? (
                quote.items.map((item, index) => (
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
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No items in this quote.</p>
              )}
            </div>
          </div>

          {/* Quote Totals */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
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
        </CardContent>
      </Card>
    </div>
  )
}

export function QuotesList() {
  const {
    quotes,
    createQuote,
    updateQuote,
    deleteQuote,
    duplicateQuote,
    sendQuote,
  } = useQuoteManagement()

  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null)

  useEffect(() => {
    if (!viewingQuote && quoteToEdit) {
      setEditingQuote(quoteToEdit)
      setSelectedCustomerId(quoteToEdit.customerId)
      setShowQuoteBuilder(true)
      setQuoteToEdit(null)
    }
  }, [viewingQuote, quoteToEdit])

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'viewed': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'accepted': return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      case 'expired': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredQuotes = Array.isArray(quotes)
    ? quotes.filter(quote => {
        const matchesSearch =
          quote.id?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          quote.customerId?.toLowerCase()?.includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
        return matchesSearch && matchesStatus
      })
    : []

  const handleCreateQuote = () => {
    setEditingQuote(null)
    setSelectedCustomerId('')
    setShowQuoteBuilder(true)
  }

  const handleEditQuote = (quote: Quote) => {
    setViewingQuote(null)
    setQuoteToEdit(quote)
  }

  const handleViewQuote = (quote: Quote) => {
    setViewingQuote(quote)
  }

  const handleCloseView = () => setViewingQuote(null)

  const handleSaveQuote = async (quoteData: any) => {
    try {
      if (editingQuote) {
        await updateQuote(editingQuote.id, quoteData)
        toast({ title: 'Success', description: 'Quote updated successfully' })
      } else {
        await createQuote(quoteData)
        toast({ title: 'Success', description: 'Quote created successfully' })
      }
      setShowQuoteBuilder(false)
      setEditingQuote(null)
    } catch (error) {
      console.error("Error saving quote:", error)
      toast({ title: 'Error', description: 'Failed to save quote', variant: 'destructive' })
    }
  }

  const handleSendQuote = async (quoteId: string) => {
    try {
      await sendQuote(quoteId)
      toast({ title: 'Success', description: 'Quote sent to customer' })
    } catch (error) {
      console.error("Error sending quote:", error)
      toast({ title: 'Error', description: 'Failed to send quote', variant: 'destructive' })
    }
  }

  const handleDuplicateQuote = async (quoteId: string) => {
    try {
      await duplicateQuote(quoteId)
      toast({ title: 'Success', description: 'Quote duplicated successfully' })
    } catch (error) {
      console.error("Error duplicating quote:", error)
      toast({ title: 'Error', description: 'Failed to duplicate quote', variant: 'destructive' })
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteQuote(quoteId)
        toast({ title: 'Success', description: 'Quote deleted successfully' })
      } catch (error) {
        console.error("Error deleting quote:", error)
        toast({ title: 'Error', description: 'Failed to delete quote', variant: 'destructive' })
      }
    }
  }

  const stats = {
    total: filteredQuotes.length,
    draft: filteredQuotes.filter(q => q.status === 'draft').length,
    sent: filteredQuotes.filter(q => q.status === 'sent').length,
    accepted: filteredQuotes.filter(q => q.status === 'accepted').length,
    totalValue: filteredQuotes.reduce((sum, q) => sum + (q.total || 0), 0),
    acceptedValue: filteredQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total || 0), 0)
  }

  return (
    <div className="space-y-8">
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

      {viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={handleCloseView}
          onEdit={handleEditQuote}
        />
      )}

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

      <div className="ri-stats-grid">
        {/* Stats Cards omitted for brevity; keep yours as-is */}
      </div>

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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quotes ({filteredQuotes.length})</CardTitle>
          <CardDescription>
            Manage customer quotes with advanced pricing and bundling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(filteredQuotes) && filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <div key={quote.id} className="ri-table-row">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">Quote #{quote.id}</h3>
                        <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                          {quote.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div><span className="font-medium">Customer:</span> {quote.customerId}</div>
                        <div><span className="font-medium">Total:</span> <span className="ml-1 font-bold text-primary">{formatCurrency(quote.total)}</span></div>
                        <div><span className="font-medium">Created:</span> {formatDate(quote.createdAt)}</div>
                        <div><span className="font-medium">Valid Until:</span> {formatDate(quote.validUntil)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="ri-action-buttons">
                    <Button variant="outline" size="sm" className="shadow-sm" onClick={() => handleViewQuote(quote)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="shadow-sm" onClick={() => handleEditQuote(quote)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {quote.status === 'draft' && (
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={() => handleSendQuote(quote.id)}>
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="shadow-sm" onClick={() => handleDuplicateQuote(quote.id)}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="shadow-sm text-red-600 hover:text-red-700" onClick={() => handleDeleteQuote(quote.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
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

