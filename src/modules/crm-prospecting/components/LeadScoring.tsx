import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, User, Activity, Heart } from 'lucide-react'
import { LeadScore } from '../types'
import { cn } from '@/lib/utils'

interface LeadScoringProps {
  score: LeadScore
  className?: string
}

export function LeadScoring({ score, className }: LeadScoringProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 text-green-700 border-green-200'
    if (score >= 60) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (score >= 40) return 'bg-orange-50 text-orange-700 border-orange-200'
    return 'bg-red-50 text-red-700 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot Lead'
    if (score >= 60) return 'Warm Lead'
    if (score >= 40) return 'Cool Lead'
    return 'Cold Lead'
  }

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Lead Score</CardTitle>
            <CardDescription>
              Last calculated: {score.lastCalculated.toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", getScoreColor(score.totalScore))}>
              {score.totalScore}
            </div>
            <Badge className={cn("ri-badge-status", getScoreBadgeColor(score.totalScore))}>
              {getScoreLabel(score.totalScore)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Demographics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={(score.demographicScore / 50) * 100} className="w-20" />
              <span className="text-sm font-bold w-8">{score.demographicScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Behavior</span>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={(score.behaviorScore / 50) * 100} className="w-20" />
              <span className="text-sm font-bold w-8">{score.behaviorScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={(score.engagementScore / 50) * 100} className="w-20" />
              <span className="text-sm font-bold w-8">{score.engagementScore}</span>
            </div>
          </div>
        </div>

        {/* Score Factors */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Score Factors
          </h4>
          <div className="space-y-2">
            {score.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div>
                  <span className="text-sm font-medium">{factor.factor}</span>
                  <p className="text-xs text-muted-foreground">{factor.reason}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +{factor.points}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">Recommendations</h4>
          <div className="space-y-1 text-xs text-blue-700">
            {score.totalScore >= 80 && (
              <p>• High priority lead - schedule immediate follow-up</p>
            )}
            {score.totalScore >= 60 && score.totalScore < 80 && (
              <p>• Good potential - maintain regular contact</p>
            )}
            {score.totalScore >= 40 && score.totalScore < 60 && (
              <p>• Nurture with educational content</p>
            )}
            {score.totalScore < 40 && (
              <p>• Low priority - add to drip campaign</p>
            )}
            {score.behaviorScore < 20 && (
              <p>• Increase engagement with personalized outreach</p>
            )}
            {score.engagementScore < 20 && (
              <p>• Try different communication channels</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}