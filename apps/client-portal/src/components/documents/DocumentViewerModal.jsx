import React from 'react';
import { X, Download, FileSignature } from 'lucide-react';

const DocumentViewerModal = ({ document, onClose, onSign }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{document.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">Document #{document.id}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">Created: {document.createdAt}</span>
              </div>
              <div>
                {document.status === 'pending_signature' && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Needs Signature</span>
                )}
                {document.status === 'signed' && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Signed</span>
                )}
                {document.status === 'available' && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Available</span>
                )}
              </div>
            </div>
            
            {/* Document Viewer (Placeholder) */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <FileSignature className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Document Preview</p>
                <p className="text-sm text-gray-400">
                  In a real application, the document would be displayed here
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => alert(`Downloading document ${document.id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 inline-block mr-2" />
              Download
            </button>
            
            {document.status === 'pending_signature' && (
              <button
                onClick={onSign}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                <FileSignature className="h-4 w-4 inline-block mr-2" />
                Sign Document
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;