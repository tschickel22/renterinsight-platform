import { useState, useEffect } from 'react'
import { Invoice, InvoiceStatus, Payment, PaymentStatus, PaymentMethod } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useInvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing invoices from localStorage or use mock data
    const savedInvoices = loadFromLocalStorage('renter-insight-invoices', [
      {
        id: '1',
        customerId: 'cust-1',
        number: 'INV-2024-001',
        items: [
          {
            id: '1',
            description: '2024 Forest River Georgetown',
            quantity: 1,
            unitPrice: 125000,
            total: 125000
          },
          {
            id: '2',
            description: 'Extended Warranty',
            quantity: 1,
            unitPrice: 2500,
            total: 2500
          }
        ],
        subtotal: 127500,
        tax: 10200,
        total: 137700,
        status: InvoiceStatus.PAID,
        dueDate: new Date('2024-02-15'),
        paidDate: new Date('2024-01-20'),
        paymentMethod: 'Credit Card',
        notes: 'Payment received via Zego',
        customFields: {},
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        customerId: 'cust-2',
        number: 'INV-2024-002',
        items: [
          {
            id: '3',
            description: 'Service - AC Repair',
            quantity: 1,
            unitPrice: 620,
            total: 620
          }
        ],
        subtotal: 620,
        tax: 49.60,
        total: 669.60,
        status: InvoiceStatus.SENT,
        dueDate: new Date('2024-02-20'),
        notes: 'Service invoice for AC repair',
        customFields: {},
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18')
      }
    ])

    // Load existing payments from localStorage or use mock data
    const savedPayments = loadFromLocalStorage('renter-insight-payments', [
      {
        id: '1',
        invoiceId: '1',
        amount: 137700,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_1234567890',
        processedDate: new Date('2024-01-20'),
        notes: 'Processed via Zego payment gateway',
        customFields: {},
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ])

    setInvoices(savedInvoices)
    setPayments(savedPayments)
  }

  const saveInvoicesToStorage = (updatedInvoices: Invoice[]) => {
    saveToLocalStorage('renter-insight-invoices', updatedInvoices)
  }

  const savePaymentsToStorage = (updatedPayments: Payment[]) => {
    saveToLocalStorage('renter-insight-payments', updatedPayments)
  }

  const getInvoicesByCustomerId = (customerId: string) => {
    return invoices.filter(invoice => invoice.customerId === customerId)
  }

  const getInvoiceById = (invoiceId: string) => {
    return invoices.find(invoice => invoice.id === invoiceId)
  }

  const getPaymentsByInvoiceId = (invoiceId: string) => {
    return payments.filter(payment => payment.invoiceId === invoiceId)
  }

  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    setLoading(true)
    try {
      const newInvoice: Invoice = {
        id: Math.random().toString(36).substr(2, 9),
        customerId: invoiceData.customerId || '',
        number: invoiceData.number || '',
        items: invoiceData.items || [],
        subtotal: invoiceData.subtotal || 0,
        tax: invoiceData.tax || 0,
        total: invoiceData.total || 0,
        status: invoiceData.status || InvoiceStatus.DRAFT,
        dueDate: invoiceData.dueDate || new Date(),
        notes: invoiceData.notes || '',
        customFields: invoiceData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedInvoices = [...invoices, newInvoice]
      setInvoices(updatedInvoices)
      saveInvoicesToStorage(updatedInvoices)

      return newInvoice
    } finally {
      setLoading(false)
    }
  }

  const updateInvoice = async (invoiceId: string, invoiceData: Partial<Invoice>) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            ...invoiceData,
            updatedAt: new Date() 
          }
        : invoice
    )
    setInvoices(updatedInvoices)
    saveInvoicesToStorage(updatedInvoices)
  }

  const deleteInvoice = async (invoiceId: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId)
    setInvoices(updatedInvoices)
    saveInvoicesToStorage(updatedInvoices)
  }

  const updateInvoiceStatus = async (invoiceId: string, status: InvoiceStatus) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status,
            updatedAt: new Date() 
          }
        : invoice
    )
    setInvoices(updatedInvoices)
    saveInvoicesToStorage(updatedInvoices)
  }

  const markInvoiceAsPaid = async (invoiceId: string, paymentMethod?: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: InvoiceStatus.PAID,
            paidDate: new Date(),
            paymentMethod,
            updatedAt: new Date() 
          }
        : invoice
    )
    setInvoices(updatedInvoices)
    saveInvoicesToStorage(updatedInvoices)
  }

  const sendInvoice = async (invoiceId: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: InvoiceStatus.SENT,
            updatedAt: new Date() 
          }
        : invoice
    )
    setInvoices(updatedInvoices)
    saveInvoicesToStorage(updatedInvoices)
  }

  const recordPayment = async (paymentData: Partial<Payment>) => {
    setLoading(true)
    try {
      const newPayment: Payment = {
        id: Math.random().toString(36).substr(2, 9),
        invoiceId: paymentData.invoiceId || '',
        amount: paymentData.amount || 0,
        method: paymentData.method || PaymentMethod.CREDIT_CARD,
        status: paymentData.status || PaymentStatus.COMPLETED,
        transactionId: paymentData.transactionId,
        processedDate: paymentData.processedDate || new Date(),
        notes: paymentData.notes || '',
        customFields: paymentData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedPayments = [...payments, newPayment]
      setPayments(updatedPayments)
      savePaymentsToStorage(updatedPayments)

      // If payment is completed, mark invoice as paid
      if (newPayment.status === PaymentStatus.COMPLETED) {
        await markInvoiceAsPaid(newPayment.invoiceId, newPayment.method)
      }

      return newPayment
    } finally {
      setLoading(false)
    }
  }

  const sendPaymentRequest = async (invoiceId: string) => {
    // In a real app, this would call the Zego API to send a payment request
    // For this demo, we'll just update the invoice status
    await updateInvoiceStatus(invoiceId, InvoiceStatus.SENT)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  }

  return {
    invoices,
    payments,
    loading,
    getInvoicesByCustomerId,
    getInvoiceById,
    getPaymentsByInvoiceId,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    markInvoiceAsPaid,
    sendInvoice,
    recordPayment,
    sendPaymentRequest
  }
}