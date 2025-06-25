import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  ClipboardCheck, 
  Clock, 
  Image as ImageIcon,
  Plus
} from 'lucide-react'
import { 
  PDIInspection, 
  PDIInspectionItem, 
  PDIInspectionItemStatus,
  PDIDefect,
  PDIDefectSeverity,
  PDIPhoto,
  PDIInspectionStatus
} from '../types'
import { Vehicle } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useDropzone } from 'react-dropzone'

interface PDIInspectionFormProps {
  inspection: PDIInspection
  vehicles: Vehicle[]
  onSave: (inspectionData: Partial<PDIInspection>) => Promise<void>
  onComplete: (inspectionId: string, notes?: string) => Promise<void>
  onUpdateItem: (inspectionId: string, itemId: string, itemData: Partial<PDIInspectionItem>) => Promise<void>
  onAddDefect: (inspectionId: string, defectData: Partial<PDIDefect>) => Promise<void>
  onAddPhoto: (inspectionId: string, photoData: Partial<PDIPhoto>) => Promise<void>
  onCancel: () => void
}

export function PDIInspectionForm({
  inspection,
  vehicles,
  onSave,
  onComplete,
  onUpdateItem,
  onAddDefect,
  onAddPhoto,
  onCancel
}: PDIInspectionFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('checklist')
  const [notes, setNotes] = useState(inspection.notes || '')
  const [showDefectForm, setShowDefectForm] = useState(false)
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const [newDefect, setNewDefect] = useState<Partial<PDIDefect>>({
    title: '',
    description: '',
    severity: PDIDefectSeverity.MEDIUM
  })
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [photoCaption, setPhotoCaption] = useState('')

  useEffect(() => {
    setNotes(inspection.notes || '')
  }, [inspection])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      
      // In a real app, you would upload these files to a storage service
      // For this demo, we'll create object URLs
      const file = acceptedFiles[0]
      const photoUrl = URL.createObjectURL(file)
      
      handleAddPhoto(photoUrl)
    }
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave({
        notes
      })
      toast({
        title: 'Success',
        description: 'Inspection saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save inspection',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    // Check if all required items have been completed
    const pendingRequiredItems = inspection.items.filter(item => {
      const templateItem = item.templateItem
      return templateItem?.isRequired && item.status === PDIInspectionItemStatus.PENDING
    })

    if (pendingRequiredItems.length > 0) {
      toast({
        title: 'Incomplete Inspection',
        description: `${pendingRequiredItems.length} required items are still pending`,
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onComplete(inspection.id, notes)
      toast({
        title: 'Success',
        description: 'Inspection completed successfully',
      })
      onCancel() // Close the form
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete inspection',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = async (itemId: string, status: PDIInspectionItemStatus, value?: string, notes?: string) => {
    try {
      await onUpdateItem(inspection.id, itemId, {
        status,
        value,
        notes
      })
      
      // If status is failed, prompt to add a defect
      if (status === PDIInspectionItemStatus.FAILED) {
        setCurrentItemId(itemId)
        setShowDefectForm(true)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      })
    }
  }

  const handleAddDefect = async () => {
    if (!newDefect.title || !newDefect.description) {
      toast({
        title: 'Validation Error',
        description: 'Title and description are required',
        variant: 'destructive'
      })
      return
    }

    try {
      await onAddDefect(inspection.id, {
        ...newDefect,
        inspectionItemId: currentItemId || undefined
      })
      
      setNewDefect({
        title: '',
        description: '',
        severity: PDIDefectSeverity.MEDIUM
      })
      setCurrentItemId(null)
      setShowDefectForm(false)
      
      toast({
        title: 'Success',
        description: 'Defect added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add defect',
        variant: 'destructive'
      })
    }
  }

  const handleAddPhoto = async (photoUrl: string) => {
    try {
      await onAddPhoto(inspection.id, {
        url: photoUrl,
        inspectionItemId: currentItemId || undefined,
        caption: photoCaption
      })
      
      setPhotoCaption('')
      setShowPhotoUpload(false)
      
      toast({
        title: 'Success',
        description: 'Photo added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add photo',
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>PDI Inspection</CardTitle>
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
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="defects">
                Defects
                {inspection.defects.length > 0 && (
                  <Badge className="ml-2 bg-red-50 text-red-700 border-red-200">
                    {inspection.defects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="photos">
                Photos
                {inspection.photos.length > 0 && (
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                    {inspection.photos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="space-y-6">
              {/* Defect Form Modal */}
              {showDefectForm && (
                <Card className="border-2 border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-lg text-red-700 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Report Defect
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      Record details about the issue found
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="defectTitle">Defect Title *</Label>
                      <Input
                        id="defectTitle"
                        value={newDefect.title}
                        onChange={(e) => setNewDefect(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Damaged Roof Seal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="defectDescription">Description *</Label>
                      <Textarea
                        id="defectDescription"
                        value={newDefect.description}
                        onChange={(e) => setNewDefect(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the defect in detail"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="defectSeverity">Severity</Label>
                      <Select 
                        value={newDefect.severity} 
                        onValueChange={(value: PDIDefectSeverity) => 
                          setNewDefect(prev => ({ ...prev, severity: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PDIDefectSeverity.LOW}>Low</SelectItem>
                          <SelectItem value={PDIDefectSeverity.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={PDIDefectSeverity.HIGH}>High</SelectItem>
                          <SelectItem value={PDIDefectSeverity.CRITICAL}>Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowDefectForm(false)
                          setCurrentItemId(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddDefect}>
                        Add Defect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Photo Upload Modal */}
              {showPhotoUpload && (
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg text-blue-700 flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Add Photo
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Upload a photo for documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/10">
                      <input {...getInputProps()} />
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop an image here, or click to select a file
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="photoCaption">Caption (Optional)</Label>
                      <Input
                        id="photoCaption"
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                        placeholder="e.g., Front view of vehicle"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowPhotoUpload(false)
                          setCurrentItemId(null)
                          setPhotoCaption('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => {
                          // In a real app, this would be handled by the file upload
                          // For demo purposes, we'll use a placeholder image
                          handleAddPhoto('https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg')
                        }}
                      >
                        Simulate Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {templateItem.description}
                                  </p>
                                )}
                                
                                {/* Item-specific input based on type */}
                                {templateItem.itemType === 'text' && (
                                  <div className="mb-3">
                                    <Input
                                      value={inspectionItem.value || ''}
                                      onChange={(e) => handleUpdateItem(
                                        inspectionItem.id, 
                                        PDIInspectionItemStatus.PASSED, 
                                        e.target.value
                                      )}
                                      placeholder="Enter text"
                                    />
                                  </div>
                                )}
                                
                                {templateItem.itemType === 'number' && (
                                  <div className="mb-3">
                                    <Input
                                      type="number"
                                      value={inspectionItem.value || ''}
                                      onChange={(e) => handleUpdateItem(
                                        inspectionItem.id, 
                                        PDIInspectionItemStatus.PASSED, 
                                        e.target.value
                                      )}
                                      placeholder="Enter number"
                                    />
                                  </div>
                                )}
                                
                                {templateItem.itemType === 'photo' && (
                                  <div className="mb-3">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setCurrentItemId(inspectionItem.id)
                                        setShowPhotoUpload(true)
                                      }}
                                    >
                                      <Camera className="h-4 w-4 mr-2" />
                                      Add Photo
                                    </Button>
                                    
                                    {/* Display photos for this item */}
                                    {inspection.photos.filter(p => p.inspectionItemId === inspectionItem.id).length > 0 && (
                                      <div className="grid grid-cols-3 gap-2 mt-2">
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
                                    )}
                                  </div>
                                )}
                                
                                {/* Notes field */}
                                {inspectionItem.notes && (
                                  <div className="mb-3 p-2 bg-muted/30 rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">Notes:</span> {inspectionItem.notes}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Add notes field */}
                                {inspectionItem.status !== PDIInspectionItemStatus.PENDING && (
                                  <div className="mb-3">
                                    <Textarea
                                      value={inspectionItem.notes || ''}
                                      onChange={(e) => handleUpdateItem(
                                        inspectionItem.id, 
                                        inspectionItem.status, 
                                        inspectionItem.value,
                                        e.target.value
                                      )}
                                      placeholder="Add notes (optional)"
                                      rows={2}
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {/* Action buttons */}
                              {templateItem.itemType === 'checkbox' && (
                                <div className="flex items-center space-x-2 ml-4">
                                  <Button 
                                    variant={inspectionItem.status === PDIInspectionItemStatus.PASSED ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleUpdateItem(inspectionItem.id, PDIInspectionItemStatus.PASSED)}
                                    className={inspectionItem.status === PDIInspectionItemStatus.PASSED ? "" : "border-green-200 text-green-700"}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Pass
                                  </Button>
                                  <Button 
                                    variant={inspectionItem.status === PDIInspectionItemStatus.FAILED ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleUpdateItem(inspectionItem.id, PDIInspectionItemStatus.FAILED)}
                                    className={inspectionItem.status === PDIInspectionItemStatus.FAILED ? "" : "border-red-200 text-red-700"}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Fail
                                  </Button>
                                  <Button 
                                    variant={inspectionItem.status === PDIInspectionItemStatus.NA ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleUpdateItem(inspectionItem.id, PDIInspectionItemStatus.NA)}
                                    className={inspectionItem.status === PDIInspectionItemStatus.NA ? "" : "border-gray-200 text-gray-700"}
                                  >
                                    N/A
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Notes and Completion */}
              <div className="space-y-4 pt-6 border-t">
                <div>
                  <Label htmlFor="inspectionNotes">Inspection Notes</Label>
                  <Textarea
                    id="inspectionNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add general notes about this inspection"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleComplete} 
                    disabled={loading || inspection.status !== 'in_progress'}
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Complete Inspection
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="defects" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Defects</h3>
                <Button 
                  size="sm"
                  onClick={() => {
                    setCurrentItemId(null)
                    setShowDefectForm(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Defect
                </Button>
              </div>

              {inspection.defects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No defects reported</p>
                  <p className="text-sm">Add defects when issues are found</p>
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
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setCurrentItemId(null)
                                setShowPhotoUpload(true)
                                // In a real app, you would set the defect ID here
                              }}
                            >
                              <Camera className="h-3 w-3 mr-1" />
                              Add Photo
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Photos</h3>
                <Button 
                  size="sm"
                  onClick={() => {
                    setCurrentItemId(null)
                    setShowPhotoUpload(true)
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </div>

              {inspection.photos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No photos added</p>
                  <p className="text-sm">Add photos to document the inspection</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {inspection.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || 'Inspection photo'} 
                        className="h-40 w-full object-cover rounded-md"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 truncate">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}