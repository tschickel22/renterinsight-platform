import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { Quote, QuoteStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ClientQuoteDetailModal } from './ClientQuoteDetailModal'

interface ClientQuotesProps {
  customerId: string
  quotes: Quote[]
  acceptQuote: (quoteId: string) => Promise<void>
  rejectQuote: (quoteId: string) => Promise<void>
}

export function ClientQuotes({ customerId, quotes, acceptQuote, rejectQuote }: ClientQuotesProps) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const customerQuotes = quotes.filter(quote => quote.customerId === customerId)

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
    setSelectedQuote(quote)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedQuote(null)
  }

  return (
    <div className="space-y-6">
      {showDetailModal && selectedQuote && (
        <ClientQuoteDetailModal
          quote={selectedQuote}
          onClose={handleCloseModal}
          onAccept={acceptQuote}
          onReject={rejectQuote}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Quotes</h2>
          <p className="text-muted-foreground">
            View and manage quotes for your Home/RV
          </p>
        </div>
      </div>

      {customerQuotes.length > 0 ? (
        <div className="space-y-4">
          {customerQuotes.map((quote) => (
            <Card key={quote.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Quote #{quote.id}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                        {quote.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Valid until {formatDate(quote.validUntil)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <div className="text-2xl font-bold text-primary">{formatCurrency(quote.total)}</div>
                    <div className="text-sm text-muted-foreground">{quote.items.length} items</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleViewQuote(quote)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  
                  {quote.status === QuoteStatus.SENT && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="shadow-sm"
                        onClick={() => handleViewQuote(quote)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept Quote
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shadow-sm text-red-600 hover:text-red-700"
                        onClick={() => handleViewQuote(quote)}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quotes Found</h3>
            <p className="text-muted-foreground text-center">
              You don't have any quotes at the moment. Contact your dealer for more information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}