// src/modules/finance/components/LoanSettings.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Save, CreditCard, FileText, AlertTriangle, Shield, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function LoanSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('general')
  
  // General settings
  const [defaultInterestRate, setDefaultInterestRate] = useState(6.99)
  const [maxLoanTerm, setMaxLoanTerm] = useState(84)
  const [minDownPaymentPercent, setMinDownPaymentPercent] = useState(10)
  const [defaultPaymentFrequency, setDefaultPaymentFrequency] = useState('monthly')
  
  // Buy Here Pay Here settings
  const [bhphEnabled, setBhphEnabled] = useState(true)
  const [bhphInterestRate, setBhphInterestRate] = useState(12.99)
  const [bhphMaxLoanTerm, setBhphMaxLoanTerm] = useState(48)
  const [bhphMinDownPaymentPercent, setBhphMinDownPaymentPercent] = useState(20)
  const [bhphRequireIncome, setBhphRequireIncome] = useState(true)
  const [bhphRequireReference, setBhphRequireReference] = useState(true)
  
  // Payment settings
  const [allowAutoPay, setAllowAutoPay] = useState(true)
  const [allowOnlinePayments, setAllowOnlinePayments] = useState(true)
  const [allowPartialPayments, setAllowPartialPayments] = useState(true)
  const [gracePeriodDays, setGracePeriodDays] = useState(10)
  const [lateFeeAmount, setLateFeeAmount] = useState(25)
  const [lateFeeType, setLateFeeType] = useState('fixed')
  
  // Document settings
  const [loanAgreementTemplate, setLoanAgreementTemplate] = useState('')
  const [requireSignature, setRequireSignature] = useState(true)
  const [sendPaymentReceipts, setSendPaymentReceipts] = useState(true)
  const [sendPaymentReminders, setSendPaymentReminders] = useState(true)
  const [reminderDaysBefore, setReminderDaysBefore] = useState(5)

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings Saved",
      description: "Your loan settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="bhph">Buy Here Pay Here</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                General Loan Settings
              </CardTitle>
              <CardDescription>
                Configure default loan parameters and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="defaultInterestRate">Default Interest Rate (%)</Label>
                  <Input
                    id="defaultInterestRate"
                    type="number"
                    step="0.01"
                    value={defaultInterestRate}
                    onChange={(e) => setDefaultInterestRate(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Standard interest rate for new loans
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="maxLoanTerm">Maximum Loan Term (months)</Label>
                  <Input
                    id="maxLoanTerm"
                    type="number"
                    value={maxLoanTerm}
                    onChange={(e) => setMaxLoanTerm(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Longest allowed loan term in months
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="minDownPaymentPercent">Minimum Down Payment (%)</Label>
                  <Input
                    id="minDownPaymentPercent"
                    type="number"
                    value={minDownPaymentPercent}
                    onChange={(e) => setMinDownPaymentPercent(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum required down payment as percentage of vehicle price
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="defaultPaymentFrequency">Default Payment Frequency</Label>
                  <Select
                    value={defaultPaymentFrequency}
                    onValueChange={setDefaultPaymentFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Standard payment schedule for new loans
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bhph" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Buy Here Pay Here Settings
              </CardTitle>
              <CardDescription>
                Configure in-house financing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bhphEnabled"
                  checked={bhphEnabled}
                  onCheckedChange={(checked) => setBhphEnabled(!!checked)}
                />
                <Label htmlFor="bhphEnabled">Enable Buy Here Pay Here Financing</Label>
              </div>
              
              {bhphEnabled && (
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div>
                    <Label htmlFor="bhphInterestRate">BHPH Interest Rate (%)</Label>
                    <Input
                      id="bhphInterestRate"
                      type="number"
                      step="0.01"
                      value={bhphInterestRate}
                      onChange={(e) => setBhphInterestRate(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Standard interest rate for in-house loans
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="bhphMaxLoanTerm">BHPH Maximum Term (months)</Label>
                    <Input
                      id="bhphMaxLoanTerm"
                      type="number"
                      value={bhphMaxLoanTerm}
                      onChange={(e) => setBhphMaxLoanTerm(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum term for in-house financing
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="bhphMinDownPaymentPercent">BHPH Minimum Down Payment (%)</Label>
                    <Input
                      id="bhphMinDownPaymentPercent"
                      type="number"
                      value={bhphMinDownPaymentPercent}
                      onChange={(e) => setBhphMinDownPaymentPercent(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum down payment for in-house financing
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bhphRequireIncome"
                        checked={bhphRequireIncome}
                        onCheckedChange={(checked) => setBhphRequireIncome(!!checked)}
                      />
                      <Label htmlFor="bhphRequireIncome">Require Income Verification</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bhphRequireReference"
                        checked={bhphRequireReference}
                        onCheckedChange={(checked) => setBhphRequireReference(!!checked)}
                      />
                      <Label htmlFor="bhphRequireReference">Require References</Label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-50 p-4 rounded-md mt-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Buy Here Pay Here financing is subject to state and federal regulations. 
                      Ensure your dealership complies with all applicable laws including 
                      Truth in Lending Act (TILA), Fair Credit Reporting Act (FCRA), and 
                      state-specific lending requirements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment options and late fee policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowAutoPay"
                      checked={allowAutoPay}
                      onCheckedChange={(checked) => setAllowAutoPay(!!checked)}
                    />
                    <Label htmlFor="allowAutoPay">Allow Automatic Payments</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowOnlinePayments"
                      checked={allowOnlinePayments}
                      onCheckedChange={(checked) => setAllowOnlinePayments(!!checked)}
                    />
                    <Label htmlFor="allowOnlinePayments">Allow Online Payments</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowPartialPayments"
                      checked={allowPartialPayments}
                      onCheckedChange={(checked) => setAllowPartialPayments(!!checked)}
                    />
                    <Label htmlFor="allowPartialPayments">Allow Partial Payments</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="gracePeriodDays">Grace Period (days)</Label>
                  <Input
                    id="gracePeriodDays"
                    type="number"
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Days after due date before late fee applies
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="lateFeeType">Late Fee Type</Label>
                  <Select
                    value={lateFeeType}
                    onValueChange={setLateFeeType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="percentage">Percentage of Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="lateFeeAmount">
                    {lateFeeType === 'fixed' ? 'Late Fee Amount ($)' : 'Late Fee Percentage (%)'}
                  </Label>
                  <Input
                    id="lateFeeAmount"
                    type="number"
                    step={lateFeeType === 'percentage' ? '0.01' : '1'}
                    value={lateFeeAmount}
                    onChange={(e) => setLateFeeAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Document Settings
              </CardTitle>
              <CardDescription>
                Configure loan documents and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loanAgreementTemplate">Loan Agreement Template</Label>
                <Textarea
                  id="loanAgreementTemplate"
                  value={loanAgreementTemplate}
                  onChange={(e) => setLoanAgreementTemplate(e.target.value)}
                  placeholder="Enter your loan agreement template text or HTML..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can use variables like &#123;&#123;customer_name&#125;&#125;, &#123;&#123;loan_amount&#125;&#125;, &#123;&#123;interest_rate&#125;&#125;, etc.
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireSignature"
                      checked={requireSignature}
                      onCheckedChange={(checked) => setRequireSignature(!!checked)}
                    />
                    <Label htmlFor="requireSignature">Require Digital Signature</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendPaymentReceipts"
                      checked={sendPaymentReceipts}
                      onCheckedChange={(checked) => setSendPaymentReceipts(!!checked)}
                    />
                    <Label htmlFor="sendPaymentReceipts">Send Payment Receipts</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendPaymentReminders"
                      checked={sendPaymentReminders}
                      onCheckedChange={(checked) => setSendPaymentReminders(!!checked)}
                    />
                    <Label htmlFor="sendPaymentReminders">Send Payment Reminders</Label>
                  </div>
                </div>
                
                {sendPaymentReminders && (
                  <div>
                    <Label htmlFor="reminderDaysBefore">Reminder Days Before Due</Label>
                    <Input
                      id="reminderDaysBefore"
                      type="number"
                      value={reminderDaysBefore}
                      onChange={(e) => setReminderDaysBefore(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of days before due date to send reminder
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Compliance Notice</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Ensure your loan documents comply with all applicable laws and regulations.
                      Consider consulting with legal counsel to review your loan agreement templates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
