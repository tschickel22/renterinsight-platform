import React from 'react';
import { X, Download, Check } from 'lucide-react';

const QuoteDetailModal = ({ quote, onClose, onAccept }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quote Details</h2>
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
            <h3 className="text-lg font-medium">{quote.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Quote #{quote.id}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Created: {quote.createdAt}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Valid until: {quote.validUntil}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">Items</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Subtotal
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(quote.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Tax
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(quote.tax)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(quote.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => alert(`Downloading quote ${quote.id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 inline-block mr-2" />
              Download PDF
            </button>
            
            {quote.status === 'pending' && (
              <button
                onClick={onAccept}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                <Check className="h-4 w-4 inline-block mr-2" />
                Accept Quote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailModal;