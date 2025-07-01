import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ClipboardCheck, 
  Clock, 
  Image as ImageIcon,
  Printer,
  Download,
  User,
  Pen
} from 'lucide-react'
import { 
  PDIInspection, 
  PDIInspectionItemStatus, 
  PDIDefectSeverity, 
  PDISignoff,
  PDISignoffRole,
  PDIInspectionStatus
} from '../types'
import { Vehicle } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface PDIInspectionDetailProps {
  inspection: PDIInspection
  vehicles: Vehicle[]
  onAddSignoff: (inspectionId: string, signoffData: Partial<PDISignoff>) => Promise<void>
  onClose: () => void
}

export function PDIInspectionDetail({
  inspection,
  vehicles,
  onAddSignoff,
  onClose
}: PDIInspectionDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('summary')
  const [showSignoffForm, setShowSignoffForm] = useState(false)
  const [signoffNotes, setSignoffNotes] = useState('')
  const [signoffRole, setSignoffRole] = useState<PDISignoffRole>(PDISignoffRole.INSPECTOR)

  const handleAddSignoff = async () => {
    try {
      await onAddSignoff(inspection.id, {
        role: signoffRole,
        notes: signoffNotes,
        // In a real app, you would capture a signature here
        signatureUrl: 'https://via.placeholder.com/200x100?text=Signature'
      })
      
      setShowSignoffForm(false)
      setSignoffNotes('')
      
      toast({
        title: 'Success',
        description: 'Signoff added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add signoff',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: PDIInspectionItemStatus) => {
    switch (status) {
      case PDIInspectionItemStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case PDIInspectionItemStatus.PASSED:
        return 'bg-green-50 text-green-700 border-green-200'
      case PDIInspectionItemStatus.FAILED:
        return 'bg-red-50 text-red-700 border-red-200'
      case PDIInspectionItemStatus.NA:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getSeverityColor = (severity: PDIDefectSeverity) => {
    switch (severity) {
      case PDIDefectSeverity.LOW:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case PDIDefectSeverity.MEDIUM:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case PDIDefectSeverity.HIGH:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case PDIDefectSeverity.CRITICAL:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const vehicle = vehicles.find(v => v.id === inspection.vehicleId)

  const passedItems = inspection.items.filter(i => i.status === PDIInspectionItemStatus.PASSED).length
  const failedItems = inspection.items.filter(i => i.status === PDIInspectionItemStatus.FAILED).length
  const naItems = inspection.items.filter(i => i.status === PDIInspectionItemStatus.NA).length
  const totalItems = inspection.items.length
  const completionPercentage = Math.round(((passedItems + failedItems + naItems) / totalItems) * 100)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>PDI Inspection Report</CardTitle>
              <CardDescription>
                {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : inspection.vehicleId}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={cn(
                "ri-badge-status",
                inspection.status === PDIInspectionStatus.IN_PROGRESS ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                inspection.status === PDIInspectionStatus.COMPLETED ? "bg-blue-50 text-blue-700 border-blue-200" :
                inspection.status === PDIInspectionStatus.APPROVED ? "bg-green-50 text-green-700 border-green-200" :
                "bg-red-50 text-red-700 border-red-200"
              )}>
                {inspection.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="defects">
                Defects
                {inspection.defects.length > 0 && (
                  <Badge className="ml-2 bg-red-50 text-red-700 border-red-200">
                    {inspection.defects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="signoffs">
                Signoffs
                {inspection.signoffs.length > 0 && (
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
                    {inspection.signoffs.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              {/* Inspection Summary */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Inspection Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Status</span>
                          <p className="font-medium">{inspection.status.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Inspector</span>
                          <p className="font-medium">{inspection.inspector?.name || inspection.inspectorId}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Started</span>
                          <p className="font-medium">{formatDate(inspection.startedAt)}</p>
                        </div>
                        {inspection.completedAt && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Completed</span>
                            <p className="font-medium">{formatDate(inspection.completedAt)}</p>
                          </div>
                        )}
                      </div>
                      
                      {inspection.notes && (
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Notes</span>
                          <p className="text-sm mt-1 p-3 bg-muted/30 rounded-md">{inspection.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Inspection Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm font-bold">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{passedItems}</div>
                          <p className="text-xs text-green-600">Passed</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-700">{failedItems}</div>
                          <p className="text-xs text-red-600">Failed</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-700">{naItems}</div>
                          <p className="text-xs text-gray-600">N/A</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Defects</span>
                        <span className="text-sm font-bold text-red-600">{inspection.defects.length}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Photos</span>
                        <span className="text-sm font-bold">{inspection.photos.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                {inspection.status === 'completed' && (
                  <Button onClick={() => setShowSignoffForm(true)}>
                    <Pen className="h-4 w-4 mr-2" />
                    Add Signoff
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="space-y-6">
              {/* Checklist Sections */}
              {inspection.template?.sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{section.name}</h3>
                  {section.description && (
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  )}
                  
                  <div className="space-y-3">
                    {section.items.map((templateItem) => {
                      const inspectionItem = inspection.items.find(i => i.templateItemId === templateItem.id)
                      if (!inspectionItem) return null

                      return (
                        <Card key={templateItem.id} className="shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{templateItem.name}</h4>
                                  {templateItem.isRequired && (
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      Required
                                    </Badge>
                                  )}
                                  <Badge className={cn("ri-badge-status text-xs", getStatusColor(inspectionItem.status))}>
                                    {inspectionItem.status.toUpperCase()}
                                  </Badge>
                                </div>
                                {templateItem.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {templateItem.description}
                                  </p>
                                )}
                                
                                {/* Display item value if applicable */}
                                {inspectionItem.value && (
                                  <div className="mb-2 p-2 bg-muted/30 rounded-md">
                                    <p className="text-sm">
                                      <span className="font-medium">Value:</span> {inspectionItem.value}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Display notes if available */}
                                {inspectionItem.notes && (
                                  <div className="mb-2 p-2 bg-muted/30 rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">Notes:</span> {inspectionItem.notes}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Display photos for this item */}
                                {inspection.photos.filter(p => p.inspectionItemId === inspectionItem.id).length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="text-sm font-medium mb-1">Photos</h5>
                                    <div className="grid grid-cols-3 gap-2">
                                      {inspection.photos
                                        .filter(p => p.inspectionItemId === inspectionItem.id)
                                        .map((photo) => (
                                          <div key={photo.id} className="relative">
                                            <img 
                                              src={photo.url} 
                                              alt={photo.caption || 'Inspection photo'} 
                                              className="h-20 w-full object-cover rounded-md"
                                            />
                                            {photo.caption && (
                                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                                {photo.caption}
                                              </div>
                                            )}
                                          </div>
                                        ))
                                      }
                                    </div>
                                  </div>
                                )}
                                
                                {/* Display related defects */}
                                {inspection.defects.filter(d => d.inspectionItemId === inspectionItem.id).length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="text-sm font-medium mb-1 text-red-600">Defects</h5>
                                    {inspection.defects
                                      .filter(d => d.inspectionItemId === inspectionItem.id)
                                      .map((defect) => (
                                        <div key={defect.id} className="p-2 bg-red-50 rounded-md mb-2">
                                          <div className="flex items-center space-x-2">
                                            <span className="font-medium text-red-700">{defect.title}</span>
                                            <Badge className={cn("ri-badge-status text-xs", getSeverityColor(defect.severity))}>
                                              {defect.severity.toUpperCase()}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-red-600 mt-1">{defect.description}</p>
                                        </div>
                                      ))
                                    }
                                  </div>
                                )}
                              </div>
                              
                              {/* Status indicator */}
                              <div className="ml-4">
                                {inspectionItem.status === PDIInspectionItemStatus.PASSED && (
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                )}
                                {inspectionItem.status === PDIInspectionItemStatus.FAILED && (
                                  <XCircle className="h-6 w-6 text-red-500" />
                                )}
                                {inspectionItem.status === PDIInspectionItemStatus.PENDING && (
                                  <Clock className="h-6 w-6 text-yellow-500" />
                                )}
                                {inspectionItem.status === PDIInspectionItemStatus.NA && (
                                  <span className="text-sm font-medium text-gray-500">N/A</span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="defects" className="space-y-4">
              <h3 className="text-lg font-semibold">Defects</h3>

              {inspection.defects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No defects reported</p>
                  <p className="text-sm">This vehicle passed inspection without issues</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inspection.defects.map((defect) => (
                    <Card key={defect.id} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{defect.title}</h4>
                            <Badge className={cn("ri-badge-status", getSeverityColor(defect.severity))}>
                              {defect.severity.toUpperCase()}
                            </Badge>
                            <Badge className={
                              defect.status === 'open' ? 'bg-red-50 text-red-700 border-red-200' :
                              defect.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              defect.status === 'resolved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-green-50 text-green-700 border-green-200'
                            }>
                              {defect.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {defect.description}
                        </p>
                        
                        {/* Display photos for this defect */}
                        {inspection.photos.filter(p => p.defectId === defect.id).length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Photos</h5>
                            <div className="grid grid-cols-3 gap-2">
                              {inspection.photos
                                .filter(p => p.defectId === defect.id)
                                .map((photo) => (
                                  <div key={photo.id} className="relative">
                                    <img 
                                      src={photo.url} 
                                      alt={photo.caption || 'Defect photo'} 
                                      className="h-24 w-full object-cover rounded-md"
                                    />
                                    {photo.caption && (
                                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                        {photo.caption}
                                      </div>
                                    )}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {defect.assignedTo ? (
                              <span>Assigned to: {defect.assignedTo}</span>
                            ) : (
                              <span>Unassigned</span>
                            )}
                          </div>
                          
                          {defect.resolvedAt && (
                            <div className="text-sm text-green-600">
                              Resolved: {formatDate(defect.resolvedAt)}
                            </div>
                          )}
                        </div>
                        
                        {defect.resolutionNotes && (
                          <div className="mt-3 p-2 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                              <span className="font-medium">Resolution:</span> {defect.resolutionNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="signoffs" className="space-y-4">
              {/* Signoff Form */}
              {showSignoffForm && (
                <Card className="border-2 border-green-200 mb-6">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-lg text-green-700 flex items-center">
                      <Pen className="h-5 w-5 mr-2" />
                      Add Signoff
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Sign off on the completed inspection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="signoffRole">Role</Label>
                      <select
                        id="signoffRole"
                        value={signoffRole}
                        onChange={(e) => setSignoffRole(e.target.value as PDISignoffRole)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value={PDISignoffRole.INSPECTOR}>Inspector</option>
                        <option value={PDISignoffRole.MANAGER}>Manager</option>
                        <option value={PDISignoffRole.QUALITY_CONTROL}>Quality Control</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="signoffNotes">Notes (Optional)</Label>
                      <Textarea
                        id="signoffNotes"
                        value={signoffNotes}
                        onChange={(e) => setSignoffNotes(e.target.value)}
                        placeholder="Add any notes about this signoff"
                        rows={3}
                      />
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Signature Capture
                      </p>
                      <p className="text-xs text-muted-foreground">
                        In a real app, this would be a signature pad
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowSignoffForm(false)
                          setSignoffNotes('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddSignoff}>
                        Add Signoff
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <h3 className="text-lg font-semibold">Signoffs</h3>

              {inspection.signoffs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Pen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No signoffs yet</p>
                  <p className="text-sm">Add signoffs to approve the inspection</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inspection.signoffs.map((signoff) => (
                    <Card key={signoff.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{signoff.user?.name || signoff.userId}</h4>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                {signoff.role.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Signed: {formatDate(signoff.signedAt)}
                            </p>
                            {signoff.notes && (
                              <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded-md">
                                {signoff.notes}
                              </p>
                            )}
                          </div>
                          <div className="ml-4">
                            {signoff.signatureUrl ? (
                              <img 
                                src={signoff.signatureUrl} 
                                alt="Signature" 
                                className="h-12 object-contain"
                              />
                            ) : (
                              <div className="h-12 w-32 border-2 border-dashed rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">No signature</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add Signoff Button */}
              {inspection.status === 'completed' && !showSignoffForm && (
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setShowSignoffForm(true)}>
                    <Pen className="h-4 w-4 mr-2" />
                    Add Signoff
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}