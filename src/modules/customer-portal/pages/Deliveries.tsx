import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react'
import { DeliveryTimeline } from '../components/DeliveryTimeline'
import { cn } from '@/lib/utils'

// Mock delivery data
const mockDelivery = {
  id: 'DEL-2024-001',
  status: 'in_transit',
  vehicleName: '2024 Forest River Georgetown',
  scheduledDate: new Date('2024-04-15'),
  estimatedArrival: '2:00 PM',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701'
  },
  currentLocation: 'En route - 50 miles away',
  departureTime: new Date('2024-04-15T08:00:00'),
  events: [
    {
      id: '1',
      type: 'scheduled',
      title: 'Delivery Scheduled',
      description: 'Your delivery has been scheduled',
      timestamp: new Date('2024-04-01T10:00:00')
    },
    {
      id: '2',
      type: 'preparation',
      title: 'Preparation Complete',
      description: 'Your RV is prepared and ready for delivery',
      timestamp: new Date('2024-04-14T16:00:00')
    },
    {
      id: '3',
      type: 'departure',
      title: 'Departed Dealership',
      description: 'Your RV has left our facility',
      timestamp: new Date('2024-04-15T08:00:00')
    }
  ]
}

export function Deliveries() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'in_transit':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Tracking</h1>
        <p className="text-muted-foreground">
          Track the status of your delivery
        </p>
      </div>

      {/* Delivery Status Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delivery Status</CardTitle>
            <Badge className={cn("ri-badge-status", getStatusColor(mockDelivery.status))}>
              {mockDelivery.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            {mockDelivery.vehicleName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Scheduled Date</p>
                  <p className="text-sm text-muted-foreground">
                    {mockDelivery.scheduledDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Arrival</p>
                  <p className="text-sm text-muted-foreground">
                    {mockDelivery.estimatedArrival}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {mockDelivery.address.street}, {mockDelivery.address.city}, {mockDelivery.address.state} {mockDelivery.address.zipCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-muted-foreground">
                    {mockDelivery.currentLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Delivery tracking map</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Timeline */}
      <DeliveryTimeline delivery={mockDelivery} />

      {/* Delivery Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Instructions</CardTitle>
          <CardDescription>Important information for your delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Preparation Checklist</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span>Ensure the delivery location is accessible for a large vehicle</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span>Clear any obstacles from the driveway or parking area</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span>Have identification ready for verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span>Allow approximately 1-2 hours for delivery and orientation</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
              <p className="text-sm text-blue-700">
                If you need to reach our delivery team, please call (555) 123-4567 or email delivery@example.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}