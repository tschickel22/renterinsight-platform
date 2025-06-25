import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Search, Filter, Eye, Edit, Trash2, TrendingUp, DollarSign, Video } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType, VehicleCategory } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { VehicleForm } from './components/VehicleForm'
import { CSVHandler } from './components/CSVHandler'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

function InventoryList() {
  const { vehicles, createVehicle, updateVehicle, saveVehiclesToStorage } = useInventoryManagement()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)

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

  const filteredVehicles = vehicles.filter(vehicle =>
    (
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm) ||
      vehicle.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(vehicle.customFields || {}).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) &&
    (statusFilter === 'all' || vehicle.status === statusFilter) &&
    (locationFilter === 'all' || vehicle.location === locationFilter)
  )
  
  const uniqueLocations = Array.from(new Set(vehicles.map(v => v.location))).filter(Boolean)
  
  const handleAddVehicle = () => {
    setSelectedVehicle(undefined)
    setShowVehicleForm(true)
  }
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleForm(true)
  }
  
  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (selectedVehicle) {
        // Update existing vehicle
        await updateVehicle(selectedVehicle.id, vehicleData)
      } else {
        // Create new vehicle
        await createVehicle(vehicleData)
      }
      setShowVehicleForm(false)
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast({
        title: 'Error',
        description: `Failed to ${selectedVehicle ? 'update' : 'create'} vehicle`,
        variant: 'destructive'
      })
    }
  }
  
  const handleImportCSV = async (importedVehicles: Partial<Vehicle>[]) => {
    try {
      const updatedVehicles = [...vehicles]
      
      for (const importedVehicle of importedVehicles) {
        // Check if vehicle with this VIN already exists
        const existingIndex = updatedVehicles.findIndex(v => v.vin === importedVehicle.vin)
        
        if (existingIndex >= 0) {
          // Update existing vehicle
          updatedVehicles[existingIndex] = {
            ...updatedVehicles[existingIndex],
            ...importedVehicle,
            updatedAt: new Date()
          }
        } else {
          // Create new vehicle
          const newVehicle: Vehicle = {
            id: Math.random().toString(36).substr(2, 9),
            vin: importedVehicle.vin || '',
            make: importedVehicle.make || '',
            model: importedVehicle.model || '',
            year: importedVehicle.year || new Date().getFullYear(),
            category: importedVehicle.category || VehicleCategory.RV,
            type: importedVehicle.type || VehicleType.RV,
            status: importedVehicle.status || VehicleStatus.AVAILABLE,
            price: importedVehicle.price || 0,
            cost: importedVehicle.cost || 0,
            location: importedVehicle.location || '',
            features: importedVehicle.features || [],
            images: importedVehicle.images || [],
            videos: importedVehicle.videos || [],
            customFields: importedVehicle.customFields || {},
            createdAt: new Date(),
            updatedAt: new Date()
          }
          updatedVehicles.push(newVehicle)
        }
      }
      
      saveVehiclesToStorage(updatedVehicles)
    } catch (error) {
      console.error('Error importing vehicles:', error)
      toast({
        title: 'Import Error',
        description: 'Failed to import vehicles from CSV',
        variant: 'destructive'
      })
    }
  }
  
  const handleExportCSV = () => {
    // This is just a callback for after export completes
    // The actual export logic is in the CSVHandler component
  }
  
  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleId)
      saveVehiclesToStorage(updatedVehicles)
      
      toast({
        title: 'Vehicle Deleted',
        description: 'Vehicle has been removed from inventory',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <VehicleForm
          vehicle={selectedVehicle}
          onSave={handleSaveVehicle}
          onCancel={() => setShowVehicleForm(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your RV and manufactured home inventory
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Units</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{vehicles.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 units this month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ready for sale
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {vehicles.filter(v => v.status === VehicleStatus.RESERVED).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Pending sale
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(vehicles.reduce((sum, v) => sum + v.price, 0))}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={VehicleStatus.AVAILABLE}>Available</SelectItem>
            <SelectItem value={VehicleStatus.RESERVED}>Reserved</SelectItem>
            <SelectItem value={VehicleStatus.SOLD}>Sold</SelectItem>
            <SelectItem value={VehicleStatus.SERVICE}>In Service</SelectItem>
            <SelectItem value={VehicleStatus.DELIVERED}>Delivered</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueLocations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <CSVHandler 
          vehicles={vehicles}
          onImport={handleImportCSV}
          onExport={handleExportCSV}
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {vehicle.images[0] && (
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute top-3 right-3">
                <Badge className={cn("ri-badge-status", getStatusColor(vehicle.status))}>
                  {vehicle.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono">
                    VIN: {vehicle.vin}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Price:</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(vehicle.price)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                      {vehicle.year} {vehicle.make} {vehicle.model} 
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="font-medium">{vehicle.status.replace('_', ' ').toUpperCase()}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(vehicle.category)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vehicle.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                {vehicle.features.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {vehicle.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {vehicle.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{vehicle.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {vehicle.videos && vehicle.videos.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>{vehicle.videos.length} video{vehicle.videos.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t gap-2">
                <Button variant="outline" size="sm" className="flex-1 shadow-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 shadow-sm"
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="shadow-sm"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No vehicles found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/*" element={<InventoryList />} />
    </Routes>
  )
}