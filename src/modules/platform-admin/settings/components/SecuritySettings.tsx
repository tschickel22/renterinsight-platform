import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Shield, Plus, Trash2 } from 'lucide-react'

interface SecuritySettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function SecuritySettings({ settings, onChange }: SecuritySettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const handleMfaProviderChange = (provider: string, checked: boolean) => {
    const currentProviders = [...(settings.mfaProviders || [])]
    if (checked && !currentProviders.includes(provider)) {
      currentProviders.push(provider)
    } else if (!checked && currentProviders.includes(provider)) {
      const index = currentProviders.indexOf(provider)
      currentProviders.splice(index, 1)
    }
    onChange({ mfaProviders: currentProviders })
  }

  const handleIpWhitelistChange = (index: number, value: string) => {
    const newIpWhitelist = [...(settings.ipWhitelist || [])]
    newIpWhitelist[index] = value
    onChange({ ipWhitelist: newIpWhitelist })
  }

  const addIpWhitelistEntry = () => {
    onChange({ ipWhitelist: [...(settings.ipWhitelist || []), ''] })
  }

  const removeIpWhitelistEntry = (index: number) => {
    const newIpWhitelist = [...(settings.ipWhitelist || [])]
    newIpWhitelist.splice(index, 1)
    onChange({ ipWhitelist: newIpWhitelist })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Authentication & Access</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mfaEnabled"
              checked={settings.mfaEnabled || false}
              onCheckedChange={(checked) => handleChange('mfaEnabled', !!checked)}
            />
            <Label htmlFor="mfaEnabled">Enable Multi-Factor Authentication (MFA)</Label>
          </div>

          {settings.mfaEnabled && (
            <div>
              <Label className="mb-2 block">MFA Providers</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mfaEmail"
                    checked={(settings.mfaProviders || []).includes('email')}
                    onCheckedChange={(checked) => handleMfaProviderChange('email', !!checked)}
                  />
                  <Label htmlFor="mfaEmail">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mfaSms"
                    checked={(settings.mfaProviders || []).includes('sms')}
                    onCheckedChange={(checked) => handleMfaProviderChange('sms', !!checked)}
                  />
                  <Label htmlFor="mfaSms">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mfaAuthenticator"
                    checked={(settings.mfaProviders || []).includes('authenticator')}
                    onCheckedChange={(checked) => handleMfaProviderChange('authenticator', !!checked)}
                  />
                  <Label htmlFor="mfaAuthenticator">Authenticator App</Label>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="passwordResetPolicy">Password Reset Policy</Label>
            <Select
              value={settings.passwordResetPolicy || 'email'}
              onValueChange={(value) => handleChange('passwordResetPolicy', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireStrongPasswords"
              checked={settings.requireStrongPasswords || false}
              onCheckedChange={(checked) => handleChange('requireStrongPasswords', !!checked)}
            />
            <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
          </div>

          <div>
            <Label htmlFor="passwordExpiryDays">Password Expiry (Days, 0 for never)</Label>
            <Input
              id="passwordExpiryDays"
              type="number"
              min="0"
              value={settings.passwordExpiryDays || 0}
              onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))}
              className="max-w-md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ipWhitelistEnabled"
              checked={settings.ipWhitelistEnabled || false}
              onCheckedChange={(checked) => handleChange('ipWhitelistEnabled', !!checked)}
            />
            <Label htmlFor="ipWhitelistEnabled">Enable IP Whitelist</Label>
          </div>

          {settings.ipWhitelistEnabled && (
            <div className="space-y-2">
              <Label>Allowed IP Addresses</Label>
              {(settings.ipWhitelist || []).map((ip: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={ip}
                    onChange={(e) => handleIpWhitelistChange(index, e.target.value)}
                    placeholder="e.g., 192.168.1.1"
                    className="max-w-md"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeIpWhitelistEntry(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addIpWhitelistEntry}>
                <Plus className="h-4 w-4 mr-2" /> Add IP Address
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Threat Protection</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bruteForceProtection"
              checked={settings.bruteForceProtection || false}
              onCheckedChange={(checked) => handleChange('bruteForceProtection', !!checked)}
            />
            <Label htmlFor="bruteForceProtection">Enable Brute Force Protection</Label>
          </div>

          <div>
            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              min="1"
              value={settings.maxLoginAttempts || 5}
              onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
              className="max-w-md"
            />
          </div>

          <div>
            <Label htmlFor="lockoutDuration">Lockout Duration (Minutes)</Label>
            <Input
              id="lockoutDuration"
              type="number"
              min="1"
              value={settings.lockoutDuration || 30}
              onChange={(e) => handleChange('lockoutDuration', parseInt(e.target.value))}
              className="max-w-md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sessionHijackingProtection"
              checked={settings.sessionHijackingProtection || false}
              onCheckedChange={(checked) => handleChange('sessionHijackingProtection', !!checked)}
            />
            <Label htmlFor="sessionHijackingProtection">Enable Session Hijacking Protection</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="xssProtection"
              checked={settings.xssProtection || false}
              onCheckedChange={(checked) => handleChange('xssProtection', !!checked)}
            />
            <Label htmlFor="xssProtection">Enable XSS Protection</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="csrfProtection"
              checked={settings.csrfProtection || false}
              onCheckedChange={(checked) => handleChange('csrfProtection', !!checked)}
            />
            <Label htmlFor="csrfProtection">Enable CSRF Protection</Label>
          </div>

          <div>
            <Label htmlFor="contentSecurityPolicy">Content Security Policy (CSP)</Label>
            <Input
              id="contentSecurityPolicy"
              value={settings.contentSecurityPolicy || "default-src 'self'"}
              onChange={(e) => handleChange('contentSecurityPolicy', e.target.value)}
              placeholder="e.g., default-src 'self'"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Define your Content Security Policy. Be careful, incorrect policies can break your site.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rateLimitingEnabled"
              checked={settings.rateLimitingEnabled || false}
              onCheckedChange={(checked) => handleChange('rateLimitingEnabled', !!checked)}
            />
            <Label htmlFor="rateLimitingEnabled">Enable API Rate Limiting</Label>
          </div>

          {settings.rateLimitingEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <div>
                <Label htmlFor="rateLimitRequests">Requests per Window</Label>
                <Input
                  id="rateLimitRequests"
                  type="number"
                  min="1"
                  value={settings.rateLimitRequests || 100}
                  onChange={(e) => handleChange('rateLimitRequests', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="rateLimitWindow">Window Duration (Seconds)</Label>
                <Input
                  id="rateLimitWindow"
                  type="number"
                  min="1"
                  value={settings.rateLimitWindow || 60}
                  onChange={(e) => handleChange('rateLimitWindow', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Data Security & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dataEncryptionEnabled"
              checked={settings.dataEncryptionEnabled || false}
              onCheckedChange={(checked) => handleChange('dataEncryptionEnabled', !!checked)}
            />
            <Label htmlFor="dataEncryptionEnabled">Enable Data Encryption at Rest</Label>
          </div>

          {settings.dataEncryptionEnabled && (
            <div>
              <Label htmlFor="encryptionAlgorithm">Encryption Algorithm</Label>
              <Select
                value={settings.encryptionAlgorithm || 'AES-256'}
                onValueChange={(value) => handleChange('encryptionAlgorithm', value)}
              >
                <SelectTrigger className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AES-256">AES-256</SelectItem>
                  <SelectItem value="AES-128">AES-128</SelectItem>
                  <SelectItem value="RSA">RSA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="dataRetentionDays">Data Retention (Days, 0 for indefinite)</Label>
            <Input
              id="dataRetentionDays"
              type="number"
              min="0"
              value={settings.dataRetentionDays || 365}
              onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
              className="max-w-md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="gdprCompliance"
              checked={settings.gdprCompliance || false}
              onCheckedChange={(checked) => handleChange('gdprCompliance', !!checked)}
            />
            <Label htmlFor="gdprCompliance">GDPR Compliance</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ccpaCompliance"
              checked={settings.ccpaCompliance || false}
              onCheckedChange={(checked) => handleChange('ccpaCompliance', !!checked)}
            />
            <Label htmlFor="ccpaCompliance">CCPA Compliance</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dataMaskingEnabled"
              checked={settings.dataMaskingEnabled || false}
              onCheckedChange={(checked) => handleChange('dataMaskingEnabled', !!checked)}
            />
            <Label htmlFor="dataMaskingEnabled">Enable Data Masking for Sensitive Fields</Label>
          </div>

          <div>
            <Label htmlFor="logRetentionDays">Log Retention (Days)</Label>
            <Input
              id="logRetentionDays"
              type="number"
              min="1"
              value={settings.logRetentionDays || 90}
              onChange={(e) => handleChange('logRetentionDays', parseInt(e.target.value))}
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Security Headers</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="xFrameOptions">X-Frame-Options</Label>
            <Select
              value={settings.securityHeaders?.xFrameOptions || 'DENY'}
              onValueChange={(value) => handleChange('securityHeaders', { ...settings.securityHeaders, xFrameOptions: value })}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DENY">DENY</SelectItem>
                <SelectItem value="SAMEORIGIN">SAMEORIGIN</SelectItem>
                <SelectItem value="ALLOW-FROM">ALLOW-FROM (specify URI)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Prevents clickjacking attacks by controlling whether your site can be embedded in iframes.
            </p>
          </div>

          <div>
            <Label htmlFor="xContentTypeOptions">X-Content-Type-Options</Label>
            <Select
              value={settings.securityHeaders?.xContentTypeOptions || 'nosniff'}
              onValueChange={(value) => handleChange('securityHeaders', { ...settings.securityHeaders, xContentTypeOptions: value })}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nosniff">nosniff</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Prevents browsers from MIME-sniffing a response away from the declared content-type.
            </p>
          </div>

          <div>
            <Label htmlFor="xXSSProtection">X-XSS-Protection</Label>
            <Select
              value={settings.securityHeaders?.xXSSProtection || '1; mode=block'}
              onValueChange={(value) => handleChange('securityHeaders', { ...settings.securityHeaders, xXSSProtection: value })}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 (Disable)</SelectItem>
                <SelectItem value="1">1 (Enable)</SelectItem>
                <SelectItem value="1; mode=block">1; mode=block (Enable with blocking)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Enables the XSS filter in browsers.
            </p>
          </div>

          <div>
            <Label htmlFor="strictTransportSecurity">Strict-Transport-Security (HSTS)</Label>
            <Input
              id="strictTransportSecurity"
              value={settings.securityHeaders?.strictTransportSecurity || 'max-age=31536000; includeSubDomains'}
              onChange={(e) => handleChange('securityHeaders', { ...settings.securityHeaders, strictTransportSecurity: e.target.value })}
              placeholder="e.g., max-age=31536000; includeSubDomains"
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Forces browsers to use HTTPS for your domain.
            </p>
          </div>

          <div>
            <Label htmlFor="referrerPolicy">Referrer-Policy</Label>
            <Select
              value={settings.securityHeaders?.referrerPolicy || 'no-referrer-when-downgrade'}
              onValueChange={(value) => handleChange('securityHeaders', { ...settings.securityHeaders, referrerPolicy: value })}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-referrer">no-referrer</SelectItem>
                <SelectItem value="no-referrer-when-downgrade">no-referrer-when-downgrade</SelectItem>
                <SelectItem value="origin">origin</SelectItem>
                <SelectItem value="origin-when-cross-origin">origin-when-cross-origin</SelectItem>
                <SelectItem value="same-origin">same-origin</SelectItem>
                <SelectItem value="strict-origin">strict-origin</SelectItem>
                <SelectItem value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</SelectItem>
                <SelectItem value="unsafe-url">unsafe-url</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Controls how much referrer information is included with requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}