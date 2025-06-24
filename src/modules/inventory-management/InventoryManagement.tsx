import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Search, Filter, Eye, Edit, Trash2, TrendingUp, DollarSign } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    vin: '1FDXE4FS8KDC12345',
    make: 'Forest River',
    model: 'Georgetown',
    year: 2024,
    type: VehicleType.MOTORHOME,
    status: VehicleStatus.AVAILABLE,
    price: 125000,
    cost: 95000,
    location: 'Lot A-15',
    features: ['Slide-out', 'Generator', 'Solar Panel'],
    images: ['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
    customFields: {},
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    vin: '1FDXE4FS8KDC67890',
    make: 'Winnebago',
    model: 'View',
    year: 2023,
    type: VehicleType.RV,
    status: VehicleStatus.RESERVED,
    price: 89000,
    cost: 72000,
    location: 'Lot B-08',
    features: ['Compact Design', 'Fuel Efficient'],
    images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
    customFields: {},
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12')
  }
]

function InventoryList() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredVehicles = vehicles.filter(vehicle =>
    `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.year.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your RV and motorhome inventory
            </p>
          </div>
          <Button className="shadow-sm">
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
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search inventory..."
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
                    <div className="font-medium">{vehicle.location}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <div className="font-medium">{vehicle.type.replace('_', ' ').toUpperCase()}</div>
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
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t gap-2">
                <Button variant="outline" size="sm" className="flex-1 shadow-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 shadow-sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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