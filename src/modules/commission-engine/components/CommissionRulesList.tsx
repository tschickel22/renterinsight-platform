import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Plus, Search, Filter, Edit, Trash2, Percent, Calculator } from 'lucide-react'
import { CommissionRule, FlatCommissionRule, PercentageCommissionRule, TieredCommissionRule } from '../types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CommissionRulesListProps {
  rules: CommissionRule[]
  onCreateRule: () => void
  onEditRule: (rule: CommissionRule) => void
  onDeleteRule: (ruleId: string) => void
}

export function CommissionRulesList({
  rules,
  onCreateRule,
  onEditRule,
  onDeleteRule
}: CommissionRulesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flat':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'percentage':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'tiered':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || rule.type === typeFilter
    return matchesSearch && matchesType
  })

  const formatRuleDetails = (rule: CommissionRule) => {
    switch (rule.type) {
      case 'flat':
        return `${formatCurrency((rule as FlatCommissionRule).amount)} flat rate`
      
      case 'percentage':
        return `${((rule as PercentageCommissionRule).rate * 100).toFixed(2)}% of deal value`
      
      case 'tiered':
        const tiers = (rule as TieredCommissionRule).tiers
        if (tiers.length === 0) return 'No tiers defined'
        
        return `${tiers.length} tiers, ${(tiers[0].rate * 100).toFixed(2)}% to ${(tiers[tiers.length - 1].rate * 100).toFixed(2)}%`
      
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="all">All Types</option>
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
            <option value="tiered">Tiered</option>
          </select>
          <Button onClick={onCreateRule} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Rules List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Commission Rules ({filteredRules.length})</CardTitle>
          <CardDescription>
            Define how commissions are calculated for different scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{rule.name}</h3>
                      <Badge className={cn("ri-badge-status", getTypeColor(rule.type))}>
                        {rule.type.toUpperCase()}
                      </Badge>
                      {rule.isActive ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          ACTIVE
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                          INACTIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {rule.type === 'flat' ? (
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-blue-500" />
                          {formatRuleDetails(rule)}
                        </span>
                      ) : rule.type === 'percentage' ? (
                        <span className="flex items-center">
                          <Percent className="h-3 w-3 mr-1 text-green-500" />
                          {formatRuleDetails(rule)}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Calculator className="h-3 w-3 mr-1 text-purple-500" />
                          {formatRuleDetails(rule)}
                        </span>
                      )}
                    </div>
                    
                    {rule.type === 'tiered' && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {(rule as TieredCommissionRule).tiers.map((tier, index) => (
                          <div key={tier.id} className="text-xs p-1 bg-muted/30 rounded">
                            {formatCurrency(tier.minAmount)}
                            {tier.maxAmount ? ` - ${formatCurrency(tier.maxAmount)}` : '+'}: 
                            <span className="font-semibold ml-1">{(tier.rate * 100).toFixed(2)}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => onEditRule(rule)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm text-red-600 hover:text-red-700"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredRules.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No commission rules found</p>
                <p className="text-sm">Create your first rule to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}