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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const relevantQuotes = quotes.filter(
    (quote) => quote.customerId === clientId && quote.status !== QuoteStatus.ACCEPTED
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

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    context.beginPath();
    context.moveTo(x * 2, y * 2);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return;

    if ('touches' in e) e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    context.lineTo(x * 2, y * 2);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) setSignature(canvas.toDataURL());
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
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();

      const signatureData: ClientSignature = {
        id: Math.random().toString(36).substr(2, 9),
        clientId,
        documentId: selectedQuote.id,
        documentType: 'quote',
        signatureUrl: signature,
        ipAddress: ipData.ip || '127.0.0.1',
        signedAt: new Date(),
        createdAt: new Date(),
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Quotes</h1>

      {relevantQuotes.length === 0 ? (
        <p className="text-gray-500">No quotes to display.</p>
      ) : (
        <div className="space-y-4">
          {relevantQuotes.map((quote) => (
            <div key={quote.id} className="p-4 border rounded bg-white">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">Quote #{quote.id}</h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {quote.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Created: {formatDate(quote.createdAt)}</p>
              <p className="text-sm text-muted-foreground">Valid Until: {formatDate(quote.validUntil)}</p>
              <p className="text-sm">Items: {quote.items.length}</p>
              <p className="text-sm">Total: {formatCurrency(quote.total)}</p>
              <button
                onClick={() => {
                  setSelectedQuote(quote);
                  setShowSignatureModal(true);
                }}
                className="mt-3 text-white bg-primary px-3 py-1 rounded hover:bg-primary-dark"
              >
                Accept Quote
              </button>
            </div>
          ))}
        </div>
      )}

      {showSignatureModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xl">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">Accept Quote #{selectedQuote.id}</h3>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-sm mb-2">By signing, you agree to the quote of {formatCurrency(selectedQuote.total)}.</p>
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
              className="w-full h-48 border rounded"
            />
            <div className="flex justify-between items-center mt-2">
              <button onClick={clearSignature} className="text-sm text-gray-500 hover:text-gray-700">Clear</button>
              <button
                onClick={handleAcceptQuote}
                disabled={!signature || loading}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Confirm & Sign'}
              </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
