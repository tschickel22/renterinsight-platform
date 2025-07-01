import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, ClipboardCheck } from 'lucide-react'
import { PDITemplate, PDIInspection } from '../types'
import { Vehicle, VehicleType } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface PDINewInspectionFormProps {
  templates: PDITemplate[]
  vehicles: Vehicle[]
  currentUserId: string
  onCreateInspection: (inspectionData: Partial<PDIInspection>) => Promise<void>
  onCancel: () => void
}

export function PDINewInspectionForm({
  templates,
  vehicles,
  currentUserId,
  onCreateInspection,
  onCancel
}: PDINewInspectionFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [notes, setNotes] = useState('')
  const [availableTemplates, setAvailableTemplates] = useState<PDITemplate[]>([])

  // Update available templates when vehicle is selected
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId)
      if (vehicle) {
        const vehicleType = vehicle.type
        const filteredTemplates = templates.filter(t => 
          t.isActive && t.vehicleType === vehicleType
        )
        setAvailableTemplates(filteredTemplates)
        
        // Auto-select template if there's only one
        if (filteredTemplates.length === 1) {
          setSelectedTemplateId(filteredTemplates[0].id)
        } else {
          setSelectedTemplateId('')
        }
      }
    } else {
      setAvailableTemplates([])
      setSelectedTemplateId('')
    }
  }, [selectedVehicleId, templates, vehicles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedVehicleId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a vehicle',
        variant: 'destructive'
      })
      return
    }

    if (!selectedTemplateId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a template',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onCreateInspection({
        templateId: selectedTemplateId,
        vehicleId: selectedVehicleId,
        inspectorId: currentUserId,
        notes
      })
      
      toast({
        title: 'Success',
        description: 'Inspection created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create inspection',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>New PDI Inspection</CardTitle>
              <CardDescription>
                Create a new pre-delivery inspection
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vehicle">Vehicle *</Label>
              <Select 
                value={selectedVehicleId} 
                onValueChange={setSelectedVehicleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a home/vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="template">Inspection Template *</Label>
              <Select 
                value={selectedTemplateId} 
                onValueChange={setSelectedTemplateId}
                disabled={availableTemplates.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    availableTemplates.length === 0 
                      ? "Select a home/vehicle first" 
                      : "Select a template"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableTemplates.length === 0 && selectedVehicleId && (
                <p className="text-xs text-red-500 mt-1">
                  No templates available for this vehicle type
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any initial notes about this inspection"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedVehicleId || !selectedTemplateId}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Start Inspection
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}