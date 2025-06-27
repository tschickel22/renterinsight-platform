import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Pen, Save, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ErrorBoundary } from './ErrorBoundary'

interface ESignModalProps {
  documentId: string
  documentUrl: string
  onSignSuccess: (documentId: string, signatureData: string) => Promise<void>
  onClose: () => void
}

export function ESignModal({ documentId, documentUrl, onSignSuccess, onClose }: ESignModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [signerName, setSignerName] = useState('')
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('type')
  const [typedSignature, setTypedSignature] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [documentLoaded, setDocumentLoaded] = useState(false)
  const [documentError, setDocumentError] = useState(false)

  // Initialize canvas for drawing signature
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && signatureType === 'draw') {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'black'
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [signatureType])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let clientX, clientY
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let clientX, clientY
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling when drawing
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    if (signatureType === 'draw') {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      setTypedSignature('')
    }
  }

  const handleSign = async () => {
    if (signatureType === 'draw' && !canvasRef.current) {
      toast({
        title: 'Error',
        description: 'Please draw your signature',
        variant: 'destructive'
      })
      return
    }

    if (signatureType === 'type' && !typedSignature.trim()) {
      toast({
        title: 'Error',
        description: 'Please type your signature',
        variant: 'destructive'
      })
      return
    }

    if (!signerName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your full name',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      let signatureData = ''
      
      if (signatureType === 'draw') {
        // Get signature data from canvas
        signatureData = canvasRef.current?.toDataURL('image/png') || ''
      } else {
        // Use typed signature
        signatureData = typedSignature
      }
      
      await onSignSuccess(documentId, signatureData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process signature. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentLoad = () => {
    setDocumentLoaded(true)
    setDocumentError(false)
  }

  const handleDocumentError = () => {
    setDocumentLoaded(false)
    setDocumentError(true)
  }

  return (
    <ErrorBoundary fallback={
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            There was an error loading the document signing interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    }>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sign Document</CardTitle>
                <CardDescription>
                  Please review and sign the document
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Document Preview */}
            <div className="border rounded-lg p-4 bg-muted/30 min-h-[300px] flex items-center justify-center">
              {documentError ? (
                <div className="text-center">
                  <p className="text-red-500 mb-2">Failed to load document</p>
                  <Button variant="outline" onClick={() => window.open(documentUrl, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              ) : !documentLoaded ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading document...</p>
                </div>
              ) : (
                <iframe 
                  src={documentUrl} 
                  className="w-full h-[400px]" 
                  onLoad={handleDocumentLoad}
                  onError={handleDocumentError}
                >
                  Your browser does not support iframes. 
                  <a href={documentUrl} target="_blank" rel="noopener noreferrer">Click here to view the document</a>
                </iframe>
              )}
            </div>

            {/* Signature Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="signerName">Full Name</Label>
                <Input
                  id="signerName"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Enter your full legal name"
                  required
                />
              </div>

              <div>
                <Label>Signature Type</Label>
                <div className="flex space-x-2 mt-1">
                  <Button
                    type="button"
                    variant={signatureType === 'type' ? 'default' : 'outline'}
                    onClick={() => setSignatureType('type')}
                  >
                    Type Signature
                  </Button>
                  <Button
                    type="button"
                    variant={signatureType === 'draw' ? 'default' : 'outline'}
                    onClick={() => setSignatureType('draw')}
                  >
                    Draw Signature
                  </Button>
                </div>
              </div>

              {/* Signature Input */}
              <div>
                <Label>Your Signature</Label>
                <div className="mt-1">
                  {signatureType === 'type' ? (
                    <div className="space-y-2">
                      <Input
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Type your signature"
                        className="font-handwriting text-lg"
                      />
                      {typedSignature && (
                        <div className="p-4 border rounded-lg bg-white">
                          <p className="font-handwriting text-xl">{typedSignature}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="border rounded-lg overflow-hidden bg-white">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={150}
                          className="w-full touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={endDrawing}
                          onMouseLeave={endDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={endDrawing}
                        />
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                        Clear Signature
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legal Agreement */}
            <div className="p-4 bg-muted/30 rounded-lg text-sm">
              <p>
                By clicking "Sign Document", I acknowledge that I have read and agree to the terms and conditions
                outlined in this document. I understand that my electronic signature constitutes a legally binding
                signature.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSign} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Pen className="h-4 w-4 mr-2" />
                    Sign Document
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}