import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Search, Filter, Eye, Edit, Trash2, TrendingUp, DollarSign, Video, X } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType, VehicleCategory } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { VehicleForm } from './components/VehicleForm'
import { CSVHandler } from './components/CSVHandler'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface VehicleDetailProps {
  vehicle: Vehicle
  onClose: () => void
}

function VehicleDetail({ vehicle, onClose }: VehicleDetailProps) {
  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-green-50 text-green-700 border-green-200'
      case VehicleStatus.RESERVED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case VehicleStatus.SOLD:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case VehicleStatus.SERVICE:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case VehicleStatus.DELIVERED:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getCategoryLabel = (category: VehicleCategory) => {
    switch (category) {
      case VehicleCategory.RV:
        return 'RV'
      case VehicleCategory.MANUFACTURED_HOME:
        return 'Manufactured Home'
      default:
        return category
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
              <CardDescription>VIN: {vehicle.vin}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {vehicle.images.length > 0 && (
            <div className="aspect-video bg-muted relative overflow-hidden rounded-lg">
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("ri-badge-status", getStatusColor(vehicle.status))}>
              {vehicle.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{getCategoryLabel(vehicle.category)}</Badge>
            <Badge variant="outline">{vehicle.type.replace('_', ' ').toUpperCase()}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Price</label>
              <p className="font-bold text-primary text-lg">{formatCurrency(vehicle.price)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cost</label>
              <p className="font-medium">{formatCurrency(vehicle.cost)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="font-medium">{vehicle.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Added</label>
              <p className="font-medium">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {vehicle.features.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Features</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {vehicle.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          )}
          {vehicle.videos && vehicle.videos.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Videos</label>
              <div className="space-y-2 mt-1">
                {vehicle.videos.map((video, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-blue-500" />
                    <a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Video {index + 1}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {Object.keys(vehicle.customFields || {}).length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
              <div className="grid gap-2 mt-1 md:grid-cols-2">
                {Object.entries(vehicle.customFields || {}).map(([key, value]) => (
                  <div key={key} className="p-2 bg-muted/30 rounded-md">
                    <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                    <span className="text-sm">{value?.toString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryManagement() {
  const { toast } = useToast()
  const {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refreshVehicles
  } = useInventoryManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showCSVHandler, setShowCSVHandler] = useState(false)

  const filteredVehicles = vehicles.filter(vehicle =>
    (
      `${vehicle.make || ''} ${vehicle.model || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.vin || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year?.toString().includes(searchTerm) ||
      (vehicle.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(vehicle.customFields || {}).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) &&
    (statusFilter === 'all' || vehicle.status === statusFilter) &&
    (typeFilter === 'all' || vehicle.type === typeFilter) &&
    (categoryFilter === 'all' || vehicle.category === categoryFilter) &&
    (locationFilter === 'all' || (vehicle.location || '') === locationFilter)
  )

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addVehicle(vehicleData)
      setShowForm(false)
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      })
    }
  }

  const handleUpdateVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingVehicle) return
    
    try {
      await updateVehicle(editingVehicle.id, vehicleData)
      setEditingVehicle(null)
      setShowForm(false)
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await deleteVehicle(vehicleId)
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-green-50 text-green-700 border-green-200'
      case VehicleStatus.RESERVED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case VehicleStatus.SOLD:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case VehicleStatus.SERVICE:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case VehicleStatus.DELIVERED:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getCategoryLabel = (category: VehicleCategory) => {
    switch (category) {
      case VehicleCategory.RV:
        return 'RV'
      case VehicleCategory.MANUFACTURED_HOME:
        return 'Manufactured Home'
      default:
        return category
    }
  }

  const totalValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0)
  const availableCount = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length
  const soldCount = vehicles.filter(v => v.status === VehicleStatus.SOLD).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your vehicle inventory, track status, and monitor performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowCSVHandler(true)}
          >
            Import/Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              vehicles in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCount}</div>
            <p className="text-xs text-muted-foreground">
              ready for sale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldCount}</div>
            <p className="text-xs text-muted-foreground">
              this period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by make, model, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={VehicleStatus.AVAILABLE}>Available</SelectItem>
                <SelectItem value={VehicleStatus.RESERVED}>Reserved</SelectItem>
                <SelectItem value={VehicleStatus.SOLD}>Sold</SelectItem>
                <SelectItem value={VehicleStatus.SERVICE}>Service</SelectItem>
                <SelectItem value={VehicleStatus.DELIVERED}>Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={VehicleType.RV}>RV</SelectItem>
                <SelectItem value={VehicleType.MOTORHOME}>Motorhome</SelectItem>
                <SelectItem value={VehicleType.TRAVEL_TRAILER}>Travel Trailer</SelectItem>
                <SelectItem value={VehicleType.FIFTH_WHEEL}>Fifth Wheel</SelectItem>
                <SelectItem value={VehicleType.TOY_HAULER}>Toy Hauler</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={VehicleCategory.RV}>RV</SelectItem>
                <SelectItem value={VehicleCategory.MANUFACTURED_HOME}>Manufactured Home</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {Array.from(new Set(vehicles.map(v => v.location).filter(Boolean))).map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted" />
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredVehicles.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {vehicles.length === 0 
                  ? "Get started by adding your first vehicle to the inventory."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {vehicles.length === 0 && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={cn("ri-badge-status", getStatusColor(vehicle.status))}>
                    {vehicle.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>VIN: {vehicle.vin}</span>
                    <Badge variant="outline">{getCategoryLabel(vehicle.category)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-lg">
                      {formatCurrency(vehicle.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Cost: {formatCurrency(vehicle.cost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingVehicle(vehicle)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {vehicle.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Vehicle Form Modal */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
          onCancel={() => {
            setShowForm(false)
            setEditingVehicle(null)
          }}
        />
      )}

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {/* CSV Handler Modal */}
      {showCSVHandler && (
        <CSVHandler
          vehicles={vehicles}
          onClose={() => setShowCSVHandler(false)}
          onImport={refreshVehicles}
        />
      )}
    </div>
  )
}