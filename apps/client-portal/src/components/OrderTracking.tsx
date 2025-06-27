import React from 'react';
import { Delivery, DeliveryStatus } from '@/types';
import { formatDate } from '@/lib/utils';

interface OrderTrackingProps {
  clientId: string;
  deliveries?: Delivery[];
}

export function OrderTracking({ clientId, deliveries = [] }: OrderTrackingProps) {
  // Filter deliveries for this client
  const clientDeliveries = deliveries.filter(delivery => delivery.customerId === clientId);

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case DeliveryStatus.IN_TRANSIT:
        return 'bg-yellow-100 text-yellow-800';
      case DeliveryStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case DeliveryStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SCHEDULED:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case DeliveryStatus.IN_TRANSIT:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case DeliveryStatus.DELIVERED:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case DeliveryStatus.CANCELLED:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTimeline = (delivery: Delivery) => {
    const steps = [
      { 
        id: 'scheduled', 
        name: 'Scheduled', 
        date: delivery.createdAt, 
        status: 'completed' 
      },
      { 
        id: 'preparation', 
        name: 'Preparation', 
        date: new Date(delivery.scheduledDate.getTime() - 86400000), // 1 day before scheduled
        status: delivery.status !== DeliveryStatus.SCHEDULED ? 'completed' : 'upcoming'
      },
      { 
        id: 'in_transit', 
        name: 'In Transit', 
        date: delivery.status === DeliveryStatus.IN_TRANSIT ? 
          (delivery.customFields?.departureTime ? new Date(delivery.customFields.departureTime) : new Date()) : 
          delivery.scheduledDate,
        status: delivery.status === DeliveryStatus.IN_TRANSIT || delivery.status === DeliveryStatus.DELIVERED ? 
          'completed' : 'upcoming'
      },
      { 
        id: 'delivered', 
        name: 'Delivered', 
        date: delivery.deliveredDate || delivery.scheduledDate,
        status: delivery.status === DeliveryStatus.DELIVERED ? 'completed' : 'upcoming'
      }
    ];

    return (
      <div className="mt-4">
        <div className="relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative pb-8">
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
              )}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className={`relative px-1 ${
                    step.status === 'completed' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}>
                    {step.status === 'completed' ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {step.name}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {step.status === 'completed' ? formatDate(step.date) : 'Estimated: ' + formatDate(step.date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Deliveries</h2>
      </div>

      {clientDeliveries.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No deliveries found</h3>
          <p className="mt-2 text-sm text-gray-500">
            You don't have any deliveries scheduled at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {clientDeliveries.map((delivery) => (
            <div key={delivery.id} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Delivery #{delivery.id.substring(0, 8)}</h3>
                <div className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(delivery.status)}
                    <span>{delivery.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Scheduled Date</p>
                  <p className="font-medium">{formatDate(delivery.scheduledDate)}</p>
                </div>
                {delivery.deliveredDate && (
                  <div>
                    <p className="text-sm text-gray-500">Delivered Date</p>
                    <p className="font-medium">{formatDate(delivery.deliveredDate)}</p>
                  </div>
                )}
                {delivery.driver && (
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="font-medium">{delivery.driver}</p>
                  </div>
                )}
                {delivery.customFields?.estimatedArrival && (
                  <div>
                    <p className="text-sm text-gray-500">Estimated Arrival</p>
                    <p className="font-medium">{delivery.customFields.estimatedArrival}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Delivery Address</h4>
                <div className="p-3 bg-gray-50 rounded">
                  <p>{delivery.address.street}</p>
                  <p>{delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}</p>
                  <p>{delivery.address.country}</p>
                </div>
              </div>
              
              {delivery.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm p-3 bg-gray-50 rounded">{delivery.notes}</p>
                </div>
              )}
              
              {/* Delivery Timeline */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-2">Delivery Progress</h4>
                {renderTimeline(delivery)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}