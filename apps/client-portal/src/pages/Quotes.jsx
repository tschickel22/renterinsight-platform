import React, { useState } from 'react';
import { FileText, Eye, Check, Download, X } from 'lucide-react';
import QuoteAcceptModal from '../components/quotes/QuoteAcceptModal';
import QuoteDetailModal from '../components/quotes/QuoteDetailModal';

const Quotes = () => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock quotes data
  const quotes = [
    {
      id: 'Q-2024-001',
      title: '2024 Forest River Georgetown',
      status: 'pending',
      total: 137700,
      createdAt: '2024-01-15',
      validUntil: '2024-02-15',
      items: [
        { id: '1', description: '2024 Forest River Georgetown', quantity: 1, unitPrice: 125000, total: 125000 },
        { id: '2', description: 'Extended Warranty', quantity: 1, unitPrice: 2500, total: 2500 }
      ],
      subtotal: 127500,
      tax: 10200
    },
    {
      id: 'Q-2024-002',
      title: 'Service Package',
      status: 'accepted',
      total: 1250,
      createdAt: '2024-01-10',
      validUntil: '2024-02-10',
      items: [
        { id: '3', description: 'Annual Maintenance Package', quantity: 1, unitPrice: 1250, total: 1250 }
      ],
      subtotal: 1250,
      tax: 0
    }
  ];

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleAcceptQuote = (quote) => {
    setSelectedQuote(quote);
    setShowAcceptModal(true);
  };

  const handleDownloadQuote = (quoteId) => {
    // In a real app, this would download the quote PDF
    alert(`Downloading quote ${quoteId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Accepted</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quotes</h1>
        <p className="text-gray-500">
          View and accept quotes for your Home/RV
        </p>
      </div>

      {/* Quotes List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Your Quotes</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {quotes.map((quote) => (
            <div key={quote.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{quote.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">Quote #{quote.id}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Created: {quote.createdAt}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Valid until: {quote.validUntil}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-2">
                  <div className="mr-4">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-bold text-lg">{formatCurrency(quote.total)}</div>
                  </div>
                  <div className="mr-4">
                    {getStatusBadge(quote.status)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewQuote(quote)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="View Quote"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    <button 
                      onClick={() => handleDownloadQuote(quote.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                      title="Download Quote"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    
                    {quote.status === 'pending' && (
                      <button 
                        onClick={() => handleAcceptQuote(quote)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Accept Quote"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {quotes.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No quotes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any quotes yet. Contact your sales representative to request a quote.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedQuote && showDetailModal && (
        <QuoteDetailModal 
          quote={selectedQuote} 
          onClose={() => setShowDetailModal(false)}
          onAccept={() => {
            setShowDetailModal(false);
            setShowAcceptModal(true);
          }}
        />
      )}
      
      {selectedQuote && showAcceptModal && (
        <QuoteAcceptModal 
          quote={selectedQuote} 
          onClose={() => setShowAcceptModal(false)}
          onAccept={() => {
            alert(`Quote ${selectedQuote.id} accepted!`);
            setShowAcceptModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Quotes;