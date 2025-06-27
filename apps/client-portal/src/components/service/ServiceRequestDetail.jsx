import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';

const ServiceRequestDetail = ({ ticket, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the server
    alert(`Message sent: ${message}`);
    setMessage('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Open</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'waiting_parts':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Waiting Parts</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Low</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">High</span>;
      case 'urgent':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Urgent</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{priority}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{ticket.title}</h2>
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
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div>
                <span className="text-sm text-gray-500">Ticket #{ticket.id}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">Created: {ticket.createdAt}</span>
              </div>
              <div className="flex space-x-2 ml-auto">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-700">{ticket.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Scheduled Date</h3>
                <p className="text-sm">{ticket.scheduledDate || 'Not scheduled yet'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Estimated Completion</h3>
                <p className="text-sm">{ticket.estimatedCompletion || 'Not specified'}</p>
              </div>
              {ticket.completedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Completed Date</h3>
                  <p className="text-sm">{ticket.completedDate}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Service Updates */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Service Updates
            </h3>
            
            <div className="space-y-4">
              {ticket.updates && ticket.updates.map((update) => (
                <div key={update.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{update.author}</span>
                    <span className="text-xs text-gray-500">{update.date}</span>
                  </div>
                  <p className="text-sm">{update.message}</p>
                </div>
              ))}
              
              {(!ticket.updates || ticket.updates.length === 0) && (
                <div className="text-center py-4 text-sm text-gray-500">
                  No updates available for this service request.
                </div>
              )}
            </div>
          </div>
          
          {/* Message Form */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-3">Send a Message</h3>
            <form onSubmit={handleSendMessage}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetail;