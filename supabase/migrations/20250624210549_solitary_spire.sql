/*
  # Initial Schema Setup for Renter Insight CRM

  1. New Tables
    - `leads` - Store lead information with contact details and status
    - `lead_sources` - Define lead sources (website, referral, etc.)
    - `sales_reps` - Sales representative information
    - `lead_activities` - Track all lead interactions and activities
    - `lead_scores` - Store calculated lead scores and factors
    - `lead_reminders` - Reminders and follow-up tasks
    - `vehicles` - RV/Motorhome inventory
    - `quotes` - Customer quotes and proposals
    - `quote_items` - Line items for quotes
    - `agreements` - Contracts and agreements
    - `service_tickets` - Service requests and maintenance
    - `service_parts` - Parts used in service
    - `service_labor` - Labor charges for service
    - `deliveries` - Delivery tracking
    - `commissions` - Sales commission tracking
    - `invoices` - Customer invoices
    - `invoice_items` - Invoice line items
    - `payments` - Payment records
    - `reports` - Generated reports

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on tenant isolation
    - Ensure users can only access data from their tenant

  3. Indexes
    - Add performance indexes for common queries
    - Foreign key constraints for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales', 'service', 'user');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE vehicle_type AS ENUM ('rv', 'motorhome', 'travel_trailer', 'fifth_wheel', 'toy_hauler');
CREATE TYPE vehicle_status AS ENUM ('available', 'reserved', 'sold', 'service', 'delivered');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired');
CREATE TYPE agreement_type AS ENUM ('purchase', 'lease', 'service', 'warranty');
CREATE TYPE agreement_status AS ENUM ('draft', 'pending', 'signed', 'active', 'expired', 'cancelled');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE service_status AS ENUM ('open', 'in_progress', 'waiting_parts', 'completed', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('scheduled', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE commission_type AS ENUM ('flat', 'percentage', 'tiered');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'check', 'credit_card', 'bank_transfer', 'financing');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Lead Sources
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  tracking_code TEXT,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sales Representatives
CREATE TABLE IF NOT EXISTS sales_reps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  territory TEXT,
  is_active BOOLEAN DEFAULT true,
  monthly_target INTEGER DEFAULT 0,
  quarterly_target INTEGER DEFAULT 0,
  annual_target INTEGER DEFAULT 0,
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT NOT NULL,
  source_id UUID REFERENCES lead_sources(id),
  status lead_status DEFAULT 'new',
  assigned_to UUID REFERENCES sales_reps(id),
  notes TEXT DEFAULT '',
  score INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT now(),
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lead Activities
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT,
  duration INTEGER,
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead Scores
CREATE TABLE IF NOT EXISTS lead_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL DEFAULT 0,
  demographic_score INTEGER DEFAULT 0,
  behavior_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  factors JSONB DEFAULT '[]',
  last_calculated TIMESTAMPTZ DEFAULT now(),
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead Reminders
CREATE TABLE IF NOT EXISTS lead_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  priority priority_level DEFAULT 'medium',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  type vehicle_type NOT NULL,
  status vehicle_status DEFAULT 'available',
  price DECIMAL(12,2) NOT NULL,
  cost DECIMAL(12,2) NOT NULL,
  location TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES leads(id),
  vehicle_id UUID REFERENCES vehicles(id),
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  status quote_status DEFAULT 'draft',
  valid_until TIMESTAMPTZ NOT NULL,
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quote Items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agreements
CREATE TABLE IF NOT EXISTS agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type agreement_type NOT NULL,
  customer_id UUID NOT NULL REFERENCES leads(id),
  vehicle_id UUID REFERENCES vehicles(id),
  quote_id UUID REFERENCES quotes(id),
  status agreement_status DEFAULT 'draft',
  signed_date TIMESTAMPTZ,
  effective_date TIMESTAMPTZ NOT NULL,
  expiration_date TIMESTAMPTZ,
  terms TEXT NOT NULL,
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Service Tickets
CREATE TABLE IF NOT EXISTS service_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES leads(id),
  vehicle_id UUID REFERENCES vehicles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority priority_level DEFAULT 'medium',
  status service_status DEFAULT 'open',
  assigned_to UUID REFERENCES sales_reps(id),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Service Parts
CREATE TABLE IF NOT EXISTS service_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_ticket_id UUID NOT NULL REFERENCES service_tickets(id) ON DELETE CASCADE,
  part_number TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Service Labor
CREATE TABLE IF NOT EXISTS service_labor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_ticket_id UUID NOT NULL REFERENCES service_tickets(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  rate DECIMAL(8,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Deliveries
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES leads(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  status delivery_status DEFAULT 'scheduled',
  scheduled_date TIMESTAMPTZ NOT NULL,
  delivered_date TIMESTAMPTZ,
  address JSONB NOT NULL,
  driver TEXT,
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Commissions
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sales_person_id UUID NOT NULL REFERENCES sales_reps(id),
  deal_id TEXT NOT NULL,
  type commission_type NOT NULL,
  rate DECIMAL(5,4) DEFAULT 0,
  amount DECIMAL(12,2) NOT NULL,
  status commission_status DEFAULT 'pending',
  paid_date TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES leads(id),
  number TEXT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  status invoice_status DEFAULT 'draft',
  due_date TIMESTAMPTZ NOT NULL,
  paid_date TIMESTAMPTZ,
  payment_method TEXT,
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  amount DECIMAL(12,2) NOT NULL,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT,
  processed_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL DEFAULT auth.jwt() ->> 'tenant_id',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for tenant isolation
CREATE POLICY "Users can access their tenant's lead sources"
  ON lead_sources FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's sales reps"
  ON sales_reps FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's leads"
  ON leads FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's lead activities"
  ON lead_activities FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's lead scores"
  ON lead_scores FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's lead reminders"
  ON lead_reminders FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's quote items"
  ON quote_items FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's agreements"
  ON agreements FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's service tickets"
  ON service_tickets FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's service parts"
  ON service_parts FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's service labor"
  ON service_labor FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's deliveries"
  ON deliveries FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's commissions"
  ON commissions FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's invoice items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's payments"
  ON payments FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_source_id ON leads(source_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_tenant_id ON lead_activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_vehicles_tenant_id ON vehicles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);

CREATE INDEX IF NOT EXISTS idx_quotes_tenant_id ON quotes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

CREATE INDEX IF NOT EXISTS idx_service_tickets_tenant_id ON service_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_customer_id ON service_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_status ON service_tickets(status);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(number);