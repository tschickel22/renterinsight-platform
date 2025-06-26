import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Send, Mail, MessageSquare, Clock, AlertCircle } from 'lucide-react'
import { Delivery } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'

interface ETANotifierProps {
  delivery: Delivery
  onSend: (type: 'email' | 'sms', message: string) => Promise<void>
}

export function ETANotifier({ delivery, onSend }: ETANotifierProps) {
  const { toast } = useToast()
  const [notificationType, setNotificationType] = useState<'email' | 'sms'>('email')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [includeETA, setIncludeETA] = useState(true)
  const [includeAddress, setIncludeAddress] = useState(true)
  const [includeTracking, setIncludeTracking] = useState(true)

  // Generate default message based on delivery status and selected options
  const generateDefaultMessage = () => {
    let defaultMessage = `Hello,\n\nYour delivery`
    
    if (includeETA) {
      defaultMessage += ` is scheduled for ${formatDate(delivery.scheduledDate)}`
    }
    
    if (includeAddress) {
      defaultMessage += `\n\nDelivery Address:\n${delivery.address.street}\n${delivery.address.city}, ${delivery.address.state} ${delivery.address.zipCode}`
    }
    
    if (includeTracking) {
      defaultMessage += `\n\nYou can track your delivery status in our customer portal.`
    }
    
    defaultMessage += `\n\nThank you for choosing our services.\n\nBest regards,\nDelivery Team`
    
    return defaultMessage
  }

  // Update message when options change
  React.useEffect(() => {
    setMessage(generateDefaultMessage())
  }, [includeETA, includeAddress, includeTracking, delivery])

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive'
      })
      return
    }

    setSending(true)
    try {
      await onSend(notificationType, message)
      toast({
        title: 'Success',
        description: `${notificationType === 'email' ? 'Email' : 'SMS'} notification sent successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send ${notificationType === 'email' ? 'email' : 'SMS'}`,
        variant: 'destructive'
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Send className="h-5 w-5 mr-2 text-primary" />
          Send ETA Notification
        </CardTitle>
        <CardDescription>
          Notify the customer about their delivery status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Notification Type</Label>
          <Select value={notificationType} onValueChange={(value: 'email' | 'sms') => setNotificationType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Email</span>
                </div>
              </SelectItem>
              <SelectItem value="sms">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>SMS</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeETA" 
              checked={includeETA} 
              onCheckedChange={(checked) => setIncludeETA(!!checked)}
            />
            <Label htmlFor="includeETA">Include ETA</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeAddress" 
              checked={includeAddress} 
              onCheckedChange={(checked) => setIncludeAddress(!!checked)}
            />
            <Label htmlFor="includeAddress">Include Delivery Address</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeTracking" 
              checked={includeTracking} 
              onCheckedChange={(checked) => setIncludeTracking(!!checked)}
            />
            <Label htmlFor="includeTracking">Include Tracking Information</Label>
          </div>
        </div>

        <div>
          <Label>Message</Label>
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {notificationType === 'sms' && `${message.length} characters (SMS limit: 160 characters per message)`}
          </p>
        </div>

        {notificationType === 'email' && (
          <div>
            <Label>Recipient Email</Label>
            <Input value="customer@example.com" disabled />
            <p className="text-xs text-muted-foreground mt-1">
              Email will be sent to the customer's email address on file
            </p>
          </div>
        )}

        {notificationType === 'sms' && (
          <div>
            <Label>Recipient Phone</Label>
            <Input value="(555) 123-4567" disabled />
            <p className="text-xs text-muted-foreground mt-1">
              SMS will be sent to the customer's phone number on file
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSend} disabled={sending}>
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send {notificationType === 'email' ? 'Email' : 'SMS'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}