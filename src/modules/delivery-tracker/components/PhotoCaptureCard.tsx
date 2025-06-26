import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useDropzone } from 'react-dropzone'
import { Delivery } from '@/types'

interface PhotoCaptureCardProps {
  delivery: Delivery
  onPhotoCapture: (photoUrl: string, caption: string) => Promise<void>
}

export function PhotoCaptureCard({ delivery, onPhotoCapture }: PhotoCaptureCardProps) {
  const { toast } = useToast()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      
      // In a real app, you would upload the file to a storage service
      // For this demo, we'll create an object URL
      const file = acceptedFiles[0]
      const objectUrl = URL.createObjectURL(file)
      setPhotoUrl(objectUrl)
      
      toast({
        title: 'Photo Added',
        description: 'Photo has been added. Add a caption and save.',
      })
    }
  })

  const handleCapture = async () => {
    if (!photoUrl) {
      toast({
        title: 'Error',
        description: 'Please add a photo first',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    try {
      await onPhotoCapture(photoUrl, caption)
      
      // Reset form
      setPhotoUrl(null)
      setCaption('')
      
      toast({
        title: 'Success',
        description: 'Delivery photo saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save delivery photo',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSimulateCapture = () => {
    // Simulate taking a photo with the device camera
    // In a real app, this would use the device camera API
    const mockPhotoUrl = 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'
    setPhotoUrl(mockPhotoUrl)
    
    toast({
      title: 'Photo Captured',
      description: 'Photo has been captured. Add a caption and save.',
    })
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Camera className="h-5 w-5 mr-2 text-primary" />
          Delivery Photo Verification
        </CardTitle>
        <CardDescription>
          Capture photos to verify successful delivery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {photoUrl ? (
          <div className="relative">
            <img 
              src={photoUrl} 
              alt="Delivery verification" 
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setPhotoUrl(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
              }`}
            >
              <input {...getInputProps()} />
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop a photo here, or click to select a file
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">- OR -</p>
              <Button onClick={handleSimulateCapture}>
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        )}

        {photoUrl && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="caption">Photo Caption</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g., Vehicle delivered at customer's driveway"
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleCapture}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Save Photo
                </>
              )}
            </Button>
          </div>
        )}

        {delivery.customFields.photos && delivery.customFields.photos.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Saved Photos</h4>
            <div className="grid grid-cols-2 gap-2">
              {delivery.customFields.photos.map((photo: any, index: number) => (
                <div key={index} className="relative">
                  <img 
                    src={photo.url} 
                    alt={photo.caption || `Delivery photo ${index + 1}`} 
                    className="w-full h-24 object-cover rounded-md"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}