import React, { useState } from 'react';
import { Wrench, Plus, Eye, MessageSquare } from 'lucide-react';
import ServiceRequestForm from '../components/service/ServiceRequestForm';
import ServiceRequestDetail from '../components/service/ServiceRequestDetail';

const ServiceRequests = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock service tickets data
  const serviceTickets = [
    {
      id: 'ST-2024-001',
      title: 'Annual Maintenance Service',
      description: 'Regular annual maintenance for my Home/RV',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-01-15',
      scheduledDate: '2024-01-25',
      estimatedCompletion: '2024-01-26',
      updates: [
        { id: 1, date: '2024-01-15', message: 'Service request received', author: 'System' },
        { id: 2, date: '2024-01-16', message: 'Scheduled for January 25', author: 'Service Dept' }
      ]
    },
    {
      id: 'ST-2024-002',
      title: 'AC System Repair',
      description: 'AC not cooling properly',
      status: 'completed',
      priority: 'high',
      createdAt: '2024-01-10',
      scheduledDate: '2024-01-12',
      completedDate: '2024-01-13',
      updates: [
        { id: 1, date: '2024-01-10', message: 'Service request received', author: 'System' },
        { id: 2, date: '2024-01-12', message: 'Technician diagnosed issue with compressor', author: 'Tech: John' },
        { id: 3, date: '2024-01-13', message: 'Replaced compressor and recharged system. All tests passed.', author: 'Tech: John' }
      ]
    }
  ];

  const handleCreateRequest = () => {
    setShowRequestForm(true);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };

  const handleSubmitRequest = (formData) => {
    // In a real app, this would submit the service request
    alert('Service request submitted successfully!');
    setShowRequestForm(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-gray-500">
            Request and track service for your Home/RV
          </p>
        </div>
        <button
          onClick={handleCreateRequest}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 inline-block mr-2" />
          New Service Request
        </button>
      </div>

      {/* Service Tickets List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Your Service Tickets</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {serviceTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Wrench className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{ticket.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">Ticket #{ticket.id}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Created: {ticket.createdAt}</span>
                      {ticket.scheduledDate && (
                        <>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">Scheduled: {ticket.scheduledDate}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-2">
                  <div className="mr-4 flex space-x-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewTicket(ticket)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                      title="Send Message"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {serviceTickets.length === 0 && (
            <div className="p-8 text-center">
              <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No service tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any service tickets yet. Create a new service request to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showRequestForm && (
        <ServiceRequestForm 
          onClose={() => setShowRequestForm(false)}
          onSubmit={handleSubmitRequest}
        />
      )}
      
      {selectedTicket && showDetailModal && (
        <ServiceRequestDetail 
          ticket={selectedTicket} 
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default ServiceRequests;