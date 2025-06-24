import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Search, Filter, Send, Edit, Eye } from 'lucide-react'
import { Quote, QuoteStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

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
        return 'bg-gray-100 text-gray-800'
      case QuoteStatus.SENT:
        return 'bg-blue-100 text-blue-800'
      case QuoteStatus.VIEWED:
        return 'bg-yellow-100 text-yellow-800'
      case QuoteStatus.ACCEPTED:
        return 'bg-green-100 text-green-800'
      case QuoteStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case QuoteStatus.EXPIRED:
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredQuotes = quotes.filter(quote =>
    quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quote Builder</h1>
          <p className="text-muted-foreground">
            Create and manage customer quotes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter(q => q.status === QuoteStatus.SENT || q.status === QuoteStatus.VIEWED).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter(q => q.status === QuoteStatus.ACCEPTED).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(quotes.reduce((sum, q) => sum + q.total, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotes</CardTitle>
          <CardDescription>
            Manage customer quotes and proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Quote #{quote.id}</h3>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {quote.customerId}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {formatCurrency(quote.total)}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(quote.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span> {formatDate(quote.validUntil)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {quote.items.length} item(s) - {quote.notes}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
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