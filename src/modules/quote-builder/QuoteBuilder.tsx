import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Search, Filter, Send, Edit, Eye, TrendingUp, DollarSign } from 'lucide-react'
import { Quote, QuoteStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const mockQuotes: Quote[] = [
  {
    id: '1',
    customerId: 'cust-1',
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
    notes: 'Customer interested in financing options',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    customerId: 'cust-2',
    vehicleId: 'veh-2',
    items: [
      {
        id: '3',
        description: '2023 Winnebago View',
        quantity: 1,
        unitPrice: 89000,
        total: 89000
      }
    ],
    subtotal: 89000,
    tax: 7120,
    total: 96120,
    status: QuoteStatus.ACCEPTED,
    validUntil: new Date('2024-02-20'),
    notes: 'Ready to proceed with purchase',
    customFields: {},
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18')
  }
]

function QuotesList() {
  const [quotes] = useState<Quote[]>(mockQuotes)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredQuotes = quotes.filter(quote =>
    quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Quote Builder</h1>
            <p className="ri-page-description">
              Create and manage customer quotes
            </p>
          </div>
          <Button className="shadow-sm">
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
            <div className="text-2xl font-bold text-blue-900">{quotes.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 this week
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {quotes.filter(q => q.status === QuoteStatus.SENT || q.status === QuoteStatus.VIEWED).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
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
            <div className="text-2xl font-bold text-green-900">
              {quotes.filter(q => q.status === QuoteStatus.ACCEPTED).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              50% acceptance rate
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
              {formatCurrency(quotes.reduce((sum, q) => sum + q.total, 0))}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Total pipeline value
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
        <Button variant="outline" className="shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Quotes Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quotes</CardTitle>
          <CardDescription>
            Manage customer quotes and proposals
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
                        {quote.items.length} item(s) - {quote.notes}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Send className="h-3 w-3 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function QuoteBuilder() {
  return (
    <Routes>
      <Route path="/" element={<QuotesList />} />
      <Route path="/*" element={<QuotesList />} />
    </Routes>
  )
}