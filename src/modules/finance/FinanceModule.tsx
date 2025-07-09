// src/modules/finance/FinanceModule.tsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Calculator, CreditCard, FileText, Plus, Search, Filter, TrendingUp, Clock, Calendar } from 'lucide-react'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { LoanCalculator } from './components/LoanCalculator'
import { PaymentHistory } from './components/PaymentHistory'
import { LoanSettings } from './components/LoanSettings'
import { NewLoanForm } from './components/NewLoanForm'
import { LoanPaymentHistory } from './components/LoanPaymentHistory' // Import the new component

interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleInfo: string;
  amount: number;
  downPayment: number;
  term: number;
  rate: number;
  paymentAmount: number;
  startDate: Date;
  status: string;
  remainingBalance: number;
  nextPaymentDate: Date;
  createdAt: Date;
  payments:

