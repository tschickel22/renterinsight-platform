import React, { useState } from 'react';
import { Vehicle, ServiceTicket, Priority, ServiceStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface ServiceRequestFormProps {
  clientId: string;
  vehicles?: Vehicle[];
  onSubmit: (serviceData: Partial<ServiceTicket>) => Promise<void>;
}

export function ServiceRequestForm({ clientId, vehicles = [], onSubmit }: ServiceRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: '',
    title: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    contactPhone: '',
    contactEmail: '',
    priority: Priority.MEDIUM,
  });

  const resetForm = () =>
    setFormData({
      vehicleId: '',
      title: '',
      description: '',
      preferredDate: '',
      preferredTime: '',
      contactPhone: '',
      contactEmail: '',
      priority: Priority.MEDIUM,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title || !formData.description) {
      setError('Please provide a title and description.');
      return;
    }

    setLoading(true);
    try {
      const serviceData: Partial<ServiceTicket> = {
        customerId: clientId,
        vehicleId: formData.vehicleId || undefined,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: ServiceStatus.OPEN,
        customFields: {
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          requestedByClient: true,
        },
      };

      await onSubmit(serviceData);
      setSuccess(true);
      toast({ title: 'Request submitted!', description: 'We’ll review and follow up shortly.' });
      resetForm();
    } catch (err: any) {
      const message = err?.message || 'Failed to submit request';
      toast({ title: 'Submission failed', description: message, variant: 'destructive' });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Request Service</h2>

      {success ? (
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Service Request Submitted</h3>
          <p className="text-green-700 mt-2">
            Our team will contact you shortly. You may submit another request if needed.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>
          )}

          {/* Vehicle Selection */}
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Home/RV (Optional)
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">-- Select --</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>

          {/* Required Fields */}
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
              required
              placeholder="e.g. AC Repair"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Briefly describe the issue..."
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Preferences */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium mb-1">
                Preferred Time
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              >
                <option value="">-- Select --</option>
                <option value="morning">Morning (8–12)</option>
                <option value="afternoon">Afternoon (12–5)</option>
                <option value="evening">Evening (5–8)</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                autoComplete="tel"
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority Level
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm"
            >
              <option value={Priority.LOW}>Low - Not urgent</option>
              <option value={Priority.MEDIUM}>Medium - Normal</option>
              <option value={Priority.HIGH}>High - Important</option>
              <option value={Priority.URGENT}>Urgent - Critical issue</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
