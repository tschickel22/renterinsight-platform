import React, { useState } from 'react';
import { FileText, Download, FileSignature, Eye, Check } from 'lucide-react';
import DocumentSignModal from '../components/documents/DocumentSignModal';
import DocumentViewerModal from '../components/documents/DocumentViewerModal';

const Documents = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);

  // Mock documents data
  const documents = [
    {
      id: 'DOC-2024-001',
      title: 'Purchase Agreement',
      type: 'agreement',
      status: 'pending_signature',
      createdAt: '2024-01-15',
      expiresAt: '2024-02-15',
      fileUrl: '/documents/purchase-agreement.pdf'
    },
    {
      id: 'DOC-2024-002',
      title: 'Warranty Information',
      type: 'warranty',
      status: 'signed',
      createdAt: '2024-01-10',
      signedAt: '2024-01-12',
      fileUrl: '/documents/warranty.pdf'
    },
    {
      id: 'DOC-2024-003',
      title: 'Delivery Confirmation',
      type: 'delivery',
      status: 'pending_signature',
      createdAt: '2024-01-20',
      expiresAt: '2024-02-20',
      fileUrl: '/documents/delivery-confirmation.pdf'
    },
    {
      id: 'DOC-2024-004',
      title: 'Owner\'s Manual',
      type: 'manual',
      status: 'available',
      createdAt: '2024-01-05',
      fileUrl: '/documents/owners-manual.pdf'
    }
  ];

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowViewerModal(true);
  };

  const handleSignDocument = (document) => {
    setSelectedDocument(document);
    setShowSignModal(true);
  };

  const handleDownloadDocument = (documentId) => {
    // In a real app, this would download the document
    alert(`Downloading document ${documentId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_signature':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Needs Signature</span>;
      case 'signed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Signed</span>;
      case 'available':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Available</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'agreement':
        return <FileSignature className="h-6 w-6 text-purple-500" />;
      case 'warranty':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'delivery':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'manual':
        return <FileText className="h-6 w-6 text-blue-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-gray-500">
          View and sign important documents related to your Home/RV
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Your Documents</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {documents.map((document) => (
            <div key={document.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    {getDocumentTypeIcon(document.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{document.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">Document #{document.id}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Created: {document.createdAt}</span>
                      {document.signedAt && (
                        <>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">Signed: {document.signedAt}</span>
                        </>
                      )}
                      {document.expiresAt && (
                        <>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">Expires: {document.expiresAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-2">
                  <div className="mr-4">
                    {getStatusBadge(document.status)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDocument(document)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="View Document"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    <button 
                      onClick={() => handleDownloadDocument(document.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                      title="Download Document"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    
                    {document.status === 'pending_signature' && (
                      <button 
                        onClick={() => handleSignDocument(document)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Sign Document"
                      >
                        <FileSignature className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {documents.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any documents yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedDocument && showViewerModal && (
        <DocumentViewerModal 
          document={selectedDocument} 
          onClose={() => setShowViewerModal(false)}
          onSign={() => {
            setShowViewerModal(false);
            setShowSignModal(true);
          }}
        />
      )}
      
      {selectedDocument && showSignModal && (
        <DocumentSignModal 
          document={selectedDocument} 
          onClose={() => setShowSignModal(false)}
          onSign={() => {
            alert(`Document ${selectedDocument.id} signed!`);
            setShowSignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Documents;