// src/tests/mocks/useServiceManagement.ts
export function useServiceManagement() {
  const serviceTickets = [
    {
      id: 'ticket1',
      ticketNumber: 'SRV-001',
      customerId: 'customer1',
      customerName: 'John Doe',
      vehicleId: 'vehicle1',
      vehicleInfo: '2024 Winnebago Vista',
      type: 'warranty',
      priority: 'high',
      status: 'in_progress',
      description: 'Generator not starting properly',
      assignedTo: 'tech1',
      technicianName: 'Mike Johnson',
      createdAt: '2025-06-20T09:00:00Z',
      updatedAt: '2025-06-22T14:30:00Z',
      estimatedCompletion: '2025-06-25T17:00:00Z',
      laborHours: 4.5,
      laborRate: 125,
      partsTotal: 285.50,
      totalCost: 848.00
    },
    {
      id: 'ticket2',
      ticketNumber: 'SRV-002',
      customerId: 'customer2',
      customerName: 'Jane Smith',
      vehicleId: 'vehicle2',
      vehicleInfo: '2023 Forest River Cherokee',
      type: 'maintenance',
      priority: 'medium',
      status: 'completed',
      description: 'Annual maintenance service',
      assignedTo: 'tech2',
      technicianName: 'Sarah Wilson',
      createdAt: '2025-06-18T10:30:00Z',
      updatedAt: '2025-06-21T16:00:00Z',
      estimatedCompletion: '2025-06-21T16:00:00Z',
      laborHours: 3.0,
      laborRate: 125,
      partsTotal: 125.00,
      totalCost: 500.00
    },
    {
      id: 'ticket3',
      ticketNumber: 'SRV-003',
      customerId: 'customer3',
      customerName: 'Bob Johnson',
      vehicleId: 'vehicle3',
      vehicleInfo: '2024 Keystone Montana',
      type: 'repair',
      priority: 'low',
      status: 'pending',
      description: 'Slide out mechanism adjustment',
      assignedTo: 'tech1',
      technicianName: 'Mike Johnson',
      createdAt: '2025-06-25T11:15:00Z',
      updatedAt: '2025-06-25T11:15:00Z',
      estimatedCompletion: '2025-06-28T15:00:00Z',
      laborHours: 2.0,
      laborRate: 125,
      partsTotal: 75.00,
      totalCost: 325.00
    }
  ]

  return {
    serviceTickets,
    loading: false,
    error: null,
    addServiceTicket: () => Promise.resolve(),
    updateServiceTicket: () => Promise.resolve(),
    deleteServiceTicket: () => Promise.resolve(),
    getTicketsByStatus: (status: string) => serviceTickets.filter(t => t.status === status),
    getTicketsByTechnician: (techId: string) => serviceTickets.filter(t => t.assignedTo === techId)
  }
}