import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Truck, Plus, Search, Filter, MapPin, Calendar, User, TrendingUp } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    customerId: 'cust-1',
    vehicleId: 'veh-1',
    status: DeliveryStatus.SCHEDULED,
    scheduledDate: new Date('2024-01-25'),
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA'
    },
    driver: 'Driver-001',
    notes: 'Customer prefers morning delivery',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '2',
    customerId: 'cust-2',
    vehicleId: 'veh-2',
    status: DeliveryStatus.IN_TRANSIT,
    scheduledDate: new Date('2024-01-20'),
    deliveredDate: undefined,
    address: {
      street: '456 Oak Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    driver: 'Driver-002',
    notes: 'Call customer 30 minutes before arrival',
    customFields: {},
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20')
  }
]

function DeliveriesList() {
  const [deliveries] = useState<Delivery[]>(mockDeliveries)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Delivery Tracker</h1>
            <p className="ri-page-description">
              Track vehicle deliveries and logistics
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Delivery
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{deliveries.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All deliveries
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Scheduled</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {deliveries.filter(d => d.status === DeliveryStatus.SCHEDULED).length}
            </div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Upcoming deliveries
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {deliveries.filter(d => d.status === DeliveryStatus.IN_TRANSIT).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Truck className="h-3 w-3 mr-1" />
              On the road
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <Button variant="outline" className="shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Deliveries Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Deliveries</CardTitle>
          <CardDescription>
            Track and manage vehicle deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">Delivery #{delivery.id}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(delivery.status))}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-blue-500" />
                        <span className="font-medium">Customer:</span> 
                        <span className="ml-1">{delivery.customerId}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-green-500" />
                        <span className="font-medium">Driver:</span> 
                        <span className="ml-1">{delivery.driver || 'Not assigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-purple-500" />
                        <span className="font-medium">Scheduled:</span> 
                        <span className="ml-1">{formatDate(delivery.scheduledDate)}</span>
                      </div>
                      {delivery.deliveredDate && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2 text-green-500" />
                          <span className="font-medium">Delivered:</span> 
                          <span className="ml-1">{formatDate(delivery.deliveredDate)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-start bg-muted/30 p-2 rounded-md">
                        <MapPin className="h-3 w-3 mr-2 mt-0.5 text-red-500" />
                        <span className="text-sm text-muted-foreground">
                          {delivery.address.street}, {delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}
                        </span>
                      </div>
                      {delivery.notes && (
                        <p className="text-sm text-muted-foreground mt-2 bg-blue-50 p-2 rounded-md">
                          <span className="font-medium">Notes:</span> {delivery.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DeliveryTracker() {
  return (
    <Routes>
      <Route path="/" element={<DeliveriesList />} />
      <Route path="/*" element={<DeliveriesList />} />
    </Routes>
  )
}