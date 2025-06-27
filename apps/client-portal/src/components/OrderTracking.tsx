import React from 'react';
import { Delivery, DeliveryStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface OrderTrackingProps {
  clientId: string;
  deliveries?: Delivery[];
}

export function OrderTracking({ clientId, deliveries = [] }: OrderTrackingProps) {
  const clientDeliveries = deliveries.filter(d => d.customerId === clientId);

  const getStatusColor = (status: DeliveryStatus) => {
    const map = {
      [DeliveryStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
      [DeliveryStatus.IN_TRANSIT]: 'bg-yellow-100 text-yellow-800',
      [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [DeliveryStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    const icons: Record<DeliveryStatus, JSX.Element> = {
      [DeliveryStatus.SCHEDULED]: (
        <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12" strokeWidth={2} />
        </svg>
      ),
      [DeliveryStatus.IN_TRANSIT]: (
        <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth={2} />
        </svg>
      ),
      [DeliveryStatus.DELIVERED]: (
        <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeWidth={2} />
        </svg>
      ),
      [DeliveryStatus.CANCELLED]: (
        <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} />
        </svg>
      ),
    };
    return icons[status] || null;
  };

  const renderTimeline = (delivery: Delivery) => {
    const { status, createdAt, scheduledDate, deliveredDate, customFields } = delivery;
    const departureTime = customFields?.departureTime ? new Date(customFields.departureTime) : null;

    const steps = [
      { id: 'scheduled', name: 'Scheduled', date: createdAt, completed: true },
      {
        id: 'preparation',
        name: 'Preparation',
        date: new Date(scheduledDate.getTime() - 86400000),
        completed: status !== DeliveryStatus.SCHEDULED,
      },
      {
        id: 'in_transit',
        name: 'In Transit',
        date: departureTime ?? scheduledDate,
        completed: [DeliveryStatus.IN_TRANSIT, DeliveryStatus.DELIVERED].includes(status),
      },
      {
        id: 'delivered',
        name: 'Delivered',
        date: deliveredDate ?? scheduledDate,
        completed: status === DeliveryStatus.DELIVERED,
      },
    ];

    return (
      <div className="relative mt-4">
        {steps.map((step, i) => (
          <div key={step.id} className="relative pb-8">
            {i < steps.length - 1 && (
              <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200" />
            )}
            <div className="relative flex items-start space-x-3">
              <div>
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full ring-8 ring-white ${
                    step.completed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeWidth={2} />
                    </svg>
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{step.name}</div>
                <div className="text-sm text-gray-500">
                  {step.completed ? formatDate(step.date) : `Est: ${formatDate(step.date)}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Deliveries</h2>

      {clientDeliveries.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12" strokeWidth={2} />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No deliveries found</h3>
          <p className="mt-2 text-sm text-gray-500">You have no deliveries scheduled at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clientDeliveries.map((delivery) => (
            <div key={delivery.id} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Delivery #{delivery.id.slice(0, 8)}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(delivery.status)}
                    <span>{delivery.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Scheduled</p>
                  <p className="font-medium">{formatDate(delivery.scheduledDate)}</p>
                </div>
                {delivery.deliveredDate && (
                  <div>
                    <p className="text-sm text-gray-500">Delivered</p>
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
                    <p className="text-sm text-gray-500">Est. Arrival</p>
                    <p className="font-medium">{delivery.customFields.estimatedArrival}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Delivery Address</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p>{delivery.address.street}</p>
                  <p>{delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}</p>
                  <p>{delivery.address.country}</p>
                </div>
              </div>

              {delivery.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="bg-gray-50 p-3 rounded text-sm">{delivery.notes}</p>
                </div>
              )}

              <div className="pt-6 mt-6 border-t">
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
