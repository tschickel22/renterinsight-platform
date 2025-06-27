import React, { useState, useRef, useEffect } from 'react';
import { Quote, QuoteStatus, ClientSignature } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface QuoteAcceptanceProps {
  clientId: string;
  quotes?: Quote[];
  onAcceptQuote: (quoteId: string, signature: ClientSignature) => Promise<void>;
}

export function QuoteAcceptance({ clientId, quotes = [], onAcceptQuote }: QuoteAcceptanceProps) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Filter quotes that are relevant to this client and not yet accepted
  const relevantQuotes = quotes.filter(
    quote => quote.customerId === clientId && quote.status !== QuoteStatus.ACCEPTED
  );

  useEffect(() => {
    if (showSignatureModal && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  }, [showSignatureModal]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (canvas && context) {
      let clientX, clientY;
      
      if ('touches' in e) {
        // Touch event
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * 2;
      const y = (clientY - rect.top) * 2;
      
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (canvas && context) {
      let clientX, clientY;
      
      if ('touches' in e) {
        // Touch event
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        
        // Prevent scrolling while drawing
        e.preventDefault();
      } else {
        // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * 2;
      const y = (clientY - rect.top) * 2;
      
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  const handleAcceptQuote = async () => {
    if (!selectedQuote || !signature) {
      setError('Please provide a signature to accept this quote');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get client's IP address (in a real app, this would be done server-side)
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip || '127.0.0.1';
      
      const signatureData: ClientSignature = {
        id: Math.random().toString(36).substr(2, 9),
        clientId,
        documentId: selectedQuote.id,
        documentType: 'quote',
        signatureUrl: signature,
        ipAddress,
        signedAt: new Date(),
        createdAt: new Date()
      };
      
      await onAcceptQuote(selectedQuote.id, signatureData);
      setShowSignatureModal(false);
      setSelectedQuote(null);
      setSignature(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Quotes</h2>
          <p className="text-muted-foreground">
            View and accept quotes for your Home/RV
          </p>
        </div>
      </div>

      {relevantQuotes.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No quotes available</h3>
          <p className="mt-2 text-sm text-gray-500">
            You don't have any quotes to review at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {relevantQuotes.map((quote) => (
            <div key={quote.id} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Quote #{quote.id}</h3>
                <div className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {quote.status.toUpperCase()}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(quote.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className="font-medium">{formatDate(quote.validUntil)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="font-medium">{quote.items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-primary">{formatCurrency(quote.total)}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {quote.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {quote.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm p-3 bg-gray-50 rounded">{quote.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setSelectedQuote(quote);
                    setShowSignatureModal(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Accept Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Accept Quote #{selectedQuote.id}</h3>
              <button
                onClick={() => {
                  setShowSignatureModal(false);
                  setSignature(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                By signing below, you agree to accept this quote for a total of {formatCurrency(selectedQuote.total)}.
              </p>
              
              <div className="border-2 border-gray-300 rounded-md p-1">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-48 border border-gray-200 rounded touch-none"
                />
              </div>
              
              <div className="flex justify-end mt-2">
                <button
                  onClick={clearSignature}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear Signature
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSignatureModal(false);
                  setSignature(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptQuote}
                disabled={!signature || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Accept Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}