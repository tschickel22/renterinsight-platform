import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileCheck, Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react'
import { Agreement, AgreementStatus, AgreementType } from '@/types'
import { formatDate } from '@/lib/utils'

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
        return 'bg-gray-100 text-gray-800'
      case AgreementStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case AgreementStatus.SIGNED:
        return 'bg-blue-100 text-blue-800'
      case AgreementStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case AgreementStatus.EXPIRED:
        return 'bg-orange-100 text-orange-800'
      case AgreementStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: AgreementType) => {
    switch (type) {
      case AgreementType.PURCHASE:
        return 'bg-blue-100 text-blue-800'
      case AgreementType.LEASE:
        return 'bg-purple-100 text-purple-800'
      case AgreementType.SERVICE:
        return 'bg-green-100 text-green-800'
      case AgreementType.WARRANTY:
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAgreements = agreements.filter(agreement =>
    agreement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agreement Vault</h1>
          <p className="text-muted-foreground">
            Manage contracts, agreements, and legal documents
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Agreement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agreements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agreements.filter(a => a.status === AgreementStatus.ACTIVE).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agreements.filter(a => a.status === AgreementStatus.PENDING).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agreements..."
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

      {/* Agreements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agreements</CardTitle>
          <CardDescription>
            Manage contracts, purchase agreements, and legal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgreements.map((agreement) => (
              <div key={agreement.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Agreement #{agreement.id}</h3>
                      <Badge className={getTypeColor(agreement.type)}>
                        {agreement.type.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(agreement.status)}>
                        {agreement.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
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
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {agreement.terms}
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