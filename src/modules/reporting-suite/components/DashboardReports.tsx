import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'
import { cn } from '@/lib/utils'

// Define types for metrics data
interface MetricData {
  metric: string
  value: string
  change: string
  changePercent: string
  category: string
  trend: 'up' | 'down' | 'neutral'
}

// Define types for chart data
interface ChartData {
  name: string
  value: number
}

export function DashboardReports() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState('30d')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for metrics
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      metric: 'Total Leads',
      value: '2,651',
      change: '+4.75%',
      changePercent: '4.75%',
      category: 'leads',
      trend: 'up'
    },
    {
      metric: 'Qualified Leads',
      value: '892',
      change: '+12.3%',
      changePercent: '12.3%',
      category: 'leads',
      trend: 'up'
    },
    {
      metric: 'Conversion Rate',
      value: '24.5%',
      change: '-1.2%',
      changePercent: '1.2%',
      category: 'leads',
      trend: 'down'
    },
    {
      metric: 'Avg Response Time',
      value: '3.2 hrs',
      change: '-0.8 hrs',
      changePercent: '20%',
      category: 'leads',
      trend: 'up'
    },
    {
      metric: 'Total Revenue',
      value: '$1,245,890',
      change: '+8.3%',
      changePercent: '8.3%',
      category: 'sales',
      trend: 'up'
    },
    {
      metric: 'Units Sold',
      value: '87',
      change: '+12.4%',
      changePercent: '12.4%',
      category: 'sales',
      trend: 'up'
    },
    {
      metric: 'Avg Deal Size',
      value: '$14,320',
      change: '-2.1%',
      changePercent: '2.1%',
      category: 'sales',
      trend: 'down'
    },
    {
      metric: 'Gross Profit Margin',
      value: '22.4%',
      change: '+1.5%',
      changePercent: '1.5%',
      category: 'sales',
      trend: 'up'
    }
  ])

  // Mock data for charts
  const [leadsBySource, setLeadsBySource] = useState<ChartData[]>([
    { name: 'Website', value: 1245 },
    { name: 'Referral', value: 654 },
    { name: 'Social Media', value: 432 },
    { name: 'Trade Show', value: 320 }
  ])

  const [salesByProduct, setSalesByProduct] = useState<ChartData[]>([
    { name: 'Motorhomes', value: 520000 },
    { name: 'Travel Trailers', value: 380000 },
    { name: 'Fifth Wheels', value: 245000 },
    { name: 'Toy Haulers', value: 100000 }
  ])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'Dashboard Refreshed',
        description: 'Latest data has been loaded.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh dashboard data.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Your dashboard report is being prepared for download.',
    })
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Your dashboard report has been downloaded.',
      })
    }, 2000)
  }

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    
    // Simulate data change based on timeframe
    setLoading(true)
    setTimeout(() => {
      // This would be replaced with actual API calls in a real implementation
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Dashboard Report
              </CardTitle>
              <CardDescription>
                Key performance indicators and business metrics
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={timeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads & Marketing</TabsTrigger>
              <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                {metrics.filter(m => m.category === 'leads' || m.category === 'sales').slice(0, 4).map((metric, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className={cn(
                          "text-xs",
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {metric.change} from last period
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Leads by Source</CardTitle>
                    <CardDescription>Distribution of leads across different sources</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadsBySource}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tickFormatter={(value) => value.toLocaleString()} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Sales by Product Category</CardTitle>
                    <CardDescription>Revenue generated by different product categories</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesByProduct}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                {metrics.filter(m => m.category === 'leads').map((metric, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className={cn(
                          "text-xs",
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {metric.change} from last period
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Lead Conversion Funnel</CardTitle>
                  <CardDescription>Visual representation of lead progression</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for a funnel chart */}
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Funnel Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                {metrics.filter(m => m.category === 'sales').map((metric, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className={cn(
                          "text-xs",
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {metric.change} from last period
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the selected timeframe</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for a line chart showing revenue over time */}
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Revenue Trend Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
