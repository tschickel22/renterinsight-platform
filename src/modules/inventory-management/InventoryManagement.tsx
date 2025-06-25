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
