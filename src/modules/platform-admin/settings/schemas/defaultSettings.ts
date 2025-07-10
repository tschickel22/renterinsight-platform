// src/modules/platform-admin/settings/schemas/defaultSettings.ts
export const defaultSettings = {
  // General Settings
  appName: 'Renter Insight',
  appLogo: '/logo.svg',
  contactEmail: 'support@renterinsight.com',
  contactPhone: '+1 (555) 123-4567',
  address: '123 Main St, Anytown, USA',
  website: 'https://www.renterinsight.com',
  timezone: 'America/Los_Angeles',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'hh:mm A',
  currency: 'USD',
  currencySymbol: '$',
  language: 'en',
  maintenanceMode: false,
  welcomeMessage: 'Welcome to Renter Insight!',

  // Payment Settings
  paymentGateway: 'stripe', // 'stripe', 'paypal', 'none'
  stripePublishableKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  paypalClientSecret: '',
  enableSubscriptions: true,
  taxRate: 0.05, // 5%
  enableInvoiceGeneration: true,

  // SMS Settings
  smsProvider: 'twilio', // 'twilio', 'messagebird', 'none'
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioPhoneNumber: '',
  smsEnabled: true,
  smsTemplates: [], // Placeholder for future template management

  // Email Settings
  emailProvider: 'smtp', // 'smtp', 'sendgrid', 'mailgun', 'none'
  smtpHost: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  smtpSecure: false,
  emailFromAddress: 'noreply@example.com',
  emailFromName: 'Renter Insight',
  emailEnabled: true,
  emailTemplates: [], // Placeholder for future template management

  // Voice Settings
  voiceProvider: 'twilio', // 'twilio', 'none'
  twilioVoiceSid: '',
  twilioVoiceAuthToken: '',
  voiceEnabled: false,

  // Security Settings (example, not fully implemented in components yet)
  passwordMinLength: 8,
  passwordRequiresUppercase: true,
  passwordRequiresLowercase: true,
  passwordRequiresNumber: true,
  passwordRequiresSymbol: true,
  twoFactorAuthEnabled: false,
  sessionTimeout: 3600, // seconds
  failedLoginAttemptsLockout: 5,
  lockoutDuration: 300, // seconds

  // Integrations (example)
  googleMapsApiKey: '',
  slackWebhookUrl: '',

  // Analytics (example)
  googleAnalyticsTrackingId: '',
  mixpanelProjectId: '',

  // Branding (example)
  primaryColor: '#4F46E5', // Indigo 600
  secondaryColor: '#10B981', // Emerald 500
  fontFamily: 'Inter, sans-serif',

  // Other
  termsOfServiceUrl: '/terms',
  privacyPolicyUrl: '/privacy',
  supportPageUrl: '/support',
}
