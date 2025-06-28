import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Check, X, Eye } from 'lucide-react'
import { Quote, QuoteStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface QuoteListProps {
  customerId: string
}

export function QuoteList({ customerId }: QuoteListProps) {
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showQuoteDetail, setShowQuoteDetail] = useState(false)

  // Fetch quotes on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For this demo, we'll use mock data
    const mockQuotes: Quote[] = [
      {
        id: 'Q-001',
        customerId: customerId,
        vehicleId: 'veh-1',
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
        status: QuoteStatus.SENT,
        validUntil: new Date('2024-02-15'),
        notes: 'Includes delivery and setup',
        customFields: {},
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'Q-002',
        customerId: customerId,
        vehicleId: 'veh-2',
        items: [
          {
            id: '3',
            description: 'Service Package - Annual Maintenance',
            quantity: 1,
            unitPrice: 1200,
            total: 1200
          }
        ],
        subtotal: 1200,
        tax: 96,
        total: 1296,
        status: QuoteStatus.VIEWED,
        validUntil: new Date('2024-02-20'),
        notes: 'Annual maintenance package',
        customFields: {},
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12')
      }
    ]
    
    setQuotes(mockQuotes)
  }, [customerId])

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case QuoteStatus.SENT:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case QuoteStatus.VIEWED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case QuoteStatus.ACCEPTED:
        return 'bg-green-50 text-green-700 border-green-200'
      case QuoteStatus.REJECTED:
        return 'bg-red-50 text-red-700 border-red-200'
      case QuoteStatus.EXPIRED:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleViewQuote = (quote: Quote) => {
    // In a real app, this would update the quote status to VIEWED if it's SENT
    if (quote.status === QuoteStatus.SENT) {
      const updatedQuotes = quotes.map(q => 
        q.id === quote.id ? { ...q, status: QuoteStatus.VIEWED, updatedAt: new Date() } : q
      )
      setQuotes(updatedQuotes)
    }
    
    setSelectedQuote(quote)
    setShowQuoteDetail(true)
  }

  const handleAcceptQuote = (quoteId: string) => {
    const updatedQuotes = quotes.map(q => 
      q.id === quoteId ? { ...q, status: QuoteStatus.ACCEPTED, updatedAt: new Date() } : q
    )
    setQuotes(updatedQuotes)
    setShowQuoteDetail(false)
    
    toast({
      title: 'Quote Accepted',
      description: 'Thank you for accepting the quote. A representative will contact you shortly.',
    })
  }

  const handleRejectQuote = (quoteId: string) => {
    const updatedQuotes = quotes.map(q => 
      q.id === quoteId ? { ...q, status: QuoteStatus.REJECTED, updatedAt: new Date() } : q
    )
    setQuotes(updatedQuotes)
    setShowQuoteDetail(false)
    
    toast({
      title: 'Quote Rejected',
      description: 'The quote has been rejected. Please contact us if you have any questions.',
    })
  }

  const handleDownloadQuote = (quoteId: string) => {
    toast({
      title: 'Download Started',
      description: 'Your quote is being downloaded as a PDF.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Quote Detail Modal */}
      {showQuoteDetail && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Quote #{selectedQuote.id}</CardTitle>
                  <CardDescription>
                    Created on {formatDate(selectedQuote.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("ri-badge-status", getStatusColor(selectedQuote.status))}>
                    {selectedQuote.status.toUpperCase()}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setShowQuoteDetail(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quote Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valid Until</label>
                  <p className="font-medium">{formatDate(selectedQuote.validUntil)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <p className="font-bold text-lg text-primary">{formatCurrency(selectedQuote.total)}</p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quote Items</h3>
                <div className="space-y-3">
                  {selectedQuote.items.map((item) => (
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

              {/* Quote Totals */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedQuote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedQuote.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedQuote.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedQuote.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm">{selectedQuote.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => handleDownloadQuote(selectedQuote.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {(selectedQuote.status === QuoteStatus.SENT || selectedQuote.status === QuoteStatus.VIEWED) && (
                  <>
                    <Button variant="outline" onClick={() => handleRejectQuote(selectedQuote.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button onClick={() => handleAcceptQuote(selectedQuote.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Accept Quote
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Your Quotes
          </CardTitle>
          <CardDescription>
            View and manage your quotes and proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">Quote #{quote.id}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                        {quote.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(quote.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span> {formatDate(quote.validUntil)}
                      </div>
                      <div>
                        <span className="font-medium">Items:</span> {quote.items.length}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {formatCurrency(quote.total)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadQuote(quote.id)}>
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" onClick={() => handleViewQuote(quote)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No quotes available</p>
                <p className="text-sm">Any quotes sent to you will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}