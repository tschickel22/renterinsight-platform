import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, CheckCircle, Clock, Calendar } from 'lucide-react'
import { QuoteAcceptanceCard } from '../components/QuoteAcceptanceCard'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Mock quotes data
const mockQuotes = [
  {
    id: 'Q-2024-001',
    title: 'Forest River Georgetown',
    description: 'Class A Motorhome with premium features',
    amount: 125000,
    status: 'pending',
    expiresAt: new Date('2024-04-30'),
    createdAt: new Date('2024-04-01')
  },
  {
    id: 'Q-2024-002',
    title: 'Extended Warranty Package',
    description: '3-year comprehensive warranty coverage',
    amount: 2500,
    status: 'accepted',
    expiresAt: new Date('2024-03-15'),
    acceptedAt: new Date('2024-03-10'),
    createdAt: new Date('2024-03-01')
  }
]

export function Quotes() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'expired':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
        <p className="text-muted-foreground">
          View and manage your quotes
        </p>
      </div>

      {/* Active Quote */}
      {mockQuotes.find(q => q.status === 'pending') && (
        <QuoteAcceptanceCard 
          quote={mockQuotes.find(q => q.status === 'pending')!}
          onAccept={() => console.log('Quote accepted')}
          onReject={() => console.log('Quote rejected')}
        />
      )}

      {/* All Quotes */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>Your quote history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{quote.title}</h3>
                    <Badge className={cn("ri-badge-status", getStatusColor(quote.status))}>
                      {getStatusIcon(quote.status)}
                      <span className="ml-1">{quote.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {quote.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="font-medium">{formatCurrency(quote.amount)}</span>
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {quote.status === 'accepted' 
                        ? `Accepted on ${quote.acceptedAt?.toLocaleDateString()}` 
                        : `Expires on ${quote.expiresAt.toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}

            {mockQuotes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No quotes available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}