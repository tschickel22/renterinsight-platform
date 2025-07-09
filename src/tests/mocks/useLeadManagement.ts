// src/tests/mocks/useLeadManagement.ts
export function useLeadManagement() {
  const leads = [
    {
      id: 'lead1',
      createdAt: '2025-06-15T10:00:00Z',
      assignedTo: 'salesRep1',
      status: 'qualified',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-0123',
      source: 'website',
      score: 85,
      value: 45000,
      notes: 'Interested in Class A motorhome'
    },
    {
      id: 'lead2',
      createdAt: '2025-06-20T14:30:00Z',
      assignedTo: 'salesRep2',
      status: 'new',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-0456',
      source: 'referral',
      score: 72,
      value: 32000,
      notes: 'Looking for travel trailer'
    },
    {
      id: 'lead3',
      createdAt: '2025-06-25T09:15:00Z',
      assignedTo: 'salesRep1',
      status: 'contacted',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '555-0789',
      source: 'social_media',
      score: 68,
      value: 28000,
      notes: 'Interested in fifth wheel'
    }
  ]

  const salesReps = [
    {
      id: 'salesRep1',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com'
    },
    {
      id: 'salesRep2',
      name: 'Sarah Davis',
      email: 'sarah.davis@company.com'
    }
  ]

  return {
    leads,
    salesReps,
    loading: false,
    error: null,
    addLead: () => Promise.resolve(),
    updateLead: () => Promise.resolve(),
    deleteLead: () => Promise.resolve(),
    assignLead: () => Promise.resolve()
  }
}