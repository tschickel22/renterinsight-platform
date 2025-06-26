import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  User, 
  Calendar, 
} from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { CommissionModal } from '@/components/CommissionModal'

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
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const handleSaveCommission = (commission: Commission) => {
    setCommissions((prev) => [...prev, commission])
    setModalOpen(false)
  }

  const filtered = commissions.filter(c =>
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.salesPersonId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.dealId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Commission Engine</h1>
            <p className="ri-page-description">Manage sales commissions and payouts</p>
          </div>
          <Button className="shadow-sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Commission
          </Button>
        </div>
      </div>

      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{commissions.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All commissions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search commissions..."
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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Commissions</CardTitle>
          <CardDescription>Track and manage sales commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filtered.map((commission) => (
              <div key={commission.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        Commission #{commission.id}
                      </h3>
                      <Badge className={cn("ri-badge-status", getTypeColor(commission.type))}>
                        {commission.type.toUpperCase()}
                      </Badge>
                      <Badge className={cn("ri-badge-status", getStatusColor(commission.status))}>
                        {commission.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-blue-500" />
                        <span className="font-medium">Sales Person:</span>
                        <span className="ml-1">{commission.salesPersonId}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-2 text-green-500" />
                        <span className="font-medium">Deal:</span>
                        <span className="ml-1">{commission.dealId}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-2 text-purple-500" />
                        <span className="font-medium">Amount:</span>
                        <span className="ml-1 font-bold text-primary">
                          {formatCurrency(commission.amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-orange-500" />
                        <span className="font-medium">Created:</span>
                        <span className="ml-1">{formatDate(commission.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CommissionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCommission}
      />
    </div>
  )
}

function getTypeColor(type: CommissionType) {
  switch (type) {
    case CommissionType.FLAT:
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case CommissionType.PERCENTAGE:
      return 'bg-green-50 text-green-700 border-green-200'
    case CommissionType.TIERED:
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function getStatusColor(status: CommissionStatus) {
  switch (status) {
    case CommissionStatus.PENDING:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case CommissionStatus.APPROVED:
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case CommissionStatus.PAID:
      return 'bg-green-50 text-green-700 border-green-200'
    case CommissionStatus.CANCELLED:
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export default function CommissionEngine() {
  return (
    <Routes>
      <Route path="/" element={<CommissionsList />} />
      <Route path="/*" element={<CommissionsList />} />
    </Routes>
  )
}
