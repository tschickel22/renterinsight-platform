import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface QuoteAcceptanceCardProps {
  quote: {
    id: string
    title: string
    description: string
    amount: number
    expiresAt: Date
  }
  onAccept: () => void
  onReject: () => void
}

export function QuoteAcceptanceCard({ quote, onAccept, onReject }: QuoteAcceptanceCardProps) {
  // Calculate days remaining until expiration
  const today = new Date()
  const expiresAt = new Date(quote.expiresAt)
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  
  const isExpiringSoon = daysRemaining <= 3
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Quote Ready for Review</CardTitle>
              <CardDescription>
                {quote.id} - {quote.title}
              </CardDescription>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${isExpiringSoon ? 'text-red-600' : 'text-blue-600'}`}>
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-white/70 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{quote.title}</h3>
              <div className="text-xl font-bold text-blue-700">{formatCurrency(quote.amount)}</div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {quote.description}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Valid until: {quote.expiresAt.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button onClick={onAccept}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Quote
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}