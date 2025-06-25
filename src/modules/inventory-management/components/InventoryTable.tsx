import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  MoreHorizontal,
  ScanBarcode,
  Image as ImageIcon,
  Video,
  Check,
  X
} from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import Papa from 'papaparse'

interface InventoryTableProps {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicleId: string) => void
  onView: (vehicle: Vehicle) => void
  onStatusChange: (vehicleId: string, status: VehicleStatus) => void
}

export function InventoryTable({ 
  vehicles, 
  onEdit, 
  onDelete, 
  onView, 
  onStatusChange 
}: InventoryTableProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Get unique locations for filter
  const locations = Array.from(new Set(vehicles.map(v => v.location)))

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

  const getTypeLabel = (type: VehicleType) => {
    return type.replace('_', ' ').toUpperCase()
  }

  // Filter and sort vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
    const matchesLocation = locationFilter === 'all' || vehicle.location === locationFilter

    return matchesSearch && matchesStatus && matchesType && matchesLocation
  }).sort((a, b) => {
    let aValue: any = a[sortField as keyof Vehicle]
    let bValue: any = b[sortField as keyof Vehicle]
    
    // Handle dates
    if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime()
      bValue = bValue.getTime()
    }
    
    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicles(filteredVehicles.map(v => v.id))
    } else {
      setSelectedVehicles([])
    }
  }

  const toggleVehicleSelection = (vehicleId: string) => {
    if (selectedVehicles.includes(vehicleId)) {
      setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId))
    } else {
      setSelectedVehicles([...selectedVehicles, vehicleId])
    }
  }

  const handleExportCSV = () => {
    const vehiclesToExport = selectedVehicles.length > 0
      ? vehicles.filter(v => selectedVehicles.includes(v.id))
      : filteredVehicles

    // Prepare data for export
    const exportData = vehiclesToExport.map(vehicle => ({
      id: vehicle.id,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      price: vehicle.price,
      cost: vehicle.cost,
      location: vehicle.location,
      features: vehicle.features.join(', '),
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString()
    }))

    // Convert to CSV
    const csv = Papa.unparse(exportData)
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Export Successful',
      description: `Exported ${exportData.length} vehicles to CSV`,
    })
  }

  const handleBulkStatusChange = (status: VehicleStatus) => {
    if (selectedVehicles.length === 0) {
      toast({
        title: 'No Vehicles Selected',
        description: 'Please select vehicles to update',
        variant: 'destructive'
      })
      return
    }

    // Call onStatusChange for each selected vehicle
    selectedVehicles.forEach(vehicleId => {
      onStatusChange(vehicleId, status)
    })

    toast({
      title: 'Status Updated',
      description: `Updated ${selectedVehicles.length} vehicles to ${status}`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search by make, model, VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
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
            <SelectTrigger className="w-[130px]">
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
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedVehicles.length > 0 && (
        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
          <div className="text-sm font-medium">
            {selectedVehicles.length} vehicles selected
          </div>
          <div className="flex gap-2">
            <Select onValueChange={(value: VehicleStatus) => handleBulkStatusChange(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleStatus.AVAILABLE}>Available</SelectItem>
                <SelectItem value={VehicleStatus.RESERVED}>Reserved</SelectItem>
                <SelectItem value={VehicleStatus.SOLD}>Sold</SelectItem>
                <SelectItem value={VehicleStatus.SERVICE}>Service</SelectItem>
                <SelectItem value={VehicleStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={VehicleType.SINGLE_WIDE}>Single Wide MH</SelectItem>
                <SelectItem value={VehicleType.DOUBLE_WIDE}>Double Wide MH</SelectItem>
                <SelectItem value={VehicleType.TRIPLE_WIDE}>Triple Wide MH</SelectItem>
                <SelectItem value={VehicleType.PARK_MODEL}>Park Model</SelectItem>
                <SelectItem value={VehicleType.MODULAR_HOME}>Modular Home</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedVehicles([])}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Inventory ({filteredVehicles.length})</CardTitle>
              <CardDescription>
                Manage your RV and motorhome inventory
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">
                    <Checkbox 
                      checked={selectedVehicles.length === filteredVehicles.length && filteredVehicles.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('make')}
                  >
                    <div className="flex items-center">
                      <span>Make/Model</span>
                      {sortField === 'make' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('year')}
                  >
                    <div className="flex items-center">
                      <span>Year</span>
                      {sortField === 'year' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('vin')}
                  >
                    <div className="flex items-center">
                      <span>VIN</span>
                      {sortField === 'vin' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('type')}
                  >
                    <div className="flex items-center">
                      <span>Type</span>
                      {sortField === 'type' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('status')}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('location')}
                  >
                    <div className="flex items-center">
                      <span>Location</span>
                      {sortField === 'location' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleSort('price')}
                  >
                    <div className="flex items-center">
                      <span>Price</span>
                      {sortField === 'price' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="p-2 text-left">Media</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-muted/10">
                    <td className="p-2">
                      <Checkbox 
                        checked={selectedVehicles.includes(vehicle.id)}
                        onCheckedChange={() => toggleVehicleSelection(vehicle.id)}
                      />
                    </td>
                    <td className="p-2">
                      <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                    </td>
                    <td className="p-2">{vehicle.year}</td>
                    <td className="p-2">
                      <span className="font-mono text-xs">{vehicle.vin}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{getTypeLabel(vehicle.type)}</span>
                    </td>
                    <td className="p-2">
                      <Badge className={cn("ri-badge-status", getStatusColor(vehicle.status))}>
                        {vehicle.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-2">{vehicle.location}</td>
                    <td className="p-2 font-medium text-primary">
                      {formatCurrency(vehicle.price)}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {vehicle.images.length}
                        </Badge>
                        {vehicle.customFields.videos && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            {vehicle.customFields.videos.length || 0}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => onView(vehicle)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(vehicle.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No vehicles found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}