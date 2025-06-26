import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Plus, Search, Filter, Edit, Trash2, Copy, Percent, Layers } from 'lucide-react'
import { CommissionRule, CommissionRuleType } from './CommissionRuleForm'
import { cn } from '@/lib/utils'

interface CommissionRulesListProps {
  rules: CommissionRule[]
  onCreateRule: () => void
  onEditRule: (rule: CommissionRule) => void
  onDeleteRule: (ruleId: string) => void
  onDuplicateRule: (rule: CommissionRule) => void
}

export function CommissionRulesList({
  rules,
  onCreateRule,
  onEditRule,
  onDeleteRule,
  onDuplicateRule
}: CommissionRulesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const getTypeIcon = (type: CommissionRuleType) => {
    switch (type) {
      case 'flat':
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case 'percentage':
        return <Percent className="h-4 w-4 text-green-500" />
      case 'tiered':
        return <Layers className="h-4 w-4 text-purple-500" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: CommissionRuleType) => {
    if (!type) return 'bg-gray-50 text-gray-700 border-gray-200'
    
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

  const filteredRules = Array.isArray(rules) ? rules.filter(rule => {
    if (!rule) return false;
    
    const matchesSearch = 
      (rule.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((rule.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === 'all' || rule.type === typeFilter

    return matchesSearch && matchesType
  }) : []

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search commission rules..."
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
            <option value="flat">Flat Amount</option>
            <option value="percentage">Percentage</option>
            <option value="tiered">Tiered</option>
          </select>
          <Button variant="outline" className="shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
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
            Manage commission calculation rules for sales and service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRules.length > 0 ? filteredRules.map((rule) => (
              <div key={rule.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{rule.name || 'Unnamed Rule'}</h3>
                      <Badge className={cn("ri-badge-status", getTypeColor(rule.type))}>
                        {(rule.type || 'unknown').toUpperCase()}
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
                    <p className="text-sm text-muted-foreground mb-2">
                      {rule.description || 'No description provided'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        {getTypeIcon(rule.type || 'flat')}
                        <span className="ml-1">
                          {rule.type === 'flat' && `$${(rule.flatAmount ?? 0).toLocaleString()}`}
                          {rule.type === 'percentage' && `${rule.percentageRate ?? 0}%`}
                          {rule.type === 'tiered' && `${(rule.tiers?.length ?? 0)} tier${(rule.tiers?.length ?? 0) !== 1 ? 's' : ''}`}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Applies to: {Array.isArray(rule.appliesTo) ? rule.appliesTo.map(type => type === 'all' ? 'All Deals' : type).join(', ') : 'All Deals'}
                      </span>
                    </div>
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
                    className="shadow-sm"
                    onClick={() => onDuplicateRule(rule)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
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
            )) : (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
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