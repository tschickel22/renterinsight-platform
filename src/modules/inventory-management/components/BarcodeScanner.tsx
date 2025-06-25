import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Camera, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BarcodeScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const { toast } = useToast()
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // In a real implementation, this would use a barcode scanning library
  // For this demo, we'll simulate scanning

  useEffect(() => {
    // Simulate camera initialization
    const timer = setTimeout(() => {
      setScanning(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleScanSimulation = () => {
    // Generate a random VIN (17 characters)
    const characters = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
    let vin = ''
    for (let i = 0; i < 17; i++) {
      vin += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    setResult(vin)
    
    toast({
      title: 'Barcode Scanned',
      description: `VIN: ${vin}`,
    })
  }

  const handleConfirm = () => {
    if (result) {
      onScan(result)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scan VIN Barcode</CardTitle>
              <CardDescription>
                Position the barcode in front of your camera
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black h-64 flex items-center justify-center rounded-md relative">
            {scanning ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-1 bg-red-500 animate-pulse"></div>
                </div>
                <div className="text-white text-sm absolute bottom-2 left-2">
                  {result ? `Scanned: ${result}` : 'Scanning...'}
                </div>
              </>
            ) : (
              <Camera className="h-12 w-12 text-white/50" />
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {result ? (
              <Button onClick={handleConfirm}>
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            ) : (
              <Button onClick={handleScanSimulation}>
                Simulate Scan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}