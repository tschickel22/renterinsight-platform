import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ClipboardCheck, Plus, Search, Filter, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { PDIInspection, PDIInspectionStatus } from '../types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PDIInspectionListProps {
  inspections: PDIInspection[]
  onCreateInspection: () => void
  onViewInspection: (inspection: PDIInspection) => void
  onContinueInspection: (inspection: PDIInspection) => void
}

export function PDIInspectionList({
  inspections,
  onCreateInspection,
  onViewInspection,
  onContinueInspection
}: PDIInspectionListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: PDIInspectionStatus | string) => {
    switch (status) {
      case PDIInspectionStatus.IN_PROGRESS:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case PDIInspectionStatus.COMPLETED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case PDIInspectionStatus.APPROVED:
        return 'bg-green-50 text-green-700 border-green-200'
      case PDIInspectionStatus.REJECTED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: PDIInspectionStatus | string) => {
    switch (status) {
      case PDIInspectionStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-yellow-500" />
      case PDIInspectionStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case PDIInspectionStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case PDIInspectionStatus.REJECTED:
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search inspections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="all">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="outline" className="shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={onCreateInspection} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Inspections List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Home/Vehicle PDI Inspections ({filteredInspections.length})</CardTitle>
          <CardDescription>
            Manage pre-delivery inspections for homes and vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInspections.map((inspection) => (
              <div key={inspection.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        Inspection #{inspection.id.substring(0, 8)}
                      </h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(inspection.status))}>
                        {getStatusIcon(inspection.status)}
                        <span className="ml-1">{inspection.status.replace('_', ' ').toUpperCase()}</span>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Vehicle:</span> 
                        <span className="ml-1">{inspection.vehicle?.make} {inspection.vehicle?.model} ({inspection.vehicleId})</span>
                      </div>
                      <div>
                        <span className="font-medium">Inspector:</span> 
                        <span className="ml-1">{inspection.inspector?.name || inspection.inspectorId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Started:</span> 
                        <span className="ml-1">{formatDate(inspection.startedAt)}</span>
                      </div>
                      {inspection.completedAt && (
                        <div>
                          <span className="font-medium">Completed:</span> 
                          <span className="ml-1">{formatDate(inspection.completedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        {inspection.items.filter(i => i.status === 'passed').length} passed
                      </span>
                      <span className="flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                        {inspection.items.filter(i => i.status === 'failed').length} failed
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                        {inspection.items.filter(i => i.status === 'pending').length} pending
                      </span>
                    </div>
                    {inspection.defects.length > 0 && (
                      <div className="mt-2 bg-red-50 p-2 rounded-md">
                        <p className="text-sm text-red-700 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {inspection.defects.length} defect{inspection.defects.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ri-action-buttons">
                  {inspection.status === PDIInspectionStatus.IN_PROGRESS ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => onContinueInspection(inspection)}
                    >
                      <ClipboardCheck className="h-3 w-3 mr-1" />
                      Continue
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => onViewInspection(inspection)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredInspections.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No inspections found</p>
                <p className="text-sm">Create your first inspection to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}