import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, AlertTriangle, Clock, DollarSign, FileText, Send } from 'lucide-react'
import { WarrantyInfo, WarrantyType, WarrantyClaimStatus } from '../types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface WarrantyDetailsProps {
  warranty: WarrantyInfo
}

export function WarrantyDetails({ warranty }: WarrantyDetailsProps) {
  const { toast } = useToast()

  const getWarrantyTypeLabel = (type: WarrantyType) => {
    switch (type) {
      case WarrantyType.MANUFACTURER:
        return 'Manufacturer Warranty'
      case WarrantyType.EXTENDED:
        return 'Extended Warranty'
      case WarrantyType.DEALER:
        return 'Dealer Warranty'
      case WarrantyType.NONE:
        return 'No Warranty'
      default:
        return 'Unknown'
    }
  }

  const getClaimStatusColor = (status?: WarrantyClaimStatus) => {
    if (!status) return 'bg-gray-50 text-gray-700 border-gray-200'
    
    switch (status) {
      case WarrantyClaimStatus.NOT_SUBMITTED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case WarrantyClaimStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case WarrantyClaimStatus.APPROVED:
        return 'bg-green-50 text-green-700 border-green-200'
      case WarrantyClaimStatus.PARTIAL_APPROVED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case WarrantyClaimStatus.DENIED:
        return 'bg-red-50 text-red-700 border-red-200'
      case WarrantyClaimStatus.CANCELLED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getClaimStatusLabel = (status?: WarrantyClaimStatus) => {
    if (!status) return 'Not Submitted'
    
    switch (status) {
      case WarrantyClaimStatus.NOT_SUBMITTED:
        return 'Not Submitted'
      case WarrantyClaimStatus.PENDING:
        return 'Pending'
      case WarrantyClaimStatus.APPROVED:
        return 'Approved'
      case WarrantyClaimStatus.PARTIAL_APPROVED:
        return 'Partially Approved'
      case WarrantyClaimStatus.DENIED:
        return 'Denied'
      case WarrantyClaimStatus.CANCELLED:
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  const handleSubmitClaim = () => {
    toast({
      title: 'Claim Submitted',
      description: 'Warranty claim has been submitted successfully',
    })
  }

  const isExpired = new Date() > new Date(warranty.coverageEndDate)
  const daysRemaining = !isExpired 
    ? Math.ceil((new Date(warranty.coverageEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              Warranty Information
            </CardTitle>
            <CardDescription>
              Coverage details and claim status
            </CardDescription>
          </div>
          {warranty.isActive ? (
            <Badge className="bg-green-50 text-green-700 border-green-200">
              ACTIVE
            </Badge>
          ) : (
            <Badge className="bg-red-50 text-red-700 border-red-200">
              INACTIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warranty Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Warranty Type</label>
            <p className="font-medium">{getWarrantyTypeLabel(warranty.warrantyType)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Provider</label>
            <p className="font-medium">{warranty.warrantyProvider}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contract Number</label>
            <p className="font-medium">{warranty.contractNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Deductible</label>
            <p className="font-medium">{warranty.deductible ? formatCurrency(warranty.deductible) : 'None'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Coverage Start</label>
            <p className="font-medium">{formatDate(warranty.coverageStartDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Coverage End</label>
            <p className="font-medium">
              {formatDate(warranty.coverageEndDate)}
              {isExpired ? (
                <Badge className="ml-2 bg-red-50 text-red-700 border-red-200">
                  EXPIRED
                </Badge>
              ) : (
                <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
                  {daysRemaining} days remaining
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Coverage Details */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Coverage Details</label>
          <div className="mt-1 p-3 bg-muted/30 rounded-md">
            <p className="text-sm whitespace-pre-wrap">{warranty.coverageDetails}</p>
          </div>
        </div>

        {/* Claim Information */}
        <div>
          <h3 className="text-md font-semibold mb-3">Claim Information</h3>
          
          {warranty.claimNumber ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Claim Number</label>
                  <p className="font-medium">{warranty.claimNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Claim Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={cn("ri-badge-status", getClaimStatusColor(warranty.claimStatus))}>
                      {getClaimStatusLabel(warranty.claimStatus)}
                    </Badge>
                  </div>
                </div>
                {warranty.claimSubmittedDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                    <p className="font-medium">{formatDate(warranty.claimSubmittedDate)}</p>
                  </div>
                )}
                {warranty.claimApprovedDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Approved Date</label>
                    <p className="font-medium">{formatDate(warranty.claimApprovedDate)}</p>
                  </div>
                )}
                {warranty.approvedAmount !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Approved Amount</label>
                    <p className="font-medium">{formatCurrency(warranty.approvedAmount)}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Claim Details
                </Button>
                {warranty.claimStatus === WarrantyClaimStatus.PENDING && (
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Check Status
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">No Claim Submitted</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This service ticket is eligible for warranty coverage, but no claim has been submitted yet.
                  </p>
                </div>
              </div>
              
              <Button onClick={handleSubmitClaim}>
                <Send className="h-4 w-4 mr-2" />
                Submit Warranty Claim
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}