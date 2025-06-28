import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Truck, Wrench, MessageSquare, User, Calendar, Clock } from 'lucide-react'
import { useImpersonationClient } from '../hooks/useImpersonationClient'

export function Dashboard() {
  const { client, loading } = useImpersonationClient()

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {client?.name || 'Guest'}</h1>
        <p className="text-muted-foreground">
          Access your account information and manage your services
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Quotes</h3>
              <p className="text-sm text-blue-700">View and accept quotes</p>
              <Button variant="outline" className="mt-2 bg-white/80 hover:bg-white">
                View Quotes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold text-green-900">Deliveries</h3>
              <p className="text-sm text-green-700">Track your deliveries</p>
              <Button variant="outline" className="mt-2 bg-white/80 hover:bg-white">
                Track Delivery
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Wrench className="h-8 w-8 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Service</h3>
              <p className="text-sm text-orange-700">Request service or repairs</p>
              <Button variant="outline" className="mt-2 bg-white/80 hover:bg-white">
                Request Service
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Feedback</h3>
              <p className="text-sm text-purple-700">Share your experience</p>
              <Button variant="outline" className="mt-2 bg-white/80 hover:bg-white">
                Give Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Quote #Q-2024-001 sent
                </p>
                <p className="text-sm text-muted-foreground">
                  A new quote for your RV purchase has been sent
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  2 days ago
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Service appointment confirmed
                </p>
                <p className="text-sm text-muted-foreground">
                  Your service appointment has been scheduled
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  April 15, 2024 at 10:00 AM
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Account created
                </p>
                <p className="text-sm text-muted-foreground">
                  Welcome to your client portal account
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  1 week ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}