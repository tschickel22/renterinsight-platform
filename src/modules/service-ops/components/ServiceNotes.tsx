import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Plus, User, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ServiceNote {
  id: string
  ticketId: string
  userId: string
  userName: string
  content: string
  isCustomerVisible: boolean
  createdAt: Date
}

interface ServiceNotesProps {
  notes: ServiceNote[]
  ticketId: string
}

export function ServiceNotes({ notes, ticketId }: ServiceNotesProps) {
  const { toast } = useToast()
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [isCustomerVisible, setIsCustomerVisible] = useState(false)

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: 'Error',
        description: 'Note content cannot be empty',
        variant: 'destructive'
      })
      return
    }

    // In a real app, this would call an API to add the note
    toast({
      title: 'Note Added',
      description: 'Service note has been added successfully',
    })

    setNewNote('')
    setIsCustomerVisible(false)
    setShowAddNote(false)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Service Notes</CardTitle>
            <CardDescription>
              Communication and updates about this service ticket
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddNote(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddNote && (
          <div className="space-y-4 p-4 border rounded-lg border-dashed">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              rows={3}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customerVisible"
                checked={isCustomerVisible}
                onCheckedChange={(checked) => setIsCustomerVisible(!!checked)}
              />
              <Label htmlFor="customerVisible">Visible to customer</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{note.userName}</span>
                    {note.isCustomerVisible ? (
                      <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>Customer Visible</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200 flex items-center space-x-1">
                        <EyeOff className="h-3 w-3" />
                        <span>Internal Only</span>
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No notes added yet</p>
              <p className="text-sm">Add notes to track communication and updates</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}