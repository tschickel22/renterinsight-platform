export const defaultSettings = {
  general: {
    platformName: 'Renter Insight',
    supportEmail: 'support@renterinsight.com',
    supportPhone: '(555) 123-4567',
    maintenanceMode: false,
    maintenanceMessage: 'The system is currently undergoing scheduled maintenance. Please try again later.',
    defaultTimezone: 'America/New_York',
    defaultCurrency: 'USD',
    defaultDateFormat: 'MM/dd/yyyy',
    defaultLanguage: 'en-US'
  },
  email: {
    provider: 'default',
    fromEmail: 'noreply@renterinsight.com',
    fromName: 'Renter Insight',
    replyToEmail: 'support@renterinsight.com',
    footerText: 'This email was sent from Renter Insight CRM/DMS.',
    maxDailyEmails: 10000,
    throttleRate: 100, // emails per minute
    enableTracking: true,
    trackOpens: true,
    trackClicks: true,
    enableUnsubscribe: true,
    unsubscribeLink: true,
    unsubscribeText: 'To unsubscribe from these emails, click here.'
  },
  sms: {
    provider: 'default',
    fromNumber: '+15551234567',
    enableTracking: true,
    maxDailySms: 5000,
    throttleRate: 50, // SMS per minute
    defaultCountryCode: '+1',
    optOutText: 'Reply STOP to opt out.',
    helpText: 'Reply HELP for help.',
    complianceEnabled: true
  },
  security: {
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90, // days
      preventReuse: 5 // previous passwords
    },
    twoFactorAuth: {
      enabled: false,
      required: false,
      methods: ['email', 'authenticator']
    },
    ipWhitelist: [],
    apiRateLimit: 100 // requests per minute
  },
  payment: {
    providers: ['zego'],
    defaultProvider: 'zego',
    testMode: true,
    autoCapture: true,
    allowPartialPayments: false,
    minimumPaymentAmount: 1.00,
    paymentMethods: ['credit_card', 'bank_transfer'],
    processingFee: {
      type: 'percentage', // 'percentage' or 'fixed'
      value: 2.9,
      additional: 0.30 // additional fixed fee
    },
    invoicePrefix: 'INV-',
    receiptPrefix: 'RCPT-',
    defaultDueDays: 30
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: false,
    defaultEvents: {
      newLead: ['email'],
      newQuote: ['email'],
      quoteAccepted: ['email', 'sms'],
      invoiceCreated: ['email'],
      paymentReceived: ['email', 'sms'],
      serviceScheduled: ['email', 'sms'],
      deliveryScheduled: ['email', 'sms']
    },
    reminderSchedule: {
      invoiceDue: [7, 3, 1], // days before
      appointmentReminder: [1], // days before
      deliveryReminder: [1] // days before
    }
  },
  integrations: {
    crm: {
      enabled: false,
      provider: '',
      apiKey: '',
      webhookUrl: ''
    },
    accounting: {
      enabled: false,
      provider: '',
      apiKey: '',
      webhookUrl: ''
    },
    calendar: {
      enabled: false,
      provider: '',
      apiKey: '',
      webhookUrl: ''
    }
  }
}

export type PlatformSettings = typeof defaultSettings

export type SettingsCategory = keyof typeof defaultSettings