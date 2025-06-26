import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Camera, Image as ImageIcon, Upload, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useDropzone } from 'react-dropzone'

interface DeliveryPhotoCaptureProps {
  onCapture: (photos: string[], captions: string[]) => Promise<void>
  onCancel: () => void
}

export function DeliveryPhotoCapture({ onCapture, onCancel }: DeliveryPhotoCaptureProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [captions, setCaptions] = useState<string[]>([])
  const [activeCamera, setActiveCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      // In a real app, you would upload these files to a storage service
      // For this demo, we'll create object URLs
      const newPhotos = acceptedFiles.map(file => 
        URL.createObjectURL(file)
      )
      
      setPhotos(prev => [...prev, ...newPhotos])
      setCaptions(prev => [...prev, ...newPhotos.map(() => '')])
      
      toast({
        title: 'Photos Added',
        description: `Added ${acceptedFiles.length} photos`,
      })
    }
  })

  // Start camera
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setActiveCamera(true)
        }
      } else {
        toast({
          title: 'Camera Error',
          description: 'Camera access not supported in this browser',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: 'Camera Error',
        description: 'Failed to access camera',
        variant: 'destructive'
      })
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setActiveCamera(false)
    }
  }

  // Take photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert canvas to data URL
        const photoUrl = canvas.toDataURL('image/jpeg')
        
        // Add to photos array
        setPhotos(prev => [...prev, photoUrl])
        setCaptions(prev => [...prev, ''])
        
        toast({
          title: 'Photo Captured',
          description: 'Photo has been added to the delivery',
        })
      }
    }
  }

  // Update caption for a specific photo
  const updateCaption = (index: number, caption: string) => {
    const newCaptions = [...captions]
    newCaptions[index] = caption
    setCaptions(newCaptions)
  }

  // Remove a photo
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setCaptions(prev => prev.filter((_, i) => i !== index))
  }

  // Save all photos
  const handleSave = async () => {
    if (photos.length === 0) {
      toast({
        title: 'No Photos',
        description: 'Please add at least one photo',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onCapture(photos, captions)
      
      // Stop camera if active
      if (activeCamera) {
        stopCamera()
      }
      
      toast({
        title: 'Photos Saved',
        description: `${photos.length} photos have been saved`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save photos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (activeCamera) {
        stopCamera()
      }
    }
  }, [activeCamera])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Capture Delivery Photos</CardTitle>
              <CardDescription>
                Take or upload photos to verify delivery
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Camera</h3>
              {!activeCamera ? (
                <Button onClick={startCamera} size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </div>
            
            {activeCamera ? (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-auto"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <Button onClick={takePhoto} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Click "Start Camera" to take photos
                </p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload Photos</h3>
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/10">
              <input {...getInputProps()} />
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop photos here, or click to select files
              </p>
            </div>
          </div>

          {/* Photos Preview */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photos ({photos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="relative">
                      <img 
                        src={photo} 
                        alt={`Delivery photo ${index + 1}`} 
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`caption-${index}`}>Caption (Optional)</Label>
                      <Input
                        id={`caption-${index}`}
                        value={captions[index] || ''}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        placeholder="Add a caption for this photo"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || photos.length === 0}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Photos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}