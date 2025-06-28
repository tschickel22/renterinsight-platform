import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useDropzone } from 'react-dropzone'
import { X, Save, Plus, Trash2, Upload, Image as ImageIcon, Video, QrCode, Camera } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Add MH types to the Select component

interface VehicleFormProps {
  vehicle?: Vehicle
  onSave: (vehicleData: Partial<Vehicle>) => Promise<void>
  onCancel: () => void
  onScanBarcode?: () => void
}

export function VehicleForm({ vehicle, onSave, onCancel, onScanBarcode }: VehicleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: VehicleType.RV,
    status: VehicleStatus.AVAILABLE,
    price: 0,
    cost: 0,
    location: '',
    features: [],
    images: [],
    customFields: {
      videos: [],
      exteriorColor: '',
      interiorColor: '',
      length: '',
      weight: '',
      sleeps: '',
      slideouts: '',
      fuelType: '',
      mileage: '',
      condition: 'New'
    }
  })

  const [newFeature, setNewFeature] = useState('')
  const [newVideo, setNewVideo] = useState('')
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  // Initialize form with vehicle data if editing
  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
        customFields: {
          ...vehicle.customFields,
          videos: vehicle.customFields.videos || []
        }
      })
    }
  }, [vehicle])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      // In a real app, you would upload these files to a storage service
      // For this demo, we'll create object URLs
      const newImages = acceptedFiles.map(file => 
        URL.createObjectURL(file)
      )
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }))
      
      toast({
        title: 'Images Added',
        description: `Added ${acceptedFiles.length} images`,
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vin || !formData.make || !formData.model || !formData.year) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Vehicle ${vehicle ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${vehicle ? 'update' : 'create'} vehicle`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }))
  }

  const addVideo = () => {
    if (newVideo.trim()) {
      setFormData(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          videos: [...(prev.customFields?.videos || []), newVideo.trim()]
        }
      }))
      setNewVideo('')
    }
  }

  const removeVideo = (videoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        videos: prev.customFields?.videos?.filter(v => v !== videoUrl) || []
      }
    }))
  }

  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== imageUrl) || []
    }))
  }

  const handleBarcodeScanned = (data: string) => {
    // Typically, VINs are 17 characters long
    if (data.length === 17) {
      setFormData(prev => ({
        ...prev,
        vin: data
      }))
      
      toast({
        title: 'Barcode Scanned',
        description: `VIN: ${data}`,
      })
      
      setShowBarcodeScanner(false)
    } else {
      toast({
        title: 'Invalid Barcode',
        description: 'The scanned barcode does not appear to be a valid VIN',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{vehicle ? 'Edit Vehicle' : 'Add New Home'}</CardTitle>
              <CardDescription>
                {vehicle ? 'Update vehicle details' : 'Add a new home to inventory'}
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
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vin">VIN *</Label>
                  <div className="flex">
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
                      placeholder="Vehicle Identification Number"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => setShowBarcodeScanner(true)}
                    >
                      <QrCode className="h-4 w-4" />
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
                    placeholder="e.g., Forest River, Winnebago"
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., Georgetown, View"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: VehicleType) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VehicleType.RV}>RV</SelectItem>
                      <SelectItem value={VehicleType.MOTORHOME}>Motorhome</SelectItem>
                      <SelectItem value={VehicleType.TRAVEL_TRAILER}>Travel Trailer</SelectItem>
                      <SelectItem value={VehicleType.FIFTH_WHEEL}>Fifth Wheel</SelectItem>
                      <SelectItem value={VehicleType.TOY_HAULER}>Toy Hauler</SelectItem>
                      <SelectItem value={VehicleType.SINGLE_WIDE}>Single Wide MH</SelectItem>
                      <SelectItem value={VehicleType.DOUBLE_WIDE}>Double Wide MH</SelectItem>
                      <SelectItem value={VehicleType.TRIPLE_WIDE}>Triple Wide MH</SelectItem>
                      <SelectItem value={VehicleType.PARK_MODEL}>Park Model</SelectItem>
                      <SelectItem value={VehicleType.MODULAR_HOME}>Modular Home</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value={VehicleStatus.SERVICE}>Service</SelectItem>
                      <SelectItem value={VehicleStatus.DELIVERED}>Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Lot A-15"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
                {(!formData.features || formData.features.length === 0) && (
                  <div className="text-sm text-muted-foreground">No features added yet</div>
                )}
              </div>
            </div>

            {/* MH-specific fields */}
            {(formData.type === VehicleType.SINGLE_WIDE || 
              formData.type === VehicleType.DOUBLE_WIDE || 
              formData.type === VehicleType.TRIPLE_WIDE || 
              formData.type === VehicleType.PARK_MODEL || 
              formData.type === VehicleType.MODULAR_HOME) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Manufactured Housing Details</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      value={formData.customFields?.squareFootage || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          squareFootage: e.target.value
                        }
                      }))}
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select 
                      value={formData.customFields?.bedrooms || ''} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          bedrooms: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select 
                      value={formData.customFields?.bathrooms || ''} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          bathrooms: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="2.5">2.5</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="3+">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="constructionType">Construction Type</Label>
                    <Select 
                      value={formData.customFields?.constructionType || ''} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          constructionType: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufactured">Manufactured</SelectItem>
                        <SelectItem value="Modular">Modular</SelectItem>
                        <SelectItem value="Park Model">Park Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exteriorSiding">Exterior Siding</Label>
                    <Input
                      id="exteriorSiding"
                      value={formData.customFields?.exteriorSiding || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          exteriorSiding: e.target.value
                        }
                      }))}
                      placeholder="e.g., Vinyl, Hardiplank"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roofType">Roof Type</Label>
                    <Input
                      id="roofType"
                      value={formData.customFields?.roofType || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          roofType: e.target.value
                        }
                      }))}
                      placeholder="e.g., Shingle, Metal"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MH-specific fields */}
            {(formData.type === VehicleType.SINGLE_WIDE || 
              formData.type === VehicleType.DOUBLE_WIDE || 
              formData.type === VehicleType.TRIPLE_WIDE || 
              formData.type === VehicleType.PARK_MODEL || 
              formData.type === VehicleType.MODULAR_HOME) && (
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    value={formData.customFields?.squareFootage || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        squareFootage: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="constructionType">Construction Type</Label>
                  <Select 
                    value={formData.customFields?.constructionType || ''} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        constructionType: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manufactured">Manufactured</SelectItem>
                      <SelectItem value="Modular">Modular</SelectItem>
                      <SelectItem value="Park Model">Park Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select 
                    value={formData.customFields?.bedrooms || ''} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        bedrooms: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select 
                    value={formData.customFields?.bathrooms || ''} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        bathrooms: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="3+">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exteriorSiding">Exterior Siding</Label>
                  <Input
                    id="exteriorSiding"
                    value={formData.customFields?.exteriorSiding || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        exteriorSiding: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="roofType">Roof Type</Label>
                  <Input
                    id="roofType"
                    value={formData.customFields?.roofType || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        roofType: e.target.value
                      }
                    }))}
                  />
                </div>
              </div>
            )}

            {/* Custom Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specifications</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="exteriorColor">Exterior Color</Label>
                  <Input
                    id="exteriorColor"
                    value={formData.customFields?.exteriorColor || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        exteriorColor: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="interiorColor">Interior Color</Label>
                  <Input
                    id="interiorColor"
                    value={formData.customFields?.interiorColor || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        interiorColor: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    value={formData.customFields?.length || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        length: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    value={formData.customFields?.weight || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        weight: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input
                    id="sleeps"
                    value={formData.customFields?.sleeps || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        sleeps: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="slideouts">Slideouts</Label>
                  <Input
                    id="slideouts"
                    value={formData.customFields?.slideouts || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        slideouts: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select 
                    value={formData.customFields?.fuelType || ''} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        fuelType: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not Applicable</SelectItem>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="propane">Propane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    value={formData.customFields?.mileage || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        mileage: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select 
                    value={formData.customFields?.condition || 'New'} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        condition: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              
              <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/10">
                <input {...getInputProps()} />
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop images here, or click to select files
                </p>
              </div>
              
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Vehicle ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Videos</h3>
              
              <div className="flex space-x-2">
                <Input
                  value={newVideo}
                  onChange={(e) => setNewVideo(e.target.value)}
                  placeholder="Add a video URL (YouTube, Vimeo, etc.)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addVideo()
                    }
                  }}
                />
                <Button type="button" onClick={addVideo}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.customFields?.videos?.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2 text-blue-500" />
                      <a 
                        href={video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate max-w-md"
                      >
                        {video}
                      </a>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(video)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!formData.customFields?.videos || formData.customFields.videos.length === 0) && (
                  <div className="text-sm text-muted-foreground">No videos added yet</div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              
              <Textarea
                value={formData.customFields?.notes || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customFields: {
                    ...prev.customFields,
                    notes: e.target.value
                  }
                }))}
                placeholder="Add any additional notes about this vehicle..."
                rows={3}
              />
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
                    {vehicle ? 'Update' : 'Create'} Home
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Scan VIN Barcode</CardTitle>
              <CardDescription>
                Position the barcode in front of your camera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black h-64 flex items-center justify-center rounded-md">
                <Camera className="h-12 w-12 text-white/50" />
                {/* In a real implementation, this would be a video feed from the camera */}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowBarcodeScanner(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Simulate a barcode scan
                  handleBarcodeScanned('1FDXE4FS8KDC' + Math.floor(Math.random() * 100000).toString().padStart(5, '0'))
                }}>
                  Simulate Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}