import React, { useState } from 'react';
import { Vehicle, ServiceTicket, Priority, ServiceStatus } from '@/types';

interface ServiceRequestFormProps {
  clientId: string;
  vehicles?: Vehicle[];
  onSubmit: (serviceData: Partial<ServiceTicket>) => Promise<void>;
}

export function ServiceRequestForm({ clientId, vehicles = [], onSubmit }: ServiceRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    title: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    contactPhone: '',
    contactEmail: '',
    priority: Priority.MEDIUM
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!formData.title || !formData.description) {
      setError('Please provide a title and description for your service request');
      return;
    }
    
    setLoading(true);
    
    try {
      const serviceData: Partial<ServiceTicket> = {
        customerId: clientId,
        vehicleId: formData.vehicleId || undefined,
        title: formData.title,
        description: formData.description,
        priority: formData.priority as Priority,
        status: ServiceStatus.OPEN,
        customFields: {
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          requestedByClient: true
        }
      };
      
      await onSubmit(serviceData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        vehicleId: '',
        title: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        contactPhone: '',
        contactEmail: '',
        priority: Priority.MEDIUM
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit service request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Request Service</h2>
      </div>

      {success ? (
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-2">Service Request Submitted</h3>
          <p className="text-green-700">
            Your service request has been submitted successfully. Our team will review your request and contact you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Home/RV (Optional)
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">-- Select a Home/RV --</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              If your Home/RV is not listed, you can leave this blank
            </p>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Service Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., AC Repair, Annual Maintenance"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe the issue or service needed in detail"
              rows={4}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">-- Select a time --</option>
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                <option value="evening">Evening (5pm - 8pm)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value={Priority.LOW}>Low - Not urgent</option>
              <option value={Priority.MEDIUM}>Medium - Standard service</option>
              <option value={Priority.HIGH}>High - Needs prompt attention</option>
              <option value={Priority.URGENT}>Urgent - Critical issue</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}