import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DealMetrics as DealMetricsType, StageConversionRate } from '../types'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Target, Clock, BarChart3 } from 'lucide-react'

interface DealMetricsProps {
  metrics: DealMetricsType
}

export function DealMetrics({ metrics }: DealMetricsProps) {
  const getConversionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              {metrics.totalDeals} active deals
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Won Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(metrics.wonValue)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Target className="h-3 w-3 mr-1" />
              {metrics.wonDeals} deals closed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{metrics.winRate.toFixed(1)}%</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Industry average: 27%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{formatCurrency(metrics.averageDealSize)}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {metrics.averageSalesCycle.toFixed(0)} day cycle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Stage Conversion Rates</CardTitle>
          <CardDescription>
            Conversion rates and average time spent in each stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.conversionRates.map((conversion, index) => (
              <div key={`${conversion.fromStage}-${conversion.toStage}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium capitalize">
                      {conversion.fromStage.replace('_', ' ')} → {conversion.toStage.replace('_', ' ')}
                    </span>
                    <span className={`text-sm font-bold ${getConversionColor(conversion.rate)}`}>
                      {conversion.rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{conversion.averageDuration}h avg</span>
                  </div>
                </div>
                <Progress value={conversion.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pipeline Health</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Win Rate</span>
                </div>
                <span className="text-lg font-bold text-green-600">{metrics.winRate.toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Average Deal Size</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(metrics.averageDealSize)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Sales Cycle</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{metrics.averageSalesCycle.toFixed(0)} days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Deal Breakdown</CardTitle>
            <CardDescription>
              Current pipeline composition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Deals</span>
                <span className="font-bold">{metrics.totalDeals}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Won Deals</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-green-600">{metrics.wonDeals}</span>
                  <span className="text-xs text-green-600">({formatCurrency(metrics.wonValue)})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lost Deals</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-red-600">{metrics.lostDeals}</span>
                  <span className="text-xs text-red-600">({formatCurrency(metrics.lostValue)})</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Pipeline</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(metrics.totalValue - metrics.wonValue - metrics.lostValue)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}