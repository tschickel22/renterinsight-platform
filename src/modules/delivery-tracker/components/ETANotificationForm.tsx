import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Send, MessageSquare, Mail, Clock } from 'lucide-react'
import { Delivery } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface ETANotificationFormProps {
  delivery: Delivery
  onSend: (deliveryId: string, data: any) => Promise<void>
  onCancel: () => void
}

export function ETANotificationForm({ delivery, onSend, onCancel }: ETANotificationFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [notificationType, setNotificationType] = useState<'sms' | 'email'>('sms')
  const [estimatedArrival, setEstimatedArrival] = useState(delivery.customFields?.estimatedArrival || '')
  const [message, setMessage] = useState('')

  // Generate default messages based on notification type and delivery status
  const getDefaultMessage = () => {
    const customerName = 'Customer' // In a real app, you would get this from the customer record
    const vehicleInfo = 'your vehicle' // In a real app, you would get this from the vehicle record
    const formattedDate = new Date(delivery.scheduledDate).toLocaleDateString()
    const formattedTime = estimatedArrival || 'the scheduled time'

    if (notificationType === 'sms') {
      return `Hi ${customerName}, your delivery of ${vehicleInfo} is scheduled for ${formattedDate} at ${formattedTime}. Reply HELP for assistance or STOP to opt out.`
    } else {
      return `Dear ${customerName},\n\nWe're writing to confirm the delivery of ${vehicleInfo} scheduled for ${formattedDate} at ${formattedTime}.\n\nIf you have any questions or need to reschedule, please contact our delivery team.\n\nThank you,\nThe Delivery Team`
    }
  }

  // Update default message when notification type changes
  React.useEffect(() => {
    setMessage(getDefaultMessage())
  }, [notificationType, estimatedArrival])

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

    setLoading(true)
    try {
      await onSend(delivery.id, {
        type: notificationType,
        estimatedArrival,
        message
      })
      
      toast({
        title: 'Notification Sent',
        description: `${notificationType === 'sms' ? 'SMS' : 'Email'} notification sent successfully`,
      })
      
      onCancel()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send ${notificationType === 'sms' ? 'SMS' : 'email'} notification`,
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
                <SelectContent>
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
            
            <div>
              <Label htmlFor="estimatedArrival">Estimated Arrival Time</Label>
              <Input
                id="estimatedArrival"
                type="time"
                value={estimatedArrival}
                onChange={(e) => setEstimatedArrival(e.target.value)}
              />
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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