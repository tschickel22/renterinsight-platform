import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Camera, Image as ImageIcon, Upload, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useDropzone } from 'react-dropzone'

interface DeliveryPhotoCaptureProps {
  onCapture: (photos: string[], captions: string[], tags: string[][]) => Promise<void>
  onCancel: () => void
}

export function DeliveryPhotoCapture({ onCapture, onCancel }: DeliveryPhotoCaptureProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [captions, setCaptions] = useState<string[]>([])
  const [tags, setTags] = useState<string[][]>([])
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const compressImage = async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const MAX_WIDTH = 800
        const scaleSize = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scaleSize
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = imageDataUrl
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    maxFiles: 10,
    onDrop: async (acceptedFiles) => {
      try {
        const compressedPromises = acceptedFiles.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = async () => {
            const compressed = await compressImage(reader.result as string)
            resolve(compressed)
          }
          reader.readAsDataURL(file)
        }))
        const newPhotos = await Promise.all(compressedPromises)
        setPhotos(prev => [...prev, ...newPhotos])
        setCaptions(prev => [...prev, ...newPhotos.map(() => '')])
        setTags(prev => [...prev, ...newPhotos.map(() => [])])
        toast({ title: 'Upload Successful', description: `${acceptedFiles.length} photo(s) added.` })
      } catch (error) {
        console.error('File processing error:', error)
        toast({ title: 'Upload Error', description: 'An error occurred while processing files.', variant: 'destructive' })
      }
    },
    onError: (err) => {
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' })
    }
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        toast({ title: 'Camera Started', description: 'Camera is now active.' })
      }
    } catch (err) {
      console.error('Camera access error:', err)
      toast({ title: 'Camera Error', description: 'Unable to access camera.', variant: 'destructive' })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
      toast({ title: 'Camera Stopped' })
    }
  }

  const takePhoto = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return
      const context = canvasRef.current.getContext('2d')
      if (!context) throw new Error('Canvas context not found')

      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      const rawData = canvasRef.current.toDataURL('image/jpeg')
      const compressed = await compressImage(rawData)

      setPhotos(prev => [...prev, compressed])
      setCaptions(prev => [...prev, ''])
      setTags(prev => [...prev, []])
      toast({ title: 'Photo Captured', description: 'Photo added to list.' })
    } catch (err) {
      console.error('Photo capture failed:', err)
      toast({ title: 'Capture Error', description: 'Failed to capture photo.', variant: 'destructive' })
    }
  }

  const updateCaption = (index: number, value: string) => {
    setCaptions(prev => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const updateTags = (index: number, value: string) => {
    const tagArray = value.split(',').map(tag => tag.trim()).filter(Boolean)
    setTags(prev => {
      const copy = [...prev]
      copy[index] = tagArray
      return copy
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setCaptions(prev => prev.filter((_, i) => i !== index))
    setTags(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!photos.length) {
      toast({ title: 'No Photos', description: 'Please add or take at least one photo.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      await onCapture(photos, captions, tags)
      toast({ title: 'Photos Saved', description: `${photos.length} photo(s) saved.` })
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Save Failed', description: 'Unable to save photos.', variant: 'destructive' })
    } finally {
      setLoading(false)
      stopCamera()
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Delivery Photo Capture</CardTitle>
            <CardDescription>Take or upload photos and add optional captions & tags</CardDescription>
          </div>
          <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ...camera and upload code remains the same... */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Photos ({photos.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="relative">
                      <img src={photo} className="w-full h-40 object-cover rounded-md" alt={`Photo ${index + 1}`} />
                      <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => removePhoto(index)}><X className="w-4 h-4" /></Button>
                    </div>
                    <Label htmlFor={`caption-${index}`}>Caption</Label>
                    <Input
                      id={`caption-${index}`}
                      value={captions[index] || ''}
                      placeholder="Optional caption"
                      onChange={(e) => updateCaption(index, e.target.value)}
                    />
                    <Label htmlFor={`tags-${index}`}>Tags (comma-separated)</Label>
                    <Input
                      id={`tags-${index}`}
                      value={tags[index]?.join(', ') || ''}
                      placeholder="e.g. front, side, receipt"
                      onChange={(e) => updateTags(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button onClick={onCancel} variant="outline" disabled={loading}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading || photos.length === 0}>
              {loading ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              {loading ? 'Saving...' : 'Save Photos'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
