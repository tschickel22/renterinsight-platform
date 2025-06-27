import React, { useState, useRef } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

const DocumentSignModal = ({ document, onClose, onSign }) => {
  const [name, setName] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [errors, setErrors] = useState({});
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!isAgreed) newErrors.agreed = 'You must agree to the terms';
    if (!hasDrawn) newErrors.signature = 'Signature is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Process signature
    onSign();
  };

  // Canvas signature handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    
    // Get the correct position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Get the correct position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (hasDrawn) {
      // Save signature data
      const canvas = canvasRef.current;
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSignature('');
  };

  // Initialize canvas
  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sign Document</h2>
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
            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
              <div className="mr-3 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-blue-700">Important Information</h4>
                <p className="text-sm text-blue-600 mt-1">
                  By signing this document, you acknowledge that you have read and understood its contents.
                  This will create a legally binding agreement.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">Document Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Document #:</span>
                <span className="text-sm font-medium">{document.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Title:</span>
                <span className="text-sm font-medium">{document.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm font-medium">{document.createdAt}</span>
              </div>
              {document.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expires:</span>
                  <span className="text-sm font-medium">{document.expiresAt}</span>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="Enter your full legal name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signature
              </label>
              <div className={`border ${errors.signature ? 'border-red-500' : 'border-gray-300'} rounded-md p-1 bg-gray-50`}>
                <canvas
                  ref={canvasRef}
                  width={540}
                  height={150}
                  className="w-full touch-none cursor-crosshair border border-gray-200 rounded bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousedown', {
                      clientX: touch.clientX,
                      clientY: touch.clientY
                    });
                    canvasRef.current.dispatchEvent(mouseEvent);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousemove', {
                      clientX: touch.clientX,
                      clientY: touch.clientY
                    });
                    canvasRef.current.dispatchEvent(mouseEvent);
                  }}
                  onTouchEnd={() => endDrawing()}
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
              {errors.signature && (
                <p className="mt-1 text-sm text-red-600">{errors.signature}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Please sign using your mouse or finger
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${errors.agreed ? 'border-red-500' : ''}`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the terms and conditions
                  </label>
                  <p className="text-gray-500">
                    By checking this box, I confirm that I have read and agree to the terms and conditions of this document.
                  </p>
                  {errors.agreed && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreed}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                <Check className="h-4 w-4 inline-block mr-2" />
                Sign Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentSignModal;