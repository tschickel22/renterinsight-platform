// src/modules/reporting-suite/components/DashboardReports.tsx
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

  // Sample data for Lead Conversion Funnel
  const [leadFunnelData, setLeadFunnelData] = useState([
    { name: 'New Leads', value: 1000 },
    { name: 'Contacted', value: 700 },
    { name: 'Qualified', value: 400 },
    { name: 'Proposal', value: 200 },
    { name: 'Closed Won', value: 100 },
  ]);

  // Sample data for Revenue Trend
  const [revenueTrendData, setRevenueTrendData] = useState([
    { month: 'Jan', revenue: 300000 },
    { month: 'Feb', revenue: 320000 },
    { month: 'Mar', revenue: 350000 },
    { month: 'Apr', revenue: 330000 },
    { month: 'May', revenue: 380000 },
    { month: 'Jun', revenue: 400000 },
  ]);

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulate fetching new data
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStats(mockUsageStats); // In a real app, this would be updated data
      toast({
        title: 'Usage Stats Refreshed',
        description: 'Latest usage data has been loaded.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh usage stats.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Simulate exporting data
    toast({
      title: 'Export Initiated',
      description: 'Usage data is being prepared for download.',
    });
  };

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
                Platform Usage Statistics
              </CardTitle>
              <CardDescription>
                Monitor key performance indicators and usage trends
              </CardDescription>
            </div>
            <div className="flex space-x-2">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApiCalls.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently logged in</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.storageUsedGB} GB</div>
                <p className="text-xs text-muted-foreground">Total across all tenants</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emailsSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Daily API Calls</CardTitle>
                <CardDescription>API call volume over time</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.dailyApiCalls}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="calls" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Module Usage</CardTitle>
                <CardDescription>API calls by module</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.moduleUsage} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Historical data and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Label htmlFor="timeframe">Timeframe:</Label>
                <Select value={timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.dailyApiCalls} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="calls" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Card>
        </CardContent>
      </Card>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadFunnelData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}
