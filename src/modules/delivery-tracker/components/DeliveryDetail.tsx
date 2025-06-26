import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Edit, Truck, MapPin, Calendar, User, Phone, Mail, MessageSquare, Camera, Download, Printer } from 'lucide-react'
import { Delivery, DeliveryStatus, Vehicle } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { DeliveryTimeline } from './DeliveryTimeline'
import { useToast } from '@/hooks/use-toast'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

interface DeliveryDetailProps {
  delivery: Delivery
  vehicle?: Vehicle
  onClose: () => void
  onEdit: (delivery: Delivery) => void
  onSendNotification?: (deliveryId: string, type: 'sms' | 'email') => Promise<void>
}

export function DeliveryDetail({ delivery, vehicle, onClose, onEdit, onSendNotification }: DeliveryDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('details')
  const [sendingNotification, setSendingNotification] = useState(false)

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

  const handleSendNotification = async (type: 'sms' | 'email') => {
    if (!onSendNotification) return
    
    setSendingNotification(true)
    try {
      await onSendNotification(delivery.id, type)
      toast({
        title: 'Notification Sent',
        description: `${type === 'sms' ? 'SMS' : 'Email'} notification sent successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send ${type === 'sms' ? 'SMS' : 'email'} notification`,
        variant: 'destructive'
      })
    } finally {
      setSendingNotification(false)
    }
  }

  const handlePrintDeliverySheet = () => {
    try {
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(20)
      doc.text('Delivery Information Sheet', 105, 15, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Delivery #: ${delivery.id}`, 20, 30)
      doc.text(`Status: ${delivery.status.replace('_', ' ')}`, 20, 40)
      doc.text(`Scheduled Date: ${formatDate(delivery.scheduledDate)}`, 20, 50)
      
      // Add vehicle details
      doc.setFontSize(16)
      doc.text('Vehicle Information', 20, 65)
      
      doc.setFontSize(12)
      if (vehicle) {
        doc.text(`Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}`, 20, 75)
        doc.text(`VIN: ${vehicle.vin}`, 20, 85)
      } else {
        doc.text(`Vehicle ID: ${delivery.vehicleId}`, 20, 75)
      }
      
      // Add delivery address
      doc.setFontSize(16)
      doc.text('Delivery Address', 20, 105)
      
      doc.setFontSize(12)
      doc.text(`${delivery.address.street}`, 20, 115)
      doc.text(`${delivery.address.city}, ${delivery.address.state} ${delivery.address.zipCode}`, 20, 125)
      doc.text(`${delivery.address.country}`, 20, 135)
      
      // Add contact information
      doc.setFontSize(16)
      doc.text('Contact Information', 20, 155)
      
      doc.setFontSize(12)
      doc.text(`Customer ID: ${delivery.customerId}`, 20, 165)
      if (delivery.customFields?.contactPhone) {
        doc.text(`Phone: ${delivery.customFields.contactPhone}`, 20, 175)
      }
      if (delivery.customFields?.contactEmail) {
        doc.text(`Email: ${delivery.customFields.contactEmail}`, 20, 185)
      }
      
      // Add notes
      if (delivery.notes) {
        doc.setFontSize(16)
        doc.text('Delivery Notes', 20, 205)
        
        doc.setFontSize(12)
        const splitNotes = doc.splitTextToSize(delivery.notes, 170)
        doc.text(splitNotes, 20, 215)
      }
      
      // Add driver signature section
      doc.setFontSize(16)
      doc.text('Signatures', 20, 245)
      
      doc.setFontSize(12)
      doc.text('Driver: _______________________________', 20, 255)
      doc.text('Customer: _____________________________', 20, 270)
      
      // Save the PDF
      doc.save(`delivery-${delivery.id}.pdf`)
      
      toast({
        title: 'PDF Generated',
        description: 'Delivery information sheet has been downloaded',
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      })
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Delivery Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("ri-badge-status", getStatusColor(delivery.status))}>
                  {delivery.status.replace('_', ' ').toUpperCase()}
                </Badge>
                {delivery.driver && (
                  <Badge variant="outline">
                    Driver: {delivery.driver}
                  </Badge>
                )}
              </div>

              {/* Delivery Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{delivery.customerId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <p className="font-medium">
                    {vehicle 
                      ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` 
                      : delivery.vehicleId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                  <p className="font-medium">{formatDate(delivery.scheduledDate)}</p>
                </div>
                {delivery.deliveredDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivered Date</label>
                    <p className="font-medium">{formatDate(delivery.deliveredDate)}</p>
                  </div>
                )}
                {delivery.customFields?.estimatedArrival && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estimated Arrival</label>
                    <p className="font-medium">{delivery.customFields.estimatedArrival}</p>
                  </div>
                )}
                {delivery.customFields?.departureTime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Departure Time</label>
                    <p className="font-medium">{new Date(delivery.customFields.departureTime).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md">
                  <p>{delivery.address.street}</p>
                  <p>{delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}</p>
                  <p>{delivery.address.country}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                <div className="mt-1 grid gap-2 md:grid-cols-2">
                  {delivery.customFields?.contactPhone && (
                    <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{delivery.customFields.contactPhone}</span>
                    </div>
                  )}
                  {delivery.customFields?.contactEmail && (
                    <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{delivery.customFields.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notification Preferences</label>
                <div className="mt-1 grid gap-2 md:grid-cols-2">
                  <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>SMS Updates: {delivery.customFields?.sendSMSUpdates !== false ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email Updates: {delivery.customFields?.sendEmailUpdates !== false ? 'Enabled' : 'Disabled'}</span>
                  </div>
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

              {/* Send Notification Buttons */}
              {(delivery.status === DeliveryStatus.SCHEDULED || delivery.status === DeliveryStatus.IN_TRANSIT) && (
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSendNotification('sms')}
                    disabled={sendingNotification || !delivery.customFields?.contactPhone}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSendNotification('email')}
                    disabled={sendingNotification || !delivery.customFields?.contactEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrintDeliverySheet}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Delivery Sheet
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline">
              <DeliveryTimeline delivery={delivery} />
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              <h3 className="text-lg font-semibold">Delivery Photos</h3>
              
              {delivery.customFields?.deliveryPhotos && delivery.customFields.deliveryPhotos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {delivery.customFields.deliveryPhotos.map((photo, index) => (
                    <div key={index} className="overflow-hidden rounded-md">
                      <img 
                        src={photo} 
                        alt={`Delivery photo ${index + 1}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No delivery photos available</p>
                  {delivery.status !== DeliveryStatus.DELIVERED && (
                    <p className="text-sm">Photos will be added during delivery</p>
                  )}
                </div>
              )}
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