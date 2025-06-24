import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export interface QuoteLineItem {
  id: string
  productId?: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
  isBundle?: boolean
  bundleItems?: QuoteLineItem[]
}

export interface Quote {
  id: string
  customerId: string
  items: QuoteLineItem[]
  subtotal: number
  totalDiscount: number
  tax: number
  taxRate: number
  total: number
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  validUntil: Date
  notes: string
  terms: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  isBundle?: boolean
  bundleItems?: { productId: string; quantity: number }[]
}

export interface PricingRule {
  id: string
  name: string
  type: 'quantity_discount' | 'bundle_discount' | 'customer_discount'
  conditions: {
    minQuantity?: number
    productIds?: string[]
    customerType?: string
  }
  discount: {
    type: 'percentage' | 'fixed'
    value: number
  }
  isActive: boolean
}

export function useQuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing quotes from localStorage or use mock data
    const savedQuotes = loadFromLocalStorage('renter-insight-quotes', [])
    setQuotes(savedQuotes)

    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: '2024 Forest River Georgetown',
        description: 'Class A Motorhome with premium features',
        price: 125000,
        category: 'motorhome'
      },
      {
        id: '2',
        name: 'Extended Warranty',
        description: '3-year comprehensive warranty coverage',
        price: 2500,
        category: 'warranty'
      },
      {
        id: '3',
        name: 'Solar Panel Package',
        description: '400W solar panel system with inverter',
        price: 3500,
        category: 'accessory'
      },
      {
        id: '4',
        name: 'Premium Package',
        description: 'Includes extended warranty, solar panels, and premium interior',
        price: 8000,
        category: 'bundle',
        isBundle: true,
        bundleItems: [
          { productId: '2', quantity: 1 },
          { productId: '3', quantity: 1 },
          { productId: '5', quantity: 1 }
        ]
      },
      {
        id: '5',
        name: 'Premium Interior Upgrade',
        description: 'Leather seating and premium finishes',
        price: 2200,
        category: 'upgrade'
      },
      {
        id: '6',
        name: 'Backup Camera System',
        description: 'Wireless backup camera with monitor',
        price: 450,
        category: 'accessory'
      },
      {
        id: '7',
        name: 'Awning Package',
        description: 'Electric awning with LED lighting',
        price: 1200,
        category: 'accessory'
      }
    ]

    // Mock pricing rules
    const mockPricingRules: PricingRule[] = [
      {
        id: '1',
        name: 'Bulk Accessory Discount',
        type: 'quantity_discount',
        conditions: { minQuantity: 3 },
        discount: { type: 'percentage', value: 10 },
        isActive: true
      },
      {
        id: '2',
        name: 'Premium Bundle Discount',
        type: 'bundle_discount',
        conditions: { productIds: ['4'] },
        discount: { type: 'fixed', value: 500 },
        isActive: true
      },
      {
        id: '3',
        name: 'First-Time Buyer Discount',
        type: 'customer_discount',
        conditions: { customerType: 'first_time' },
        discount: { type: 'percentage', value: 5 },
        isActive: true
      }
    ]

    setProducts(mockProducts)
    setPricingRules(mockPricingRules)
  }

  const saveQuotesToStorage = (updatedQuotes: Quote[]) => {
    saveToLocalStorage('renter-insight-quotes', updatedQuotes)
  }

  const createQuote = async (quoteData: Partial<Quote>) => {
    setLoading(true)
    try {
      const newQuote: Quote = {
        id: Math.random().toString(36).substr(2, 9),
        customerId: quoteData.customerId || '',
        items: quoteData.items || [],
        subtotal: quoteData.subtotal || 0,
        totalDiscount: quoteData.totalDiscount || 0,
        tax: quoteData.tax || 0,
        taxRate: quoteData.taxRate || 0.08,
        total: quoteData.total || 0,
        status: 'draft',
        validUntil: quoteData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: quoteData.notes || '',
        terms: quoteData.terms || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedQuotes = [...quotes, newQuote]
      setQuotes(updatedQuotes)
      saveQuotesToStorage(updatedQuotes)

      return newQuote
    } finally {
      setLoading(false)
    }
  }

  const updateQuote = async (quoteId: string, updates: Partial<Quote>) => {
    setLoading(true)
    try {
      const updatedQuotes = quotes.map(quote =>
        quote.id === quoteId
          ? { ...quote, ...updates, updatedAt: new Date() }
          : quote
      )
      setQuotes(updatedQuotes)
      saveQuotesToStorage(updatedQuotes)

      return updatedQuotes.find(q => q.id === quoteId)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuote = async (quoteId: string) => {
    const updatedQuotes = quotes.filter(quote => quote.id !== quoteId)
    setQuotes(updatedQuotes)
    saveQuotesToStorage(updatedQuotes)
  }

  const duplicateQuote = async (quoteId: string) => {
    const originalQuote = quotes.find(q => q.id === quoteId)
    if (!originalQuote) return

    const duplicatedQuote: Quote = {
      ...originalQuote,
      id: Math.random().toString(36).substr(2, 9),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedQuotes = [...quotes, duplicatedQuote]
    setQuotes(updatedQuotes)
    saveQuotesToStorage(updatedQuotes)

    return duplicatedQuote
  }

  const sendQuote = async (quoteId: string) => {
    return updateQuote(quoteId, { status: 'sent' })
  }

  const acceptQuote = async (quoteId: string) => {
    return updateQuote(quoteId, { status: 'accepted' })
  }

  const rejectQuote = async (quoteId: string) => {
    return updateQuote(quoteId, { status: 'rejected' })
  }

  const calculateQuoteTotals = (items: QuoteLineItem[], taxRate: number = 0.08) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const totalDiscount = items.reduce((sum, item) => {
      const itemDiscount = item.discountType === 'percentage'
        ? (item.quantity * item.unitPrice * item.discount / 100)
        : (item.discount * item.quantity)
      return sum + itemDiscount
    }, 0)

    const taxableAmount = subtotal - totalDiscount
    const tax = taxableAmount * taxRate
    const total = taxableAmount + tax

    return {
      subtotal,
      totalDiscount,
      tax,
      total
    }
  }

  const applyPricingRules = (items: QuoteLineItem[], customerId?: string) => {
    let updatedItems = [...items]

    pricingRules.forEach(rule => {
      if (!rule.isActive) return

      switch (rule.type) {
        case 'quantity_discount':
          if (rule.conditions.minQuantity) {
            const accessoryItems = updatedItems.filter(item =>
              products.find(p => p.id === item.productId)?.category === 'accessory'
            )
            if (accessoryItems.length >= rule.conditions.minQuantity) {
              updatedItems = updatedItems.map(item => {
                if (accessoryItems.includes(item)) {
                  return {
                    ...item,
                    discount: rule.discount.value,
                    discountType: rule.discount.type
                  }
                }
                return item
              })
            }
          }
          break

        case 'bundle_discount':
          if (rule.conditions.productIds) {
            updatedItems = updatedItems.map(item => {
              if (item.isBundle && rule.conditions.productIds?.includes(item.productId || '')) {
                return {
                  ...item,
                  discount: rule.discount.value,
                  discountType: rule.discount.type
                }
              }
              return item
            })
          }
          break

        case 'customer_discount':
          // Apply customer-specific discounts based on customer type
          // This would typically check customer data
          break
      }
    })

    return updatedItems
  }

  const getQuotesByCustomer = (customerId: string) => {
    return quotes.filter(quote => quote.customerId === customerId)
  }

  const getQuotesByStatus = (status: Quote['status']) => {
    return quotes.filter(quote => quote.status === status)
  }

  const getExpiredQuotes = () => {
    const now = new Date()
    return quotes.filter(quote => new Date(quote.validUntil) < now && quote.status !== 'accepted')
  }

  return {
    quotes,
    products,
    pricingRules,
    loading,
    createQuote,
    updateQuote,
    deleteQuote,
    duplicateQuote,
    sendQuote,
    acceptQuote,
    rejectQuote,
    calculateQuoteTotals,
    applyPricingRules,
    getQuotesByCustomer,
    getQuotesByStatus,
    getExpiredQuotes
  }
}