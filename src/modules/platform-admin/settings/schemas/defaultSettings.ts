export const defaultSettings = {
  general: {
    maintenanceMode: false,
    maintenanceMessage: 'The system is currently undergoing scheduled maintenance. Please try again later.',
    defaultUserRole: 'user',
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    auditLevel: 'standard', // minimal, standard, verbose
    allowMultipleDevices: true,
    requireStrongPasswords: true,
    passwordExpiryDays: 90, // 0 means never expire
    systemName: 'Renter Insight CRM/DMS',
    systemVersion: '1.0.0',
    supportEmail: 'support@renterinsight.com',
    supportPhone: '(555) 123-4567',
    timezone: 'America/New_York'
  },
  email: {
    provider: 'default', // default, sendgrid, mailchimp, mailgun, smtp
    apiKey: '',
    fromAddress: 'noreply@renterinsight.com',
    fromName: 'Renter Insight',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    batchSize: 50,
    rateLimitPerMinute: 100,
    maxRetries: 3,
    retryDelay: 5, // minutes
    logEmails: true,
    testMode: false,
    testRecipient: ''
  },
  sms: {
    provider: 'default', // default, twilio, messagebird, vonage
    apiKey: '',
    fromNumber: '',
    accountSid: '', // for Twilio
    authToken: '', // for Twilio
    batchSize: 25,
    rateLimitPerMinute: 50,
    maxRetries: 3,
    retryDelay: 5, // minutes
    logSms: true,
    testMode: false,
    testRecipient: ''
  },
  payment: {
    providers: ['zego'],
    defaultProvider: 'zego',
    testMode: true,
    autoCapture: true,
    allowPartialPayments: false,
    minimumPaymentAmount: 1.00,
    processingFeePercent: 2.9,
    processingFeeCents: 30,
    absorbFees: false,
    invoiceExpiryDays: 30,
    paymentReminders: true,
    reminderDays:, // days before due date
    pastDueReminders: true,
    pastDueReminderDays:, // days after due date
    allowedPaymentMethods: ['credit_card', 'bank_transfer', 'ach'],
    requireCvv: true,
    requireBillingAddress: true,
    currency: 'USD',
    taxRate: 0,
    taxInclusive: false,
    refundPolicy: 'standard', // standard, no_refunds, custom
    chargebackProtection: true,
    fraudDetection: true,
    webhookSecret: '',
    webhookUrl: '',
    apiKeys: {
      stripe: {
        publishableKey: '',
        secretKey: ''
      },
      zego: {
        apiKey: '',
        secretKey: ''
      },
      paypal: {
        clientId: '',
        clientSecret: ''
      },
      authorize: {
        apiLoginId: '',
        transactionKey: ''
      }
    }
  },
  security: {
    mfaEnabled: false,
    mfaProviders: ['email', 'sms', 'authenticator'],
    passwordResetPolicy: 'email', // email, sms
    ipWhitelistEnabled: false,
    ipWhitelist: [],
    bruteForceProtection: true,
    sessionHijackingProtection: true,
    xssProtection: true,
    csrfProtection: true,
    contentSecurityPolicy: "default-src 'self'",
    rateLimitingEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 60, // seconds
    dataEncryptionEnabled: true,
    encryptionAlgorithm: 'AES-256',
    dataRetentionDays: 365, // 0 means indefinite
    gdprCompliance: true,
    ccpaCompliance: true,
    dataMaskingEnabled: true,
    logRetentionDays: 90,
    securityHeaders: {
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      xXSSProtection: '1; mode=block',
      strictTransportSecurity: 'max-age=31536000; includeSubDomains',
      referrerPolicy: 'no-referrer-when-downgrade'
    }
  },
  integrations: {
    crm: {
      enabled: false,
      provider: 'salesforce', // salesforce, hubspot, zoho
      apiKey: '',
      syncFrequency: 'daily',
      syncDirection: 'two-way'
    },
    accounting: {
      enabled: false,
      provider: 'quickbooks', // quickbooks, xero, freshbooks
      apiKey: '',
      syncFrequency: 'daily',
      syncDirection: 'two-way'
    },
    calendar: {
      enabled: false,
      provider: 'google', // google, outlook
      apiKey: '',
      syncFrequency: 'daily',
      syncDirection: 'two-way'
    },
    documentManagement: {
      enabled: false,
      provider: 'dropbox', // dropbox, google_drive, onedrive
      apiKey: '',
      syncFrequency: 'daily',
      syncDirection: 'two-way'
    }
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    notificationChannels: ['email', 'sms', 'in_app'],
    notificationTemplates: {
      welcome: 'Welcome to our platform!',
      passwordReset: 'Your password has been reset.',
      paymentConfirmation: 'Your payment has been confirmed.',
      newLead: 'You have a new lead!',
      taskAssigned: 'A new task has been assigned to you.'
    }
  },
  branding: {
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#6366F1',
    fontFamily: 'Inter, sans-serif',
    customCss: '',
    loginPageBackground: '',
    emailTemplateHeader: '',
    emailTemplateFooter: ''
  },
  advanced: {
    customScripts: {
      head: '',
      body: ''
    },
    webhooks: [],
    apiRateLimits: {
      enabled: true,
      requestsPerMinute: 1000,
      burstLimit: 200
    },
    dataExportFormat: ['csv', 'json'],
    debugMode: false,
    logLevel: 'info', // debug, info, warn, error
    featureFlags: {},
    maintenanceWindow: {
      enabled: false,
      startTime: '02:00',
      endTime: '04:00',
      dayOfWeek: 'sunday'
    }
  }
}