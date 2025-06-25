import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Technician } from '../types'
import { ServiceTicket } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface TechnicianAssignmentProps {
  technicians: Technician[]
  ticket: ServiceTicket
  onAssign: (ticketId: string, technicianId: string) => Promise<void>
}

export function TechnicianAssignment({ technicians, ticket, onAssign }: TechnicianAssignmentProps) {
  const { toast } = useToast()
  const [selectedTechnician, setSelectedTechnician] = useState(ticket.assignedTo || '')
  const [loading, setLoading] = useState(false)

  const handleAssign = async () => {
    if (!selectedTechnician) {
      toast({
        title: 'Error',
        description: 'Please select a technician',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onAssign(ticket.id, selectedTechnician)
      toast({
        title: 'Success',
        description: 'Technician assigned successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign technician',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getLoadColor = (current: number, max: number) => {
    const loadPercentage = (current / max) * 100
    if (loadPercentage < 50) return 'bg-green-50 text-green-700 border-green-200'
    if (loadPercentage < 80) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    return 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Technician Assignment</CardTitle>
        <CardDescription>
          Assign a technician to this service ticket
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select
              value={selectedTechnician}
              onValueChange={setSelectedTechnician}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {technicians.map(tech => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name} ({tech.currentLoad}/{tech.maxCapacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} disabled={loading || selectedTechnician === ticket.assignedTo}>
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </div>

        {selectedTechnician && (
          <div className="space-y-3">
            {technicians
              .filter(tech => tech.id === selectedTechnician)
              .map(tech => (
                <div key={tech.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{tech.name}</span>
                    </div>
                    <Badge className={cn("ri-badge-status", getLoadColor(tech.currentLoad, tech.maxCapacity))}>
                      {tech.currentLoad}/{tech.maxCapacity} Jobs
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {tech.currentLoad < tech.maxCapacity ? 'Available' : 'At capacity'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Next available: {formatDate(new Date())}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-medium mb-1">Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {tech.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {ticket.assignedTo && (
          <div className="p-3 bg-blue-50 rounded-lg flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Currently Assigned</p>
              <p className="text-sm text-blue-700 mt-1">
                This ticket is currently assigned to {technicians.find(t => t.id === ticket.assignedTo)?.name || ticket.assignedTo}.
              </p>
            </div>
          </div>
        )}

        {selectedTechnician && technicians.find(t => t.id === selectedTechnician)?.currentLoad === technicians.find(t => t.id === selectedTechnician)?.maxCapacity && (
          <div className="p-3 bg-yellow-50 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Technician At Capacity</p>
              <p className="text-sm text-yellow-700 mt-1">
                This technician is currently at full capacity. Assigning this ticket may delay service.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}