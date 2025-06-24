import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Plus, Search, Filter, TrendingUp, User, Calendar } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockCommissions: Commission[] = [
  {
    id: '1',
    salesPersonId: 'sales-001',
    dealId: 'deal-001',
    type: CommissionType.PERCENTAGE,
    rate: 0.05,
    amount: 6875,
    status: CommissionStatus.APPROVED,
    paidDate: new Date('2024-01-20'),
    notes: 'Commission for Georgetown sale',
    customFields: {},
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    salesPersonId: 'sales-002',
    dealId: 'deal-002',
    type: CommissionType.FLAT,
    rate: 0,
    amount: 2500,
    status: CommissionStatus.PENDING,
    notes: 'Flat commission for service contract',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

function CommissionsList() {
  const [commissions] = useState<Commission[]>(mockCommissions)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case CommissionStatus.APPROVED:
        return 'bg-blue-100 text-blue-800'
      case CommissionStatus.PAID:
        return 'bg-green-100 text-green-800'
      case CommissionStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: CommissionType) => {
    switch (type) {
      case CommissionType.FLAT:
        return 'bg-blue-100 text-blue-800'
      case CommissionType.PERCENTAGE:
        return 'bg-green-100 text-green-800'
      case CommissionType.TIERED:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCommissions = commissions.filter(commission =>
    commission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.salesPersonId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.dealId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commission Engine</h1>
          <p className="text-muted-foreground">
            Manage sales commissions and payouts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Commission
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {commissions.filter(c => c.status === CommissionStatus.PENDING).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(commissions.filter(c => c.status === CommissionStatus.PAID).reduce((sum, c) => sum + c.amount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(commissions.reduce((sum, c) => sum + c.amount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commissions..."
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

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commissions</CardTitle>
          <CardDescription>
            Track and manage sales commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommissions.map((commission) => (
              <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Commission #{commission.id}</h3>
                      <Badge className={getTypeColor(commission.type)}>
                        {commission.type.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span className="font-medium">Sales Person:</span> {commission.salesPersonId}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span className="font-medium">Deal:</span> {commission.dealId}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span className="font-medium">Amount:</span> {formatCurrency(commission.amount)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="font-medium">Created:</span> {formatDate(commission.createdAt)}
                      </div>
                    </div>
                    {commission.type === CommissionType.PERCENTAGE && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Rate:</span> {(commission.rate * 100).toFixed(2)}%
                      </div>
                    )}
                    {commission.paidDate && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Paid Date:</span> {formatDate(commission.paidDate)}
                      </div>
                    )}
                    {commission.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {commission.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  {commission.status === CommissionStatus.PENDING && (
                    <Button variant="outline" size="sm">
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CommissionEngine() {
  return (
    <Routes>
      <Route path="/" element={<CommissionsList />} />
      <Route path="/*" element={<CommissionsList />} />
    </Routes>
  )
}