import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Download, Eye, EyeOff, File, Upload } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ServiceDocument {
  id: string
  ticketId: string
  name: string
  type: string
  url: string
  size: number
  isCustomerVisible: boolean
  uploadedBy: string
  uploadedAt: Date
}

interface ServiceDocumentsProps {
  documents: ServiceDocument[]
  ticketId: string
}

export function ServiceDocuments({ documents, ticketId }: ServiceDocumentsProps) {
  const { toast } = useToast()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [isCustomerVisible, setIsCustomerVisible] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <File className="h-8 w-8 text-red-500" />
    if (type.includes('image')) return <File className="h-8 w-8 text-blue-500" />
    if (type.includes('word')) return <File className="h-8 w-8 text-blue-700" />
    if (type.includes('excel') || type.includes('sheet')) return <File className="h-8 w-8 text-green-600" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  const handleUpload = () => {
    // In a real app, this would handle file upload
    toast({
      title: 'Upload Successful',
      description: 'Document has been uploaded successfully',
    })
    setShowUploadForm(false)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Documents</CardTitle>
            <CardDescription>
              Files and documents related to this service ticket
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowUploadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showUploadForm && (
          <div className="space-y-4 p-4 border rounded-lg border-dashed">
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/10">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, Word, Excel, and image files up to 10MB
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customerVisible"
                checked={isCustomerVisible}
                onChange={(e) => setIsCustomerVisible(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="customerVisible" className="text-sm">Visible to customer</label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                Upload
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((document) => (
              <div key={document.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {getFileIcon(document.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium truncate">{document.name}</span>
                    {document.isCustomerVisible ? (
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
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(document.size)} • Uploaded by {document.uploadedBy} on {formatDate(document.uploadedAt)}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No documents added yet</p>
              <p className="text-sm">Upload documents to share with the team or customer</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}