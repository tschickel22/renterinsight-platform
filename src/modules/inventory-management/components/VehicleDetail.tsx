import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Edit, Package, DollarSign, Calendar, Truck, Wrench, FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface VehicleDetailProps {
  vehicle: Vehicle
  onClose: () => void
  onEdit: (vehicle: Vehicle) => void
}

export function VehicleDetail({ vehicle, onClose, onEdit }: VehicleDetailProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
              <CardDescription>
                VIN: {vehicle.vin}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => {
                onClose();
                onEdit(vehicle);
              }} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Home/RV
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vehicle Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("ri-badge-status", getStatusColor(vehicle.status))}>
              {vehicle.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {getTypeLabel(vehicle.type)}
            </Badge>
            <div className="ml-auto font-bold text-lg text-primary">
              {formatCurrency(vehicle.price)}
            </div>
          </div>

          {/* Vehicle Tabs */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Basic Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Make</label>
                  <p className="font-medium">{vehicle.make}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p className="font-medium">{vehicle.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">VIN</label>
                  <p className="font-medium font-mono">{vehicle.vin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="font-medium">{getTypeLabel(vehicle.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="font-medium">{vehicle.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="font-medium text-primary">{formatCurrency(vehicle.price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost</label>
                  <p className="font-medium">{formatCurrency(vehicle.cost)}</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {vehicle.customFields?.exteriorColor && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Exterior Color</label>
                      <p className="font-medium">{vehicle.customFields.exteriorColor}</p>
                    </div>
                  )}
                  {vehicle.customFields?.interiorColor && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Interior Color</label>
                      <p className="font-medium">{vehicle.customFields.interiorColor}</p>
                    </div>
                  )}
                  {vehicle.customFields?.length && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <p className="font-medium">{vehicle.customFields.length} ft</p>
                    </div>
                  )}
                  {vehicle.customFields?.weight && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Weight</label>
                      <p className="font-medium">{vehicle.customFields.weight} lbs</p>
                    </div>
                  )}
                  {vehicle.customFields?.sleeps && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sleeps</label>
                      <p className="font-medium">{vehicle.customFields.sleeps}</p>
                    </div>
                  )}
                  {vehicle.customFields?.slideouts && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Slideouts</label>
                      <p className="font-medium">{vehicle.customFields.slideouts}</p>
                    </div>
                  )}
                  {vehicle.customFields?.fuelType && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fuel Type</label>
                      <p className="font-medium">{vehicle.customFields.fuelType}</p>
                    </div>
                  )}
                  {vehicle.customFields?.mileage && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mileage</label>
                      <p className="font-medium">{vehicle.customFields.mileage}</p>
                    </div>
                  )}
                  {vehicle.customFields?.condition && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Condition</label>
                      <p className="font-medium">{vehicle.customFields.condition}</p>
                    </div>
                  )}
                  
                  {/* MH-specific fields */}
                  {(vehicle.type === VehicleType.SINGLE_WIDE || 
                    vehicle.type === VehicleType.DOUBLE_WIDE || 
                    vehicle.type === VehicleType.TRIPLE_WIDE || 
                    vehicle.type === VehicleType.PARK_MODEL || 
                    vehicle.type === VehicleType.MODULAR_HOME) && (
                    <>
                      {vehicle.customFields?.squareFootage && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Square Footage</label>
                          <p className="font-medium">{vehicle.customFields.squareFootage} sq ft</p>
                        </div>
                      )}
                      {vehicle.customFields?.bedrooms && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Bedrooms</label>
                          <p className="font-medium">{vehicle.customFields.bedrooms}</p>
                        </div>
                      )}
                      {vehicle.customFields?.bathrooms && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Bathrooms</label>
                          <p className="font-medium">{vehicle.customFields.bathrooms}</p>
                        </div>
                      )}
                      {vehicle.customFields?.constructionType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Construction Type</label>
                          <p className="font-medium">{vehicle.customFields.constructionType}</p>
                        </div>
                      )}
                      {vehicle.customFields?.exteriorSiding && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Exterior Siding</label>
                          <p className="font-medium">{vehicle.customFields.exteriorSiding}</p>
                        </div>
                      )}
                      {vehicle.customFields?.roofType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Roof Type</label>
                          <p className="font-medium">{vehicle.customFields.roofType}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* MH-specific fields */}
                  {(vehicle.type === VehicleType.SINGLE_WIDE || 
                    vehicle.type === VehicleType.DOUBLE_WIDE || 
                    vehicle.type === VehicleType.TRIPLE_WIDE || 
                    vehicle.type === VehicleType.PARK_MODEL || 
                    vehicle.type === VehicleType.MODULAR_HOME) && (
                    <>
                      {vehicle.customFields?.squareFootage && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Square Footage</label>
                          <p className="font-medium">{vehicle.customFields.squareFootage} sq ft</p>
                        </div>
                      )}
                      {vehicle.customFields?.bedrooms && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Bedrooms</label>
                          <p className="font-medium">{vehicle.customFields.bedrooms}</p>
                        </div>
                      )}
                      {vehicle.customFields?.bathrooms && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Bathrooms</label>
                          <p className="font-medium">{vehicle.customFields.bathrooms}</p>
                        </div>
                      )}
                      {vehicle.customFields?.constructionType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Construction Type</label>
                          <p className="font-medium">{vehicle.customFields.constructionType}</p>
                        </div>
                      )}
                      {vehicle.customFields?.exteriorSiding && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Exterior Siding</label>
                          <p className="font-medium">{vehicle.customFields.exteriorSiding}</p>
                        </div>
                      )}
                      {vehicle.customFields?.roofType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Roof Type</label>
                          <p className="font-medium">{vehicle.customFields.roofType}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images">
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-md">
                      <img 
                        src={image} 
                        alt={`${vehicle.make} ${vehicle.model} ${index + 1}`} 
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No images available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="features">
              {vehicle.features && vehicle.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-2 bg-muted/30 rounded-md">
                      <Package className="h-4 w-4 mr-2 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No features listed</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos">
              {vehicle.customFields?.videos && vehicle.customFields.videos.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.customFields.videos.map((video, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-md">
                      <div className="flex items-center mb-2">
                        <Video className="h-4 w-4 mr-2 text-primary" />
                        <a 
                          href={video} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Video {index + 1}
                        </a>
                      </div>
                      {/* In a real app, you might embed the video here */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No videos available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes">
              {vehicle.customFields?.notes ? (
                <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap">
                  {vehicle.customFields.notes}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No notes available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(vehicle)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Home/RV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}