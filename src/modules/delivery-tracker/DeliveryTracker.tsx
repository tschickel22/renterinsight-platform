import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge' 
import { Truck, Plus, Search, Filter, MapPin, Calendar, User, TrendingUp, MessageSquare, Camera, Clock, Eye } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useDeliveryManagement } from './hooks/useDeliveryManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useToast } from '@/hooks/use-toast'
import { DeliveryForm } from './components/DeliveryForm'
import { DeliveryDetail } from './components/DeliveryDetail'
import { ETANotificationForm } from './components/ETANotificationForm'
import { DeliveryPhotoCapture } from './components/DeliveryPhotoCapture'
import { DeliveryTimeline } from './components/DeliveryTimeline'
import { DeliveryDashboard } from './components/DeliveryDashboard'

function DeliveriesList() {
  const { 
    deliveries, 
    createDelivery, 
    updateDelivery, 
    deleteDelivery, 
    updateDeliveryStatus,
    sendNotification,
    updateETA,
    addDeliveryPhotos
  } = useDeliveryManagement()
  const { vehicles } = useInventoryManagement()
  const { leads } = useLeadManagement()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [showDeliveryDetail, setShowDeliveryDetail] = useState(false)
  const [showNotificationForm, setShowNotificationForm] = useState(false)
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)

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

  const filteredDeliveries = deliveries
    .filter(delivery =>
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(delivery => statusFilter === 'all' || delivery.status === statusFilter)

  const handleCreateDelivery = () => {
    setSelectedDelivery(null)
    setShowDeliveryForm(true)
  }

  const handleEditDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowDeliveryForm(true)
    setShowDeliveryDetail(false)
  }

  const handleViewDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowDeliveryDetail(true)
  }

  const handleSaveDelivery = async (deliveryData: Partial<Delivery>) => {
    try {
      if (selectedDelivery) {
        // Update existing delivery
        await updateDelivery(selectedDelivery.id, deliveryData)
        toast({
          title: 'Success',
          description: 'Delivery updated successfully',
        })
      } else {
        // Create new delivery
        await createDelivery(deliveryData)
        toast({
          title: 'Success',
          description: 'Delivery scheduled successfully',
        })
      }
      setShowDeliveryForm(false)
      setSelectedDelivery(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedDelivery ? 'update' : 'schedule'} delivery`,
        variant: 'destructive'
      })
    }
  }

  const handleDeleteDelivery = async (deliveryId: string) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await deleteDelivery(deliveryId)
        toast({
          title: 'Success',
          description: 'Delivery deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete delivery',
          variant: 'destructive'
        })
      }
    }
  }

  const handleStatusChange = async (deliveryId: string, status: DeliveryStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, status)
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

  const handleSendNotification = async (deliveryId: string, data: any) => {
    try {
      // Update ETA if provided
      if (data.estimatedArrival) {
        await updateETA(deliveryId, data.estimatedArrival)
      }
      
      // Send notification
      await sendNotification(deliveryId, data.type, data.message)
      
      return true
    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  const handleCapturePhotos = async (photos: string[], captions: string[]) => {
    if (!selectedDelivery) return
    
    try {
      await addDeliveryPhotos(selectedDelivery.id, photos, captions)
      
      // If delivery is in transit, update to delivered
      if (selectedDelivery.status === DeliveryStatus.IN_TRANSIT) {
        await updateDeliveryStatus(selectedDelivery.id, DeliveryStatus.DELIVERED)
      }
      
      setShowPhotoCapture(false)
      
      toast({
        title: 'Photos Added',
        description: `${photos.length} photos added to delivery`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add photos',
        variant: 'destructive'
      })
    }
  }

  const getVehicleById = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId)
  }

  return (
    <div className="space-y-8">
      {/* Delivery Form Modal */}
      {showDeliveryForm && (
        <DeliveryForm
          delivery={selectedDelivery || undefined}
          vehicles={vehicles}
          customers={leads}
          onSave={handleSaveDelivery}
          onCancel={() => {
            setShowDeliveryForm(false)
            setSelectedDelivery(null)
          }}
        />
      )}
      
      {/* Delivery Detail Modal */}
      {showDeliveryDetail && selectedDelivery && (
        <DeliveryDetail
          delivery={selectedDelivery}
          vehicle={getVehicleById(selectedDelivery.vehicleId)}
          onClose={() => setShowDeliveryDetail(false)}
          onEdit={handleEditDelivery}
          onSendNotification={async (deliveryId, type) => {
            setShowDeliveryDetail(false)
            setShowNotificationForm(true)
          }}
        />
      )}
      
      {/* Notification Form Modal */}
      {showNotificationForm && selectedDelivery && (
        <ETANotificationForm
          delivery={selectedDelivery}
          onSend={handleSendNotification}
          onCancel={() => {
            setShowNotificationForm(false)
            setShowDeliveryDetail(true)
          }}
        />
      )}
      
      {/* Photo Capture Modal */}
      {showPhotoCapture && selectedDelivery && (
        <DeliveryPhotoCapture
          onCapture={handleCapturePhotos}
          onCancel={() => {
            setShowPhotoCapture(false)
            setShowDeliveryDetail(true)
          }}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Delivery Tracker</h1>
            <p className="ri-page-description">
              Track vehicle deliveries and logistics
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateDelivery}>
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
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Notifications</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {deliveries.filter(d => d.customFields?.customerNotified).length}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <MessageSquare className="h-3 w-3 mr-1" />
              Sent to customers
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background"
        >
          <option value="all">All Status</option>
          <option value={DeliveryStatus.SCHEDULED}>Scheduled</option>
          <option value={DeliveryStatus.IN_TRANSIT}>In Transit</option>
          <option value={DeliveryStatus.DELIVERED}>Delivered</option>
          <option value={DeliveryStatus.CANCELLED}>Cancelled</option>
        </select>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleViewDelivery(delivery)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleEditDelivery(delivery)}
                  >
                    Edit
                  </Button>
                  {delivery.status === DeliveryStatus.IN_TRANSIT && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setShowPhotoCapture(true);
                      }}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Photos
                    </Button>
                  )}
                  {(delivery.status === DeliveryStatus.SCHEDULED || delivery.status === DeliveryStatus.IN_TRANSIT) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setShowNotificationForm(true);
                      }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Notify
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredDeliveries.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No deliveries found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DeliveryDashboardView() {
  const { deliveries } = useDeliveryManagement()
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  
  return (
    <>
      {showDeliveryForm && (
        <DeliveryForm
          vehicles={[]}
          customers={[]}
          onSave={async () => {}}
          onCancel={() => setShowDeliveryForm(false)}
        />
      )}
      <DeliveryDashboard 
        deliveries={deliveries} 
        onScheduleDelivery={() => setShowDeliveryForm(true)} 
      />
    </>
  )
}

export default function DeliveryTracker() {
  return (
    <Routes>
      <Route path="/" element={<DeliveryDashboardView />} />
      <Route path="/list" element={<DeliveriesList />} />
      <Route path="/*" element={<DeliveriesList />} />
    </Routes>
  )
}