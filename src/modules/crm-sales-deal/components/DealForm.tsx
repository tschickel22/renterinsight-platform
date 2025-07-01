import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Trash2, DollarSign, Calendar, User, Target, Package } from 'lucide-react'
import { Deal, DealStage, DealStatus, DealPriority, DealProduct } from '../types'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface DealFormProps {
  deal?: Deal
  customers: any[] // Using existing customer data
  salesReps: any[] // Using existing sales rep data
  territories: any[] // Using existing territory data
  products: any[] // Using existing product data
  onSave: (dealData: Partial<Deal>) => Promise<void>
  onCancel: () => void
}

export function DealForm({ deal, customers, salesReps, territories, products, onSave, onCancel }: DealFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Deal>>({
    name: '',
    customerId: '',
    customerName: '',
    stage: DealStage.PROSPECTING,
    status: DealStatus.ACTIVE,
    priority: DealPriority.MEDIUM,
    value: 0,
    probability: 10,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    assignedTo: '',
    territoryId: '',
    sourceId: '',
    competitorIds: [],
    products: [],
    notes: '',
    requiresApproval: false,
    customFields: {}
  })

  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<DealProduct>>({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    total: 0
  })

  // Initialize form with deal data if editing
  useEffect(() => {
    if (deal) {
      setFormData({
        ...deal,
        expectedCloseDate: new Date(deal.expectedCloseDate)
      })
    }
  }, [deal])

  // Update customer name when customer is selected
  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.id === formData.customerId)
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: `${customer.firstName} ${customer.lastName}`
        }))
      }
    }
  }, [formData.customerId, customers])

  // Calculate total value when products change
  useEffect(() => {
    if (formData.products && formData.products.length > 0) {
      const totalValue = formData.products.reduce((sum, product) => sum + product.total, 0)
      setFormData(prev => ({
        ...prev,
        value: totalValue
      }))
    }
  }, [formData.products])

  // Update new product total when quantity, price, or discount changes
  useEffect(() => {
    const quantity = newProduct.quantity || 1
    const unitPrice = newProduct.unitPrice || 0
    const discount = newProduct.discount || 0
    const total = (quantity * unitPrice) - discount
    
    setNewProduct(prev => ({
      ...prev,
      total
    }))
  }, [newProduct.quantity, newProduct.unitPrice, newProduct.discount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.customerId || !formData.expectedCloseDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Deal ${deal ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${deal ? 'update' : 'create'} deal`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.productId || !newProduct.productName) {
      toast({
        title: 'Validation Error',
        description: 'Please select a product',
        variant: 'destructive'
      })
      return
    }

    const product: DealProduct = {
      id: Math.random().toString(36).substr(2, 9),
      productId: newProduct.productId,
      productName: newProduct.productName,
      quantity: newProduct.quantity || 1,
      unitPrice: newProduct.unitPrice || 0,
      discount: newProduct.discount || 0,
      total: newProduct.total || 0
    }

    setFormData(prev => ({
      ...prev,
      products: [...(prev.products || []), product]
    }))

    setNewProduct({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    })

    setShowAddProduct(false)
  }

  const handleRemoveProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products?.filter(p => p.id !== productId) || []
    }))
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setNewProduct({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        total: product.price
      })
    }
  }

  const handleNewCustomerSuccess = (newCustomer: any) => {
    // Update the customer dropdown with the new customer and select it
    setFormData(prev => ({
      ...prev,
      customerId: newCustomer.id,
      customerName: `${newCustomer.firstName} ${newCustomer.lastName}`
    }))
    setShowNewCustomerForm(false)
    
    toast({
      title: 'Customer Added',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added as a customer.`,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* New Customer Form Modal */}
      {showNewCustomerForm && (
        <NewLeadForm
          onClose={() => setShowNewCustomerForm(false)}
          onSuccess={handleNewCustomerSuccess}
        />
      )}
      
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{deal ? 'Edit Deal' : 'Create Deal'}</CardTitle>
              <CardDescription>
                {deal ? 'Update deal details' : 'Create a new sales deal'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Deal Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Deal Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter deal name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select 
                    value={formData.customerId || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start" 
                          onClick={() => setShowNewCustomerForm(true)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          Add New Customer
                        </Button>
                      </div>
                      <div className="px-2 py-1 border-t"></div>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.firstName} {customer.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select 
                    value={formData.stage} 
                    onValueChange={(value: DealStage) => setFormData(prev => ({ 
                      ...prev, 
                      stage: value,
                      probability: value === DealStage.PROSPECTING ? 10 :
                                  value === DealStage.QUALIFICATION ? 25 :
                                  value === DealStage.NEEDS_ANALYSIS ? 40 :
                                  value === DealStage.PROPOSAL ? 60 :
                                  value === DealStage.NEGOTIATION ? 80 :
                                  value === DealStage.CLOSED_WON ? 100 :
                                  value === DealStage.CLOSED_LOST ? 0 : 10
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DealStage.PROSPECTING}>Prospecting</SelectItem>
                      <SelectItem value={DealStage.QUALIFICATION}>Qualification</SelectItem>
                      <SelectItem value={DealStage.NEEDS_ANALYSIS}>Needs Analysis</SelectItem>
                      <SelectItem value={DealStage.PROPOSAL}>Proposal</SelectItem>
                      <SelectItem value={DealStage.NEGOTIATION}>Negotiation</SelectItem>
                      <SelectItem value={DealStage.CLOSED_WON}>Closed Won</SelectItem>
                      <SelectItem value={DealStage.CLOSED_LOST}>Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: DealPriority) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DealPriority.LOW}>Low</SelectItem>
                      <SelectItem value={DealPriority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={DealPriority.HIGH}>High</SelectItem>
                      <SelectItem value={DealPriority.CRITICAL}>Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: new Date(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select 
                    value={formData.assignedTo} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales rep" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesReps.map(rep => (
                        <SelectItem key={rep.id} value={rep.id}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="territoryId">Territory</Label>
                  <Select 
                    value={formData.territoryId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, territoryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent>
                      {territories.map(territory => (
                        <SelectItem key={territory.id} value={territory.id}>
                          {territory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </h3>
                <Button type="button" onClick={() => setShowAddProduct(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Product</Label>
                        <Select onValueChange={handleProductSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - {formatCurrency(product.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newProduct.unitPrice}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label>Discount</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newProduct.discount}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-sm font-medium">Total: </span>
                        <span className="font-bold">{formatCurrency(newProduct.total || 0)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddProduct}>
                          Add Product
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products List */}
              <div className="space-y-3">
                {formData.products && formData.products.length > 0 ? (
                  formData.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{product.productName}</span>
                          <Badge variant="outline">
                            {product.quantity} × {formatCurrency(product.unitPrice)}
                          </Badge>
                        </div>
                        {product.discount > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            Discount: {formatCurrency(product.discount)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold">{formatCurrency(product.total)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No products added yet</p>
                    <p className="text-sm">Add products to calculate deal value</p>
                  </div>
                )}
              </div>

              {formData.products && formData.products.length > 0 && (
                <div className="flex justify-end p-3 bg-muted/30 rounded-lg">
                  <div className="text-right">
                    <span className="text-sm font-medium">Total Deal Value: </span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(formData.value || 0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this deal..."
                rows={3}
              />
            </div>

            {/* Approval Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Approval Settings</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresApproval: !!checked }))}
                />
                <Label htmlFor="requiresApproval">This deal requires approval</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Deals over $100,000 automatically require approval
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {deal ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {deal ? 'Update' : 'Create'} Deal
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}