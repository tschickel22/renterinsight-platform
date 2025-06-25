import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, Plus, Package, Barcode } from 'lucide-react'
import { Vehicle, VehicleType, VehicleStatus, VehicleCategory } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface VehicleFormProps {
  vehicle?: Vehicle
  onSave: (vehicleData: Partial<Vehicle>) => Promise<void>
  onCancel: () => void
}

export function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showCustomType, setShowCustomType] = useState(false)
  
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: VehicleCategory.RV,
    type: VehicleType.RV,
    status: VehicleStatus.AVAILABLE,
    price: 0,
    cost: 0,
    location: '',
    features: [],
    images: [],
    videos: [],
    customFields: {}
  })

  const [customType, setCustomType] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [imagesText, setImagesText] = useState('')
  const [videosText, setVideosText] = useState('')
  const [customFieldsText, setCustomFieldsText] = useState('{}')

  // Initialize form with vehicle data if editing
  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
      })
      
      setFeaturesText(vehicle.features.join(', '))
      setImagesText(vehicle.images.join(', '))
      setVideosText(vehicle.videos?.join(', ') || '')
      setCustomFieldsText(JSON.stringify(vehicle.customFields, null, 2))
      
      // Check if this is a custom type
      if (!Object.values(VehicleType).includes(vehicle.type) || vehicle.type === VehicleType.CUSTOM) {
        setShowCustomType(true)
        setCustomType(vehicle.type)
      }
    }
  }, [vehicle])

  // Get vehicle types based on selected category
  const getVehicleTypesByCategory = (category: VehicleCategory) => {
    if (category === VehicleCategory.RV) {
      return [
        { value: VehicleType.RV, label: 'RV (Generic)' },
        { value: VehicleType.MOTORHOME, label: 'Motorhome' },
        { value: VehicleType.TRAVEL_TRAILER, label: 'Travel Trailer' },
        { value: VehicleType.FIFTH_WHEEL, label: 'Fifth Wheel' },
        { value: VehicleType.TOY_HAULER, label: 'Toy Hauler' },
        { value: VehicleType.CUSTOM, label: 'Add New Type...' }
      ]
    } else {
      return [
        { value: VehicleType.SINGLE_WIDE, label: 'Single Wide' },
        { value: VehicleType.DOUBLE_WIDE, label: 'Double Wide' },
        { value: VehicleType.TRIPLE_WIDE, label: 'Triple Wide' },
        { value: VehicleType.MODULAR_HOME, label: 'Modular Home' },
        { value: VehicleType.CUSTOM, label: 'Add New Type...' }
      ]
    }
  }

  const handleCategoryChange = (category: VehicleCategory) => {
    setFormData(prev => ({
      ...prev,
      category,
      // Set default type based on category
      type: category === VehicleCategory.RV ? VehicleType.RV : VehicleType.SINGLE_WIDE
    }))
    setShowCustomType(false)
  }

  const handleTypeChange = (type: VehicleType) => {
    if (type === VehicleType.CUSTOM) {
      setShowCustomType(true)
      setCustomType('')
    } else {
      setShowCustomType(false)
      setFormData(prev => ({ ...prev, type }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Validate required fields
      if (!formData.vin || !formData.make || !formData.model || !formData.year) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }
      
      // Process features, images, videos
      const features = featuresText.split(',').map(f => f.trim()).filter(Boolean)
      const images = imagesText.split(',').map(i => i.trim()).filter(Boolean)
      const videos = videosText.split(',').map(v => v.trim()).filter(Boolean)
      
      // Process custom fields
      let customFields = {}
      try {
        customFields = JSON.parse(customFieldsText)
      } catch (error) {
        toast({
          title: 'Invalid JSON',
          description: 'Custom fields must be valid JSON',
          variant: 'destructive'
        })
        return
      }
      
      // Prepare final data
      const finalData: Partial<Vehicle> = {
        ...formData,
        type: showCustomType ? customType as VehicleType : formData.type,
        features,
        images,
        videos,
        customFields
      }
      
      await onSave(finalData)
      
      toast({
        title: 'Success',
        description: `Vehicle ${vehicle ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast({
        title: 'Error',
        description: `Failed to ${vehicle ? 'update' : 'create'} vehicle`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
              <CardDescription>
                {vehicle ? 'Update vehicle details' : 'Add a new vehicle to inventory'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vin">VIN/Serial Number *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
                      placeholder="Enter VIN or serial number"
                    />
                    <Button type="button" variant="outline" className="shrink-0">
                      <Barcode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="Enter manufacturer"
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Enter model"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: VehicleCategory) => handleCategoryChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VehicleCategory.RV}>RV</SelectItem>
                      <SelectItem value={VehicleCategory.MANUFACTURED_HOME}>Manufactured Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={showCustomType ? VehicleType.CUSTOM : formData.type} 
                    onValueChange={(value: VehicleType) => handleTypeChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getVehicleTypesByCategory(formData.category || VehicleCategory.RV).map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showCustomType && (
                <div>
                  <Label htmlFor="customType">Custom Type *</Label>
                  <Input
                    id="customType"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Enter custom type"
                  />
                </div>
              )}
            </div>

            {/* Pricing and Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing and Status
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: VehicleStatus) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VehicleStatus.AVAILABLE}>Available</SelectItem>
                      <SelectItem value={VehicleStatus.RESERVED}>Reserved</SelectItem>
                      <SelectItem value={VehicleStatus.SOLD}>Sold</SelectItem>
                      <SelectItem value={VehicleStatus.SERVICE}>In Service</SelectItem>
                      <SelectItem value={VehicleStatus.DELIVERED}>Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter storage location (e.g., Lot A-15)"
                />
              </div>
            </div>

            {/* Features and Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features and Media</h3>
              
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="e.g., Slide-out, Generator, Solar Panel"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Textarea
                  id="images"
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="videos">Video URLs (comma-separated)</Label>
                <Textarea
                  id="videos"
                  value={videosText}
                  onChange={(e) => setVideosText(e.target.value)}
                  placeholder="e.g., https://example.com/video1.mp4, https://example.com/video2.mp4"
                  rows={2}
                />
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Custom Fields</h3>
              
              <div>
                <Label htmlFor="customFields">Custom Fields (JSON format)</Label>
                <Textarea
                  id="customFields"
                  value={customFieldsText}
                  onChange={(e) => setCustomFieldsText(e.target.value)}
                  placeholder='e.g., {"floorplan": "Open Concept", "length": "32ft", "sleeps": 6}'
                  rows={5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter custom fields as a JSON object. Keys should be strings, values can be strings, numbers, or booleans.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {vehicle ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {vehicle ? 'Update' : 'Create'} Vehicle
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Add missing imports
import { DollarSign } from 'lucide-react'