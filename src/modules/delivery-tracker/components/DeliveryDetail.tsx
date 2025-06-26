import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Edit, Truck, MapPin, Calendar, User, Send, Camera } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { DeliveryTimeline } from './DeliveryTimeline'
import { ETANotifier } from './ETANotifier'
import { PhotoCaptureCard } from './PhotoCaptureCard'
import { useToast } from '@/hooks/use-toast'

interface DeliveryDetailProps {
  delivery: Delivery
  onClose: () => void
  onEdit: (delivery: Delivery) => void
  onStatusChange: (deliveryId: string, status: DeliveryStatus) => Promise<void>
  onSendNotification: (deliveryId: string, type: 'email' | 'sms', message: string) => Promise<void>
  onPhotoCapture: (deliveryId: string, photoUrl: string, caption: string) => Promise<void>
}

export function DeliveryDetail({ 
  delivery, 
  onClose, 
  onEdit,
  onStatusChange,
  onSendNotification,
  onPhotoCapture
}: DeliveryDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('details')

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SCHEDULED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case DeliveryStatus.IN_TRANSIT:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case DeliveryStatus.DELIVERED:
        return 'bg-green-50 text-green-700 border-green-200'
      case DeliveryStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleStatusChange = async (status: DeliveryStatus) => {
    try {
      await onStatusChange(delivery.id, status)
      toast({
        title: 'Status Updated',
        description: `Delivery status changed to ${status.replace('_', ' ')}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update delivery status',
        variant: 'destructive'
      })
    }
  }

  const handleSendNotification = async (type: 'email' | 'sms', message: string) => {
    try {
      await onSendNotification(delivery.id, type, message)
    } catch (error) {
      throw error
    }
  }

  const handlePhotoCapture = async (photoUrl: string, caption: string) => {
    try {
      await onPhotoCapture(delivery.id, photoUrl, caption)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Delivery Details</CardTitle>
              <CardDescription>
                Delivery #{delivery.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(delivery)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Delivery
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Delivery Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("ri-badge-status", getStatusColor(delivery.status))}>
                  {delivery.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Delivery Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{delivery.customerId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <p className="font-medium">{delivery.vehicleId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                  <p className="font-medium">{formatDate(delivery.scheduledDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Delivery Time</label>
                  <p className="font-medium">{delivery.customFields?.estimatedTime || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Driver</label>
                  <p className="font-medium">{delivery.driver || 'Not assigned'}</p>
                </div>
                {delivery.deliveredDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivered Date</label>
                    <p className="font-medium">{formatDate(delivery.deliveredDate)}</p>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md">
                  <p className="font-medium">
                    {delivery.address.street}<br />
                    {delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}<br />
                    {delivery.address.country}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {delivery.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{delivery.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={delivery.status === DeliveryStatus.SCHEDULED}
                    onClick={() => handleStatusChange(DeliveryStatus.SCHEDULED)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Mark as Scheduled
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={delivery.status === DeliveryStatus.IN_TRANSIT}
                    onClick={() => handleStatusChange(DeliveryStatus.IN_TRANSIT)}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as In Transit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={delivery.status === DeliveryStatus.DELIVERED}
                    onClick={() => handleStatusChange(DeliveryStatus.DELIVERED)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={delivery.status === DeliveryStatus.CANCELLED}
                    onClick={() => handleStatusChange(DeliveryStatus.CANCELLED)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Mark as Cancelled
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <DeliveryTimeline delivery={delivery} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <ETANotifier 
                delivery={delivery} 
                onSend={handleSendNotification}
              />
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <PhotoCaptureCard 
                delivery={delivery}
                onPhotoCapture={handlePhotoCapture}
              />
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(delivery)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Delivery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}