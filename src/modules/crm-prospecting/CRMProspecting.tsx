import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Search, Filter, Phone, Mail, Calendar, TrendingUp } from 'lucide-react'
import { Lead, LeadStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    source: 'Website',
    status: LeadStatus.NEW,
    assignedTo: 'Sales Rep 1',
    notes: 'Interested in Class A Motorhome',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    source: 'Referral',
    status: LeadStatus.QUALIFIED,
    assignedTo: 'Sales Rep 2',
    notes: 'Looking for travel trailer under $50k',
    customFields: {},
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16')
  }
]

function LeadsList() {
  const [leads] = useState<Lead[]>(mockLeads)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'default'
      case LeadStatus.CONTACTED:
        return 'secondary'
      case LeadStatus.QUALIFIED:
        return 'default'
      case LeadStatus.PROPOSAL:
        return 'secondary'
      case LeadStatus.NEGOTIATION:
        return 'secondary'
      case LeadStatus.CLOSED_WON:
        return 'default'
      case LeadStatus.CLOSED_LOST:
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case LeadStatus.CONTACTED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case LeadStatus.QUALIFIED:
        return 'bg-green-50 text-green-700 border-green-200'
      case LeadStatus.PROPOSAL:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case LeadStatus.NEGOTIATION:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case LeadStatus.CLOSED_WON:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case LeadStatus.CLOSED_LOST:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredLeads = leads.filter(lead =>
    `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM & Prospecting</h1>
            <p className="ri-page-description">
              Manage leads and customer relationships
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{leads.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">New Leads</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {leads.filter(l => l.status === LeadStatus.NEW).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Qualified</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {leads.filter(l => l.status === LeadStatus.QUALIFIED).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">24%</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search leads..."
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

      {/* Leads Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Leads</CardTitle>
          <CardDescription>
            Manage your sales prospects and customer relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <Badge 
                        variant={getStatusBadgeVariant(lead.status)}
                        className={cn("ri-badge-status", getStatusColor(lead.status))}
                      >
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-2 text-blue-500" />
                        {lead.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-2 text-green-500" />
                        {lead.phone}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-purple-500" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md">
                      {lead.notes}
                    </p>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    Edit
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

export default function CRMProspecting() {
  return (
    <Routes>
      <Route path="/" element={<LeadsList />} />
      <Route path="/*" element={<LeadsList />} />
    </Routes>
  )
}