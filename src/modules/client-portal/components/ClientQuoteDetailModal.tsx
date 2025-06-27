import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, CheckCircle, XCircle, Download } from 'lucide-react'
import { Quote, QuoteStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ESignModal } from './ESignModal'

interface ClientQuoteDetailModalProps {
  quote: Quote
  onClose: () => void
  onAccept: (quoteId: string) => Promise<void>
  onReject: (quoteId: string) => Promise<void>
}

export function ClientQuoteDetailModal({ quote, onClose, onAccept, onReject }: ClientQuoteDetailModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showESignModal, setShowESignModal] = useState(false)

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

  const handleAccept = async () => {
    setShowESignModal(true)
  }

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to decline this quote?')) {
      setLoading(true)
      try {
        await onReject(quote.id)
        toast({
          title: 'Quote Declined',
          description: 'You have declined this quote.',
        })
        onClose()
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to decline quote. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSignSuccess = async (documentId: string, signatureData: string) => {
    setLoading(true)
    try {
      await onAccept(quote.id)
      toast({
        title: 'Quote Accepted',
        description: 'You have successfully accepted this quote.',
      })
      setShowESignModal(false)
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept quote. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: 'Download Started',
      description: 'Your quote PDF is being downloaded.',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {showESignModal ? (
        <ESignModal
          documentId={quote.id}
          documentUrl={`/quotes/quote-${quote.id}.pdf`}
          onSignSuccess={handleSignSuccess}
          onClose={() => setShowESignModal(false)}
        />
      ) : (
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
                <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                  {quote.status.toUpperCase()}
                </Badge>
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
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
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

            {/* Actions */}
            <div className="flex flex-wrap justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={handleDownloadPDF} className="mb-2 sm:mb-0">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              {quote.status === QuoteStatus.SENT && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleReject} 
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 mb-2 sm:mb-0"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline Quote
                  </Button>
                  <Button 
                    onClick={handleAccept} 
                    disabled={loading}
                    className="mb-2 sm:mb-0"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Quote
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}