import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, Upload, Image as ImageIcon, Save } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

export function BrandingSettings() {
  const { tenant, updateTenantSettings } = useTenant()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(tenant?.branding.primaryColor || '#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState(tenant?.branding.secondaryColor || '#64748b')
  const [fontFamily, setFontFamily] = useState(tenant?.branding.fontFamily || 'Inter')
  const [logoUrl, setLogoUrl] = useState(tenant?.branding.logo || '')
  const [logoPreview, setLogoPreview] = useState(tenant?.branding.logo || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Oswald', label: 'Oswald' }
  ]

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to a storage service
      // For this demo, we'll create an object URL
      const objectUrl = URL.createObjectURL(file)
      setLogoPreview(objectUrl)
      
      // In a real app, you would set the logoUrl to the URL returned from the storage service
      // For this demo, we'll just use the object URL
      setLogoUrl(objectUrl)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateTenantSettings({
        branding: {
          primaryColor,
          secondaryColor,
          fontFamily,
          logo: logoUrl
        }
      })
      
      toast({
        title: 'Branding Updated',
        description: 'Your branding settings have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update branding settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-primary" />
          Branding & Appearance
        </CardTitle>
        <CardDescription>
          Customize your dealership's visual identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-4">
          <Label>Company Logo</Label>
          <div className="flex items-center space-x-4">
            <div className="border rounded-md p-4 w-40 h-40 flex items-center justify-center bg-muted/30">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Company Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <Input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoChange}
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 200x200px. Max file size: 2MB.
                <br />
                Supported formats: PNG, JPG, SVG
              </p>
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10 shadow-sm"
              />
              <Input 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="shadow-sm" 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used for buttons, links, and primary actions
            </p>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                id="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-10 shadow-sm"
              />
              <Input 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="shadow-sm" 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used for secondary elements and accents
            </p>
          </div>
        </div>

        {/* Font Settings */}
        <div>
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={fontFamily}
            onValueChange={setFontFamily}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            The primary font used throughout your application
          </p>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div 
            className="space-y-4 p-4 rounded-lg border"
            style={{
              fontFamily: fontFamily
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold">Text Preview</h4>
              <p>This is how your text will appear with the selected font.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Color Preview</h4>
              <div className="flex space-x-4">
                <div 
                  className="w-20 h-10 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary
                </div>
                <div 
                  className="w-20 h-10 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Secondary
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Button Preview</h4>
              <div className="flex space-x-4">
                <button 
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-4 py-2 rounded-md border"
                  style={{ borderColor: secondaryColor, color: secondaryColor }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Branding
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}