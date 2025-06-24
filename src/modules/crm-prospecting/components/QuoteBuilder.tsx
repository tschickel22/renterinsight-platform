import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Save, Plus, Trash2, Download, Send, Calculator, Package, Percent, DollarSign, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface QuoteLineItem {
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

interface PricingRule {
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

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  isBundle?: boolean
  bundleItems?: { productId: string; quantity: number }[]
}

interface QuoteBuilderProps {
  quote?: any
  customerId: string
  onSave: (quoteData: any) => void
  onCancel: () => void
}

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
  }
]

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
  }
]

export function QuoteBuilder({ quote, customerId, onSave, onCancel }: QuoteBuilderProps) {
  const { toast } = useToast()
  const { getAvailableVehicles, getVehicleById } = useInventoryManagement()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('items')
  
  const [quoteData, setQuoteData] = useState({
    customerId,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    notes: '',
    terms: 'Payment due within 30 days. All sales final.',
    items: [] as QuoteLineItem[],
    subtotal: 0,
    totalDiscount: 0,
    tax: 0,
    taxRate: 0.08, // 8% tax rate
    total: 0
  })

  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [newItem, setNewItem] = useState<Partial<QuoteLineItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    discountType: 'percentage'
  })

  // Get available vehicles for selection
  const availableVehicles = getAvailableVehicles()

  useEffect(() => {
    if (quote) {
      setQuoteData(prev => ({ ...prev, ...quote }))
    }
  }, [quote])

  useEffect(() => {
    calculateTotals()
  }, [quoteData.items, quoteData.taxRate])

  const calculateTotals = () => {
    const subtotal = quoteData.items.reduce((sum, item) => sum + item.total, 0)
    const totalDiscount = quoteData.items.reduce((sum, item) => {
      const itemDiscount = item.discountType === 'percentage' 
        ? (item.quantity * item.unitPrice * item.discount / 100)
        : (item.discount * item.quantity)
      return sum + itemDiscount
    }, 0)
    
    const taxableAmount = subtotal - totalDiscount
    const tax = taxableAmount * quoteData.taxRate
    const total = taxableAmount + tax

    setQuoteData(prev => ({
      ...prev,
      subtotal,
      totalDiscount,
      tax,
      total
    }))
  }

  const addLineItem = () => {
    if (!newItem.description || !newItem.unitPrice) {
      toast({
        title: 'Validation Error',
        description: 'Description and unit price are required',
        variant: 'destructive'
      })
      return
    }

    const item: QuoteLineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: newItem.description,
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      discount: newItem.discount || 0,
      discountType: newItem.discountType || 'percentage',
      total: calculateLineTotal(newItem as QuoteLineItem)
    }

    setQuoteData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    // Reset form
    setNewItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percentage'
    })
    setSelectedProduct('')
    setShowAddItem(false)
  }

  const addVehicleToQuote = (vehicleId: string) => {
    const vehicle = getVehicleById(vehicleId)
    if (!vehicle) return

    const item: QuoteLineItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: vehicle.id,
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      quantity: 1,
      unitPrice: vehicle.price,
      discount: 0,
      discountType: 'percentage',
      total: vehicle.price
    }

    setQuoteData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setSelectedVehicle('')
    
    toast({
      title: 'Vehicle Added',
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} added to quote`,
    })
  }

  const addProductToQuote = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (!product) return

    if (product.isBundle && product.bundleItems) {
      // Add bundle as a single item with expanded details
      const bundleItem: QuoteLineItem = {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        description: product.description,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        discountType: 'percentage',
        total: product.price,
        isBundle: true,
        bundleItems: product.bundleItems.map(bundleItem => {
          const bundleProduct = mockProducts.find(p => p.id === bundleItem.productId)
          return {
            id: Math.random().toString(36).substr(2, 9),
            productId: bundleItem.productId,
            description: bundleProduct?.name || '',
            quantity: bundleItem.quantity,
            unitPrice: bundleProduct?.price || 0,
            discount: 0,
            discountType: 'percentage' as const,
            total: (bundleProduct?.price || 0) * bundleItem.quantity
          }
        })
      }

      setQuoteData(prev => ({
        ...prev,
        items: [...prev.items, bundleItem]
      }))
    } else {
      // Add regular product
      const item: QuoteLineItem = {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        description: product.name,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        discountType: 'percentage',
        total: product.price
      }

      setQuoteData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }))
    }

    // Apply pricing rules
    applyPricingRules()
  }

  const calculateLineTotal = (item: QuoteLineItem) => {
    const baseTotal = item.quantity * item.unitPrice
    const discountAmount = item.discountType === 'percentage' 
      ? baseTotal * (item.discount / 100)
      : item.discount * item.quantity
    return baseTotal - discountAmount
  }

  const updateLineItem = (itemId: string, updates: Partial<QuoteLineItem>) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates }
          updatedItem.total = calculateLineTotal(updatedItem)
          return updatedItem
        }
        return item
      })
    }))
  }

  const removeLineItem = (itemId: string) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const applyPricingRules = () => {
    // Apply quantity discounts
    const accessoryItems = quoteData.items.filter(item => 
      mockProducts.find(p => p.id === item.productId)?.category === 'accessory'
    )
    
    if (accessoryItems.length >= 3) {
      accessoryItems.forEach(item => {
        updateLineItem(item.id, { discount: 10, discountType: 'percentage' })
      })
    }

    // Apply bundle discounts
    const bundleItems = quoteData.items.filter(item => item.isBundle)
    bundleItems.forEach(item => {
      updateLineItem(item.id, { discount: 500, discountType: 'fixed' })
    })
  }

  const generatePDF = async () => {
    setLoading(true)
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would use a library like jsPDF or react-pdf
      const pdfContent = generatePDFContent()
      
      // Create a blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quote-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: 'PDF Generated',
        description: 'Quote PDF has been downloaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePDFContent = () => {
    return `
QUOTE DOCUMENT
==============

Customer ID: ${quoteData.customerId}
Valid Until: ${quoteData.validUntil.toLocaleDateString()}

LINE ITEMS:
-----------
${quoteData.items.map(item => `
${item.description}
Quantity: ${item.quantity} x ${formatCurrency(item.unitPrice)}
${item.discount > 0 ? `Discount: ${item.discount}${item.discountType === 'percentage' ? '%' : ' fixed'}` : ''}
Total: ${formatCurrency(item.total)}
${item.isBundle ? `
  Bundle Items:
  ${item.bundleItems?.map(bundleItem => `  - ${bundleItem.description} (${bundleItem.quantity}x)`).join('\n  ') || ''}
` : ''}
`).join('\n')}

TOTALS:
-------
Subtotal: ${formatCurrency(quoteData.subtotal)}
Total Discount: ${formatCurrency(quoteData.totalDiscount)}
Tax (${(quoteData.taxRate * 100).toFixed(1)}%): ${formatCurrency(quoteData.tax)}
TOTAL: ${formatCurrency(quoteData.total)}

Notes: ${quoteData.notes}
Terms: ${quoteData.terms}
    `
  }

  const handleSave = async () => {
    if (quoteData.items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one line item is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const quoteToSave = {
        ...quoteData,
        customerId: quoteData.customerId || customerId
      }
      await onSave(quoteToSave)
      toast({
        title: 'Success',
        description: 'Quote saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                {quote ? 'Edit Quote' : 'Create Quote'}
              </CardTitle>
              <CardDescription>
                Build a detailed quote with line items, pricing rules, and bundled products
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="items">Line Items</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
              <TabsTrigger value="details">Quote Details</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quote Line Items</h3>
                <div className="flex space-x-2">
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Add vehicle from inventory" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {formatCurrency(vehicle.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVehicle && (
                    <Button onClick={() => addVehicleToQuote(selectedVehicle)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  )}
                  <Button onClick={() => setShowAddItem(true)} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Custom Item
                  </Button>
                </div>
              </div>

              {/* Add Custom Item Form */}
              {showAddItem && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={newItem.description || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          value={newItem.unitPrice || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={newItem.quantity || 1}
                          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                          min="1"
                        />
                      </div>
                      <div>
                        <Label>Discount</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={newItem.discount || 0}
                            onChange={(e) => setNewItem(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                          />
                          <Select
                            value={newItem.discountType}
                            onValueChange={(value: 'percentage' | 'fixed') => setNewItem(prev => ({ ...prev, discountType: value }))}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">$</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddItem(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addLineItem}>
                        Add Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Line Items List */}
              <div className="space-y-4">
                {quoteData.items.map((item, index) => (
                  <Card key={item.id} className="shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 grid gap-4 md:grid-cols-4">
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                            />
                            {item.isBundle && (
                              <Badge className="mt-1 bg-purple-50 text-purple-700 border-purple-200">
                                <Package className="h-3 w-3 mr-1" />
                                Bundle
                              </Badge>
                            )}
                          </div>
                          <div>
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                              min="1"
                            />
                          </div>
                          <div>
                            <Label>Unit Price</Label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label>Discount</Label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                value={item.discount}
                                onChange={(e) => updateLineItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                                step="0.01"
                              />
                              <Select
                                value={item.discountType}
                                onValueChange={(value: 'percentage' | 'fixed') => updateLineItem(item.id, { discountType: value })}
                              >
                                <SelectTrigger className="w-16">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">%</SelectItem>
                                  <SelectItem value="fixed">$</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className="font-bold text-lg">{formatCurrency(item.total)}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Bundle Items */}
                      {item.isBundle && item.bundleItems && (
                        <div className="mt-4 pl-4 border-l-2 border-purple-200">
                          <h4 className="text-sm font-semibold text-purple-700 mb-2">Bundle Contents:</h4>
                          <div className="space-y-2">
                            {item.bundleItems.map(bundleItem => (
                              <div key={bundleItem.id} className="flex items-center justify-between text-sm bg-purple-50 p-2 rounded">
                                <span>{bundleItem.description}</span>
                                <span>{bundleItem.quantity}x {formatCurrency(bundleItem.unitPrice)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {quoteData.items.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No line items added yet</p>
                    <p className="text-sm">Add products or custom items to build your quote</p>
                  </div>
                )}
              </div>

              {/* Quote Totals */}
              {quoteData.items.length > 0 && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(quoteData.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Total Discount:</span>
                        <span>-{formatCurrency(quoteData.totalDiscount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({(quoteData.taxRate * 100).toFixed(1)}%):</span>
                        <span>{formatCurrency(quoteData.tax)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(quoteData.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Inventory & Products</h3>
                
                {/* Available Vehicles Section */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-3 text-blue-600">Available Vehicles</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableVehicles.map(vehicle => (
                      <Card key={vehicle.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  {vehicle.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">VIN: {vehicle.vin}</p>
                              <p className="text-sm text-muted-foreground mb-2">Location: {vehicle.location}</p>
                              <div className="text-lg font-bold text-primary">{formatCurrency(vehicle.price)}</div>
                              
                              {vehicle.features.length > 0 && (
                                <div className="mt-3">
                                  <div className="flex flex-wrap gap-1">
                                    {vehicle.features.slice(0, 3).map((feature, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                    {vehicle.features.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{vehicle.features.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => addVehicleToQuote(vehicle.id)}
                              size="sm"
                              className="ml-4"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Available Products Section */}
                <div>
                  <h4 className="text-md font-semibold mb-3 text-green-600">Available Products & Services</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockProducts.map(product => (
                    <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{product.name}</h4>
                              {product.isBundle && (
                                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                                  <Package className="h-3 w-3 mr-1" />
                                  Bundle
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                            <div className="text-lg font-bold text-primary">{formatCurrency(product.price)}</div>
                            
                            {product.isBundle && product.bundleItems && (
                              <div className="mt-3 p-2 bg-purple-50 rounded">
                                <div className="text-xs font-semibold text-purple-700 mb-1">Includes:</div>
                                {product.bundleItems.map(bundleItem => {
                                  const bundleProduct = mockProducts.find(p => p.id === bundleItem.productId)
                                  return (
                                    <div key={bundleItem.productId} className="text-xs text-purple-600">
                                      • {bundleProduct?.name} ({bundleItem.quantity}x)
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => addProductToQuote(product.id)}
                            size="sm"
                            className="ml-4"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Active Pricing Rules</h3>
                <div className="space-y-4">
                  {mockPricingRules.filter(rule => rule.isActive).map(rule => (
                    <Card key={rule.id} className="shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {rule.type === 'quantity_discount' && `Min quantity: ${rule.conditions.minQuantity}`}
                              {rule.type === 'bundle_discount' && 'Applied to bundle products'}
                              {rule.type === 'customer_discount' && `Customer type: ${rule.conditions.customerType}`}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                <Percent className="h-3 w-3 mr-1" />
                                {rule.discount.type === 'percentage' ? `${rule.discount.value}%` : formatCurrency(rule.discount.value)} off
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPricingRules()}
                          >
                            <Calculator className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={quoteData.validUntil.toISOString().split('T')[0]}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={(quoteData.taxRate * 100).toFixed(2)}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) / 100 || 0 }))}
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes for the customer..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={quoteData.terms}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Terms and conditions..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={generatePDF}
                disabled={loading || quoteData.items.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Export PDF'}
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Quote
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}