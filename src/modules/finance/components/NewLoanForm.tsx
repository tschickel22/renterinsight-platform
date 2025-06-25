// (imports remain unchanged)
interface NewLoanFormProps {
  onSave: (loanData: any) => Promise<void>
  onCancel: () => void
  onAddNewCustomer?: () => void
  preselectedCustomerId?: string | null
}

export function NewLoanForm({
  onSave, onCancel, onAddNewCustomer, preselectedCustomerId
}: NewLoanFormProps) {
  const { toast } = useToast()
  const { leads } = useLeadManagement()
  const { vehicles, getAvailableVehicles } = useInventoryManagement()
  const [loading, setLoading] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorResults, setCalculatorResults] = useState<any>(null)

  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId || '',
    customerName: '',
    vehicleId: '',
    vehicleInfo: '',
    amount: 0,
    downPayment: 0,
    term: 60,
    rate: 6.99,
    paymentAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: '',
    loanType: 'standard',
    paymentFrequency: 'monthly',
    includeInsurance: false,
    insuranceAmount: 0,
    includeTax: false,
    taxRate: 0
  })

  useEffect(() => {
    if (preselectedCustomerId) {
      setFormData(prev => ({ ...prev, customerId: preselectedCustomerId }))
    }
  }, [preselectedCustomerId])

  useEffect(() => {
    if (formData.customerId) {
      const customer = leads.find(c => c.id === formData.customerId)
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: `${customer.firstName} ${customer.lastName}`
        }))
      }
    }
  }, [formData.customerId, leads])

  const handleCustomerSelect = (value: string) => {
    if (value === 'add-new') {
      onAddNewCustomer?.()
    } else {
      setFormData(prev => ({ ...prev, customerId: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerId || !formData.vehicleId) {
      toast({
        title: 'Validation Error',
        description: 'Customer and vehicle are required.',
        variant: 'destructive'
      })
      return
    }
    setLoading(true)
    try {
      await onSave(formData)
    } catch {
      toast({ title: 'Error', description: 'Failed to create loan', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // ... rest of form rendering (unchanged)
}
