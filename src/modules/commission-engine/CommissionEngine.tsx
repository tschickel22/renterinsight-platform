import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Plus, Search, Filter, TrendingUp, User, Calendar } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import CommissionModal from './components/CommissionModal'

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
  const [modalOpen, setModalOpen] = useState(false)
  const [activeCommission, setActiveCommission] = useState<Commission | null>(null)

  const openModal = (commission: Commission | null = null) => {
    setActiveCommission(commission)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setActiveCommission(null)
  }

  const getStatusColor = (status: CommissionStatus) => {
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

  const getTypeColor = (type: CommissionType) => {
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

  const filteredCommissions = commissions.filter(commission =>
    commission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.salesPersonId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.dealId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Commission Engine</h1>
            <p className="ri-page-description">
              Manage sales commissions and payouts
            </p>
          </div>
          <Button className="shadow-sm" onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            New Commission
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {/* ... unchanged code for stat cards ... */}

      {/* Search and Filters */}
      {/* ... unchanged code for search/filter ... */}

      {/* Commissions Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Commissions</CardTitle>
          <CardDescription>
            Track and manage sales commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommissions.map((commission) => (
              <div key={commission.id} className="ri-table-row">
                {/* ... commission row layout ... */}
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm" onClick={() => openModal(commission)}>
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm" onClick={() => openModal(commission)}>
                    Edit
                  </Button>
                  {commission.status === CommissionStatus.PENDING && (
                    <Button variant="outline" size="sm" className="shadow-sm">
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Render */}
      {modalOpen && (
        <CommissionModal
          commission={activeCommission}
          onClose={closeModal}
          onSave={(data) => {
            console.log('Save handler not implemented', data)
            closeModal()
          }}
        />
      )}
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