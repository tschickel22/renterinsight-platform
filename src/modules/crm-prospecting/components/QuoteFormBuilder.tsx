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
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [taxRate, setTaxRate] = useState(8.5)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  // Calculate totals whenever line items change
  useEffect(() => {
    const newSubtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
    const newTax = newSubtotal * (taxRate / 100)
    const newTotal = newSubtotal + newTax

    setSubtotal(newSubtotal)
    setTax(newTax)
    setTotal(newTotal)
  }, [lineItems, taxRate])

  const addLineItem = () => {
    if (!selectedProduct) return

    const product = mockProducts.find(p => p.id === selectedProduct)
    if (!product) return

    const newItem: QuoteLineItem = {
      id: Date.now().toString(),
      productId: product.id,
      description: product.name,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
      discountType: 'percentage',
      total: product.price
    }

    setLineItems([...lineItems, newItem])
    setSelectedProduct('')
  }

  const updateLineItem = (id: string, updates: Partial<QuoteLineItem>) => {
    setLineItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates }
          // Recalculate total
          const discountAmount = updated.discountType === 'percentage'
            ? updated.unitPrice * updated.quantity * (updated.discount / 100)
            : updated.discount
          updated.total = (updated.unitPrice * updated.quantity) - discountAmount
          return updated
        }
        return item
      })
    )
  }

  const removeLineItem = (id: string) => {
    setLineItems(items => items.filter(item => item.id !== id))
  }

  const handleSave = () => {
    const quoteData = {
      customerId,
      lineItems,
      subtotal,
      tax,
      total,
      notes,
      validUntil,
      status: 'draft'
    }

    onSave(quoteData)
    toast({
      title: "Quote saved",
      description: "The quote has been saved successfully."
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quote Builder</h2>
          <p className="text-muted-foreground">Create and customize quotes for customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Quote
          </Button>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">
            <Package className="h-4 w-4 mr-2" />
            Line Items
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Calculator className="h-4 w-4 mr-2" />
            Pricing Rules
          </TabsTrigger>
          <TabsTrigger value="summary">
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
              <CardDescription>Select products to add to the quote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{product.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {formatCurrency(product.price)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addLineItem} disabled={!selectedProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
            </CardHeader>
            <CardContent>
              {lineItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items added yet. Select products above to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {lineItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.description}</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
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
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateLineItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label>Discount Type</Label>
                          <Select
                            value={item.discountType}
                            onValueChange={(value: 'percentage' | 'fixed') => updateLineItem(item.id, { discountType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">
                                <Percent className="h-4 w-4 mr-2" />
                                Percentage
                              </SelectItem>
                              <SelectItem value="fixed">
                                <DollarSign className="h-4 w-4 mr-2" />
                                Fixed Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Total</Label>
                          <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                            {formatCurrency(item.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>Automatic discounts and pricing adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPricingRules.map(rule => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rule.type === 'quantity_discount' && `Minimum quantity: ${rule.conditions.minQuantity}`}
                      {rule.type === 'bundle_discount' && 'Bundle discount'}
                      {rule.type === 'customer_discount' && `Customer type: ${rule.conditions.customerType}`}
                    </p>
                    <div className="text-sm">
                      Discount: {rule.discount.type === 'percentage' ? `${rule.discount.value}%` : formatCurrency(rule.discount.value)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or terms..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quote Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}