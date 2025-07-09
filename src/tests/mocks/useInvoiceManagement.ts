// src/tests/mocks/useInvoiceManagement.ts
export function useInvoiceManagement() {
  const invoices = [
    {
      id: 'invoice1',
      invoiceNumber: 'INV-2025-001',
      customerId: 'customer1',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      issueDate: '2025-06-15T00:00:00Z',
      dueDate: '2025-07-15T00:00:00Z',
      status: 'paid',
      subtotal: 45000,
      taxAmount: 3600,
      totalAmount: 48600,
      paidAmount: 48600,
      balanceAmount: 0,
      items: [
        {
          id: 'item1',
          description: '2024 Winnebago Vista - Down Payment',
          quantity: 1,
          unitPrice: 45000,
          total: 45000
        }
      ],
      paymentHistory: [
        {
          id: 'payment1',
          amount: 48600,
          method: 'bank_transfer',
          date: '2025-06-20T10:30:00Z',
          reference: 'TXN-12345'
        }
      ]
    },
    {
      id: 'invoice2',
      invoiceNumber: 'INV-2025-002',
      customerId: 'customer2',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      issueDate: '2025-06-20T00:00:00Z',
      dueDate: '2025-07-20T00:00:00Z',
      status: 'overdue',
      subtotal: 500,
      taxAmount: 40,
      totalAmount: 540,
      paidAmount: 0,
      balanceAmount: 540,
      items: [
        {
          id: 'item2',
          description: 'Annual Maintenance Service',
          quantity: 1,
          unitPrice: 500,
          total: 500
        }
      ],
      paymentHistory: []
    },
    {
      id: 'invoice3',
      invoiceNumber: 'INV-2025-003',
      customerId: 'customer3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.johnson@example.com',
      issueDate: '2025-06-25T00:00:00Z',
      dueDate: '2025-07-25T00:00:00Z',
      status: 'pending',
      subtotal: 325,
      taxAmount: 26,
      totalAmount: 351,
      paidAmount: 0,
      balanceAmount: 351,
      items: [
        {
          id: 'item3',
          description: 'Slide Out Mechanism Repair',
          quantity: 1,
          unitPrice: 325,
          total: 325
        }
      ],
      paymentHistory: []
    }
  ]

  return {
    invoices,
    loading: false,
    error: null,
    addInvoice: () => Promise.resolve(),
    updateInvoice: () => Promise.resolve(),
    deleteInvoice: () => Promise.resolve(),
    recordPayment: () => Promise.resolve(),
    getInvoicesByStatus: (status: string) => invoices.filter(i => i.status === status),
    getOverdueInvoices: () => invoices.filter(i => i.status === 'overdue')
  }
}