import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Send, MessageSquare, Mail } from 'lucide-react'
import { Delivery } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface ETANotificationFormProps {
  delivery: Delivery & {
    customer?: {
      name?: string
      email?: string
      phone?: string
    },
    vehicle?: {
      year?: number
      make?: string
      model?: string
      vin?: string
    }
  }
  onSend: (deliveryId: string, data: any) => Promise<void>
  onCancel: () => void
}

export function ETANotificationForm({ delivery, onSend, onCancel }: ETANotificationFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [notificationType, setNotificationType] = useState<'sms' | 'email'>('sms')
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState<string>('')
  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const customerName = delivery.customer?.name || 'Customer'
  const homeInfo = delivery.vehicle ? `${delivery.vehicle.year || ''} ${delivery.vehicle.make || ''} ${delivery.vehicle.model || ''}`.trim() : 'your Home/RV'
  const phoneAvailable = !!delivery.customer?.phone
  const emailAvailable = !!delivery.customer?.email

  const getDefaultMessage = () => {
    try {
      const formattedDate = estimatedArrivalDate || new Date(delivery.scheduledDate).toLocaleDateString()
      const formattedTime = estimatedArrivalTime || 'the scheduled time'

      if (notificationType === 'sms') {
        return `Hi ${customerName}, your delivery of ${homeInfo} is scheduled for ${formattedDate} at ${formattedTime}. Reply HELP for assistance or STOP to opt out.`
      } else {
        return `Dear ${customerName},\n\nWe're writing to confirm the delivery of ${homeInfo} scheduled for ${formattedDate} at ${formattedTime}.\n\nIf you have any questions or need to reschedule, please contact our delivery team.\n\nThank you,\nThe Delivery Team`
      }
    } catch (err) {
      console.error('Failed to generate default message:', err)
      return ''
    }
  }

  useEffect(() => {
    try {
      const defaultMsg = getDefaultMessage()
      setMessage(defaultMsg)
    } catch (err) {
      console.error('Message generation error:', err)
    }
  }, [notificationType, estimatedArrivalTime, estimatedArrivalDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a message',
        variant: 'destructive'
      })
      return
    }

    if (!estimatedArrivalDate || !estimatedArrivalTime) {
      toast({
        title: 'Missing ETA',
        description: 'Please select both a date and time for estimated arrival.',
        variant: 'destructive'
      })
      return
    }

    if (notificationType === 'sms' && !phoneAvailable) {
      toast({
        title: 'Missing Phone Number',
        description: 'Customer does not have a valid phone number for SMS.',
        variant: 'destructive'
      })
      return
    }

    if (notificationType === 'email' && !emailAvailable) {
      toast({
        title: 'Missing Email Address',
        description: 'Customer does not have a valid email address.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSend(delivery.id, {
        type: notificationType,
        estimatedArrival: `${estimatedArrivalDate}T${estimatedArrivalTime}`,
        message,
        updateDelivery: true
      })
      toast({
        title: 'Notification Sent',
        description: `${notificationType.toUpperCase()} sent successfully.`
      })
      onCancel()
    } catch (err) {
      console.error('Notification send failed:', err)
      toast({
        title: 'Error',
        description: `Failed to send ${notificationType === 'sms' ? 'SMS' : 'Email'} notification`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Send ETA Notification</CardTitle>
              <CardDescription>
                Notify the customer about delivery status
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-4 text-muted-foreground">
            Delivering to: <strong>{customerName}</strong><br />
            Home/RV: <strong>{homeInfo}</strong><br />
            {notificationType === 'sms' && !phoneAvailable && <span className="text-red-500 text-xs">⚠ No valid phone number on file</span>}
            {notificationType === 'email' && !emailAvailable && <span className="text-red-500 text-xs">⚠ No valid email address on file</span>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="notificationType">Notification Type</Label>
              <Select
                value={notificationType}
                onValueChange={(value: 'sms' | 'email') => setNotificationType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="sms">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>SMS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="arrivalDate">Arrival Date</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={estimatedArrivalDate}
                  onChange={(e) => setEstimatedArrivalDate(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={estimatedArrivalTime}
                  onChange={(e) => setEstimatedArrivalTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={notificationType === 'sms' ? 3 : 6}
                maxLength={notificationType === 'sms' ? 160 : undefined}
              />
              {notificationType === 'sms' && (
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{message.length} characters</span>
                  <span>{160 - message.length} remaining</span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
