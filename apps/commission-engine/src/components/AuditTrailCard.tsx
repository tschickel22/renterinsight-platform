import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { History, Edit, Save, X, Check, AlertTriangle, User, Clock, Plus, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { AuditEntry } from '@/types'

interface AuditTrailCardProps {
  entries: AuditEntry[]
  dealId: string
  currentUserId: string
  currentUserName: string
  onAddEntry: (entry: Partial<AuditEntry>) => Promise<void>
  onUpdateEntry: (entryId: string, notes: string) => Promise<void>
}

export function AuditTrailCard({
  entries,
  dealId,
  currentUserId,
  currentUserName,
  onAddEntry,
  onUpdateEntry
}: AuditTrailCardProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [editedNotes, setEditedNotes] = useState('')
  const [newEntryDescription, setNewEntryDescription] = useState('')

  const handleAddEntry = async () => {
    if (!newEntryDescription.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a description for the audit entry',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onAddEntry({
        dealId,
        userId: currentUserId,
        userName: currentUserName,
        action: 'manual_note',
        description: newEntryDescription,
        timestamp: new Date()
      })
      
      setNewEntryDescription('')
      toast({
        title: 'Success',
        description: 'Audit entry added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add audit entry',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditEntry = (entry: AuditEntry) => {
    setEditingEntryId(entry.id)
    setEditedNotes(entry.notes || '')
  }

  const handleSaveNotes = async () => {
    if (!editingEntryId) return

    setLoading(true)
    try {
      await onUpdateEntry(editingEntryId, editedNotes)
      
      setEditingEntryId(null)
      setEditedNotes('')
      toast({
        title: 'Success',
        description: 'Notes updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    setEditedNotes('')
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'delete':
        return <X className="h-4 w-4 text-red-500" />
      case 'approve':
        return <Check className="h-4 w-4 text-green-500" />
      case 'reject':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'manual_note':
        return <History className="h-4 w-4 text-purple-500" />
      default:
        return <History className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'update':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'delete':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'approve':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'reject':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'manual_note':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Sort entries by timestamp (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2 text-primary" />
              Audit Trail
            </CardTitle>
            <CardDescription>
              Track changes and add notes to this deal
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Entry */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Add Note to Audit Trail</h3>
          <Textarea 
            value={newEntryDescription}
            onChange={(e) => setNewEntryDescription(e.target.value)}
            placeholder="Add a note or comment about this deal..."
            rows={2}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddEntry} 
              disabled={loading || !newEntryDescription.trim()}
              size="sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Audit Trail Entries */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">History ({sortedEntries.length} entries)</h3>
          
          {sortedEntries.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
              <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No audit trail entries yet</p>
              <p className="text-sm">Actions on this deal will be recorded here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Badge className={getActionColor(entry.action)}>
                        {getActionIcon(entry.action)}
                        <span className="ml-1 sr-only">{entry.action}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm capitalize" title={entry.action}>
                            {entry.action.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        
                        {entry.action === 'manual_note' && entry.userId === currentUserId && editingEntryId !== entry.id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditEntry(entry)}
                            className="h-6 px-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {entry.description}
                      </p>
                      
                      {/* Display old and new values if they exist */}
                      {(entry.oldValue !== undefined || entry.newValue !== undefined) && (
                        <div className="mt-2 text-xs">
                          {entry.oldValue !== undefined && (
                            <div className="bg-red-50 p-1.5 rounded-md mb-1">
                              <span className="font-medium">Old: </span>
                              {typeof entry.oldValue === 'object' 
                                ? JSON.stringify(entry.oldValue) 
                                : entry.oldValue.toString()}
                            </div>
                          )}
                          {entry.newValue !== undefined && (
                            <div className="bg-green-50 p-1.5 rounded-md">
                              <span className="font-medium">New: </span>
                              {typeof entry.newValue === 'object' 
                                ? JSON.stringify(entry.newValue) 
                                : entry.newValue.toString()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* User info */}
                      <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{entry.userName}</span>
                      </div>
                      
                      {/* Notes section */}
                      {editingEntryId === entry.id ? (
                        <div className="mt-2 space-y-2">
                          <Textarea 
                            value={editedNotes}
                            onChange={(e) => setEditedNotes(e.target.value)}
                            placeholder="Add notes about this entry..."
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleCancelEdit}
                              disabled={loading}
                              className="h-7 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleSaveNotes}
                              disabled={loading}
                              className="h-7 text-xs"
                            >
                              {loading ? 'Saving...' : 'Save Notes'}
                            </Button>
                          </div>
                        </div>
                      ) : entry.notes ? (
                        <div className="mt-2 p-2 bg-muted/30 rounded-md flex items-start space-x-2">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{entry.notes}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}