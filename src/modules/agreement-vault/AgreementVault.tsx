import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileCheck, Plus, Search, Filter, Download, Eye, Edit, TrendingUp, Calendar } from 'lucide-react'
import { Agreement, AgreementStatus, AgreementType } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const mockAgreements: Agreement[] = [
  {
    id: '1',
    type: AgreementType.PURCHASE,
    customerId: 'cust-1',
    vehicleId: 'veh-1',
    quoteId: 'quote-1',
    status: AgreementStatus.SIGNED,
    signedDate: new Date('2024-01-18'),
    effectiveDate: new Date('2024-01-18'),
    expirationDate: new Date('2025-01-18'),
    terms: 'Standard purchase agreement with 90-day warranty',
    documents: [
      {
        id: '1',
        name: 'Purchase Agreement.pdf',
        type: 'application/pdf',
        url: '/documents/purchase-agreement-1.pdf',
        size: 245760,
        uploadedAt: new Date('2024-01-18')
      }
    ],
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '2',
    type: AgreementType.SERVICE,
    customerId: 'cust-2',
    status: AgreementStatus.ACTIVE,
    effectiveDate: new Date('2024-01-10'),
    expirationDate: new Date('2024-07-10'),
    terms: 'Extended service contract for 6 months',
    documents: [
      {
        id: '2',
        name: 'Service Contract.pdf',
        type: 'application/pdf',
        url: '/documents/service-contract-2.pdf',
        size: 189440,
        uploadedAt: new Date('2024-01-10')
      }
    ],
    customFields: {},
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
]

function AgreementsList() {
  const [agreements] = useState<Agreement[]>(mockAgreements)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.DRAFT:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case AgreementStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case AgreementStatus.SIGNED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case AgreementStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200'
      case AgreementStatus.EXPIRED:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case AgreementStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: AgreementType) => {
    switch (type) {
      case AgreementType.PURCHASE:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case AgreementType.LEASE:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case AgreementType.SERVICE:
        return 'bg-green-50 text-green-700 border-green-200'
      case AgreementType.WARRANTY:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredAgreements = agreements.filter(agreement =>
    agreement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Vault</h1>
            <p className="ri-page-description">
              Manage contracts, agreements, and legal documents
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Agreements</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{agreements.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All contracts
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {agreements.filter(a => a.status === AgreementStatus.ACTIVE).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {agreements.filter(a => a.status === AgreementStatus.PENDING).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Awaiting signature
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">0</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search agreements..."
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

      {/* Agreements Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Agreements</CardTitle>
          <CardDescription>
            Manage contracts, purchase agreements, and legal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgreements.map((agreement) => (
              <div key={agreement.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">Agreement #{agreement.id}</h3>
                      <Badge className={cn("ri-badge-status", getTypeColor(agreement.type))}>
                        {agreement.type.toUpperCase()}
                      </Badge>
                      <Badge className={cn("ri-badge-status", getStatusColor(agreement.status))}>
                        {agreement.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {agreement.customerId}
                      </div>
                      <div>
                        <span className="font-medium">Effective:</span> {formatDate(agreement.effectiveDate)}
                      </div>
                      <div>
                        <span className="font-medium">Documents:</span> {agreement.documents.length}
                      </div>
                      {agreement.expirationDate && (
                        <div>
                          <span className="font-medium">Expires:</span> {formatDate(agreement.expirationDate)}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {agreement.terms}
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
                    <Download className="h-3 w-3 mr-1" />
                    Download
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

export default function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={<AgreementsList />} />
      <Route path="/*" element={<AgreementsList />} />
    </Routes>
  )
}