export const defaultSettings = {
  // General Settings
  systemName: 'Bolt Platform',
  systemVersion: '1.0.0',
  supportEmail: 'support@bolt.com',
  supportPhone: '+1 (800) 123-4567',
  timezone: 'America/New_York',
  defaultUserRole: 'user',
  maintenanceMode: false,
  maintenanceMessage: 'The system is currently undergoing scheduled maintenance. We will be back shortly.',
  auditLogRetentionDays: 90,
  enableTwoFactorAuth: true,
  sessionTimeoutMinutes: 60,

  // Payment Settings
  currency: 'USD',
  currencySymbol: '$',
  paymentGateway: 'stripe', // 'stripe', 'paypal', 'none'
  stripePublishableKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  paypalClientSecret: '',
  enableSubscriptions: true,
  taxRate: 0.05, // 5%
  enableInvoiceGeneration: true,

  // Security Settings (example, not fully implemented in components yet)
  passwordMinLength: 8,
  passwordRequiresUppercase: true,
  passwordRequiresLowercase: true,
  passwordRequiresNumber: true,
  passwordRequiresSymbol: true,
  accountLockoutAttempts: 5,
  accountLockoutDurationMinutes: 30,

  // Integrations Settings (example)
  googleAnalyticsId: '',
  slackWebhookUrl: '',

  // Notifications Settings (example)
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  defaultEmailSender: 'noreply@bolt.com',

  // Branding Settings (example)
  logoUrl: '',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',

  // Advanced Settings (example)
  debugMode: false,
  logLevel: 'info',
  apiRateLimit: 1000, // requests per minute
  dataRetentionPolicy: '1 year',
}