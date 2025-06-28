import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Truck, MapPin, Calendar, Clock, CheckCircle, Image as ImageIcon } from 'lucide-react'

interface DeliveryTrackingProps {
  customerId: string
}

export function DeliveryTracking({ customerId }: DeliveryTrackingProps) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showDeliveryDetail, setShowDeliveryDetail] = useState(false)

  // Fetch deliveries on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For this demo, we'll use mock data
    const mockDeliveries: Delivery[] = [
      {
        id: 'D-001',
        customerId: customerId,
        vehicleId: 'veh-1',
        status: DeliveryStatus.SCHEDULED,
        scheduledDate: new Date('2024-02-15'),
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA'
        },
        driver: 'Driver-001',
        notes: 'Please ensure someone is available to receive the delivery',
        customFields: {
          contactPhone: '(555) 123-4567',
          contactEmail: 'john.smith@example.com',
          estimatedArrival: '10:00 AM',
          deliveryPhotos: []
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ]
    
    setDeliveries(mockDeliveries)
  }, [customerId])

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

  const handleViewDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowDeliveryDetail(true)
  }

  return (
    <div className="space-y-6">
      {/* Delivery Detail Modal */}
      {showDeliveryDetail && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Delivery Tracking</CardTitle>
                  <CardDescription>
                    Delivery #{selectedDelivery.id}
                  </CardDescription>
                </div>
                <Badge className={cn("ri-badge-status", getStatusColor(selectedDelivery.status))}>
                  {selectedDelivery.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Map (Placeholder) */}
              <div className="bg-muted/30 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Delivery tracking map would appear here</p>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                  <p className="font-medium">{formatDate(selectedDelivery.scheduledDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimated Arrival</label>
                  <p className="font-medium">{selectedDelivery.customFields?.estimatedArrival || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                  <p className="font-medium">
                    {selectedDelivery.address.street}, {selectedDelivery.address.city}, {selectedDelivery.address.state} {selectedDelivery.address.zipCode}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                  <p className="font-medium">
                    {selectedDelivery.customFields?.contactPhone}<br />
                    {selectedDelivery.customFields?.contactEmail}
                  </p>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Delivery Timeline</h3>
                <div className="space-y-4">
                  <div className="relative pl-6 pb-6 border-l-2 border-muted">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="font-medium">Delivery Scheduled</div>
                    <div className="text-sm text-muted-foreground">{formatDate(selectedDelivery.createdAt)}</div>
                  </div>
                  
                  {selectedDelivery.status === DeliveryStatus.IN_TRANSIT && (
                    <div className="relative pl-6 pb-6 border-l-2 border-muted">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
                      <div className="font-medium">In Transit</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedDelivery.scheduledDate.getTime() - 86400000).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {selectedDelivery.status === DeliveryStatus.DELIVERED && (
                    <>
                      <div className="relative pl-6 pb-6 border-l-2 border-muted">
                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
                        <div className="font-medium">In Transit</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(selectedDelivery.scheduledDate.getTime() - 86400000).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                        <div className="font-medium">Delivered</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedDelivery.deliveredDate ? formatDate(selectedDelivery.deliveredDate) : 'Date not recorded'}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedDelivery.status === DeliveryStatus.SCHEDULED && (
                    <div className="relative pl-6 border-l-2 border-dashed border-muted">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                      <div className="font-medium text-muted-foreground">Delivery Day</div>
                      <div className="text-sm text-muted-foreground">{formatDate(selectedDelivery.scheduledDate)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedDelivery.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedDelivery.notes}</p>
                  </div>
                </div>
              )}

              {/* Delivery Photos */}
              {selectedDelivery.customFields?.deliveryPhotos && selectedDelivery.customFields.deliveryPhotos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Delivery Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedDelivery.customFields.deliveryPhotos.map((photo, index) => (
                      <div key={index} className="overflow-hidden rounded-md">
                        <img 
                          src={photo} 
                          alt={`Delivery photo ${index + 1}`} 
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2 text-primary" />
            Delivery Tracking
          </CardTitle>
          <CardDescription>
            Track your home or RV delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <div 
                  key={delivery.id} 
                  className="p-4 border rounded-lg hover:bg-muted/10 transition-colors cursor-pointer"
                  onClick={() => handleViewDelivery(delivery)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">Delivery #{delivery.id}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(delivery.status))}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(delivery.scheduledDate)}
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Delivery Address</div>
                      <p className="text-sm">
                        {delivery.address.street}<br />
                        {delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Delivery Status</div>
                      <div className="flex items-center space-x-2">
                        {delivery.status === DeliveryStatus.SCHEDULED && (
                          <div className="flex items-center text-sm text-blue-700">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Scheduled for {formatDate(delivery.scheduledDate)}</span>
                          </div>
                        )}
                        {delivery.status === DeliveryStatus.IN_TRANSIT && (
                          <div className="flex items-center text-sm text-yellow-700">
                            <Truck className="h-4 w-4 mr-1" />
                            <span>In transit to your location</span>
                          </div>
                        )}
                        {delivery.status === DeliveryStatus.DELIVERED && (
                          <div className="flex items-center text-sm text-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Delivered on {delivery.deliveredDate ? formatDate(delivery.deliveredDate) : 'unknown date'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <span className="text-sm text-primary cursor-pointer hover:underline">
                      View Details
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No deliveries found</p>
                <p className="text-sm">Any scheduled deliveries will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}