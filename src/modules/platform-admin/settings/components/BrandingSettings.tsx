import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Paintbrush, Image, Palette, Type } from 'lucide-react'

interface BrandingSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function BrandingSettings({ settings, onChange }: BrandingSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Image className="mr-2 h-5 w-5" /> Logos & Favicon
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={settings.logoUrl || ''}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="e.g., https://yourdomain.com/logo.png"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL for your company logo, displayed in the application.
            </p>
          </div>

          <div>
            <Label htmlFor="faviconUrl">Favicon URL</Label>
            <Input
              id="faviconUrl"
              value={settings.faviconUrl || ''}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
              placeholder="e.g., https://yourdomain.com/favicon.ico"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL for your favicon, displayed in browser tabs.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Palette className="mr-2 h-5 w-5" /> Colors & Typography
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input
              id="primaryColor"
              type="color"
              value={settings.primaryColor || '#4F46E5'}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-24 h-10 p-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Main accent color for buttons, links, etc.
            </p>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <Input
              id="secondaryColor"
              type="color"
              value={settings.secondaryColor || '#6366F1'}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="w-24 h-10 p-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Secondary accent color for less prominent elements.
            </p>
          </div>

          <div>
            <Label htmlFor="fontFamily">Font Family</Label>
            <Input
              id="fontFamily"
              value={settings.fontFamily || 'Inter, sans-serif'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              placeholder="e.g., 'Roboto', sans-serif"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              CSS font-family stack for the application.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Type className="mr-2 h-5 w-5" /> Customization
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customCss">Custom CSS</Label>
            <Textarea
              id="customCss"
              value={settings.customCss || ''}
              onChange={(e) => handleChange('customCss', e.target.value)}
              placeholder="/* Add your custom CSS here */"
              rows={8}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Apply custom CSS rules to further style your application.
            </p>
          </div>

          <div>
            <Label htmlFor="loginPageBackground">Login Page Background URL</Label>
            <Input
              id="loginPageBackground"
              value={settings.loginPageBackground || ''}
              onChange={(e) => handleChange('loginPageBackground', e.target.value)}
              placeholder="e.g., https://yourdomain.com/login-bg.jpg"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL for a custom background image on the login page.
            </p>
          </div>

          <div>
            <Label htmlFor="emailTemplateHeader">Email Template Header (HTML)</Label>
            <Textarea
              id="emailTemplateHeader"
              value={settings.emailTemplateHeader || ''}
              onChange={(e) => handleChange('emailTemplateHeader', e.target.value)}
              placeholder="<!-- Your custom email header HTML -->"
              rows={5}
            />
            <p className="text-sm text-muted-foreground mt-1">
              HTML content to be included at the top of all system emails.
            </p>
          </div>

          <div>
            <Label htmlFor="emailTemplateFooter">Email Template Footer (HTML)</Label>
            <Textarea
              id="emailTemplateFooter"
              value={settings.emailTemplateFooter || ''}
              onChange={(e) => handleChange('emailTemplateFooter', e.target.value)}
              placeholder="<!-- Your custom email footer HTML -->"
              rows={5}
            />
            <p className="text-sm text-muted-foreground mt-1">
              HTML content to be included at the bottom of all system emails.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}