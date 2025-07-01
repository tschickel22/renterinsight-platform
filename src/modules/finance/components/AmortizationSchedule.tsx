import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowUp, ArrowDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface AmortizationScheduleProps {
  schedule: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    additionalCosts: number
    balance: number
    totalInterestPaid: number
  }>
}

export function AmortizationSchedule({ schedule }: AmortizationScheduleProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string>('month')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const rowsPerPage = 12

  // Filter and sort the schedule
  const filteredSchedule = schedule.filter(row => 
    row.month.toString().includes(searchTerm)
  )

  const sortedSchedule = [...filteredSchedule].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedSchedule.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedSchedule = sortedSchedule.slice(startIndex, startIndex + rowsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (schedule.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No amortization schedule available. Please calculate a loan first.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by month..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, sortedSchedule.length)} of {sortedSchedule.length} payments
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th 
                className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('month')}
              >
                <div className="flex items-center">
                  <span>Month</span>
                  {sortField === 'month' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('payment')}
              >
                <div className="flex items-center">
                  <span>Payment</span>
                  {sortField === 'payment' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('principal')}
              >
                <div className="flex items-center">
                  <span>Principal</span>
                  {sortField === 'principal' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('interest')}
              >
                <div className="flex items-center">
                  <span>Interest</span>
                  {sortField === 'interest' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium text-muted-foreground"
              >
                Additional
              </th>
              <th 
                className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center">
                  <span>Balance</span>
                  {sortField === 'balance' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="p-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('totalInterestPaid')}
              >
                <div className="flex items-center">
                  <span>Total Interest</span>
                  {sortField === 'totalInterestPaid' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedSchedule.map((row, index) => (
              <tr key={row.month} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                <td className="p-3">{row.month}</td>
                <td className="p-3">{formatCurrency(row.payment)}</td>
                <td className="p-3">{formatCurrency(row.principal)}</td>
                <td className="p-3">{formatCurrency(row.interest)}</td>
                <td className="p-3">{formatCurrency(row.additionalCosts)}</td>
                <td className="p-3">{formatCurrency(row.balance)}</td>
                <td className="p-3">{formatCurrency(row.totalInterestPaid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      )}
    </div>
  )
}