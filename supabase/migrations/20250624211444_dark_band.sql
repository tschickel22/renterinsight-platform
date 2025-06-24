/*
  # Complete Renter Insight CRM Database Schema and Seed Data

  1. Database Schema
    - Creates all necessary tables for the CRM system
    - Sets up proper relationships and constraints
    - Enables Row Level Security (RLS)
    - Creates performance indexes

  2. Seed Data
    - Inserts default lead sources
    - Adds sample sales representatives
    - Creates sample vehicles
    - Sets up initial data for testing

  3. Security
    - RLS policies for tenant isolation
    - Proper authentication checks
    - Secure data access patterns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales', 'service', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type AS ENUM ('rv', 'motorhome', 'travel_trailer', 'fifth_wheel', 'toy_hauler');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM ('available', 'reserved', 'sold', 'service', 'delivered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE agreement_type AS ENUM ('purchase', 'lease', 'service', 'warranty');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE agreement_status AS ENUM ('draft', 'pending', 'signed', 'active', 'expired', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE service_status AS ENUM ('open', 'in_progress', 'waiting_parts', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('scheduled', 'in_transit', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE commission_type AS ENUM ('flat', 'percentage', 'tiered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cash', 'check', 'credit_card', 'bank_transfer', 'financing');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tenants table (for multi-tenant support)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lead Sources
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  tracking_code TEXT,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sales Representatives
CREATE TABLE IF NOT EXISTS sales_reps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  territory TEXT,
  is_active BOOLEAN DEFAULT true,
  monthly_target INTEGER DEFAULT 0,
  quarterly_target INTEGER DEFAULT 0,
  annual_target INTEGER DEFAULT 0,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead Reminders
CREATE TABLE IF NOT EXISTS lead_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  priority priority_level DEFAULT 'medium',
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Users can access their own tenant"
  ON tenants FOR ALL
  TO authenticated
  USING (id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their own user record"
  ON users FOR ALL
  TO authenticated
  USING (id = auth.uid());

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
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

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

-- Insert default tenant (for demo purposes)
INSERT INTO tenants (id, name, domain, settings, branding) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo RV Dealership', 'demo.renterinsight.com', 
   '{"timezone": "America/New_York", "currency": "USD", "dateFormat": "MM/dd/yyyy"}',
   '{"primaryColor": "#3b82f6", "secondaryColor": "#64748b", "fontFamily": "Inter"}')
ON CONFLICT (id) DO NOTHING;

-- Insert default lead sources
INSERT INTO lead_sources (name, type, tracking_code, conversion_rate, tenant_id) VALUES
  ('Website Contact Form', 'website', 'WEB_CONTACT', 15.5, '00000000-0000-0000-0000-000000000001'),
  ('Facebook Ads', 'advertising', 'FB_ADS', 8.2, '00000000-0000-0000-0000-000000000001'),
  ('Customer Referral', 'referral', NULL, 35.8, '00000000-0000-0000-0000-000000000001'),
  ('RV Show', 'event', 'RV_SHOW_2024', 22.1, '00000000-0000-0000-0000-000000000001'),
  ('Google Ads', 'advertising', 'GOOGLE_ADS', 12.3, '00000000-0000-0000-0000-000000000001'),
  ('Walk-in', 'other', NULL, 45.2, '00000000-0000-0000-0000-000000000001'),
  ('Phone Inquiry', 'phone', 'PHONE_INQ', 18.7, '00000000-0000-0000-0000-000000000001'),
  ('Email Campaign', 'email', 'EMAIL_CAMP', 9.4, '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Insert sample sales representatives
INSERT INTO sales_reps (name, email, phone, territory, monthly_target, quarterly_target, annual_target, tenant_id) VALUES
  ('John Smith', 'john.smith@dealership.com', '(555) 123-4567', 'North Region', 10, 30, 120, '00000000-0000-0000-0000-000000000001'),
  ('Sarah Johnson', 'sarah.johnson@dealership.com', '(555) 987-6543', 'South Region', 12, 36, 144, '00000000-0000-0000-0000-000000000001'),
  ('Mike Davis', 'mike.davis@dealership.com', '(555) 456-7890', 'East Region', 8, 24, 96, '00000000-0000-0000-0000-000000000001'),
  ('Lisa Wilson', 'lisa.wilson@dealership.com', '(555) 321-0987', 'West Region', 11, 33, 132, '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (vin, make, model, year, type, price, cost, location, features, images, tenant_id) VALUES
  ('1FDXE4FS8KDC12345', 'Forest River', 'Georgetown', 2024, 'motorhome', 125000.00, 95000.00, 'Lot A-15', 
   ARRAY['Slide-out', 'Generator', 'Solar Panel'], 
   ARRAY['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
   '00000000-0000-0000-0000-000000000001'),
  ('1FDXE4FS8KDC67890', 'Winnebago', 'View', 2023, 'rv', 89000.00, 72000.00, 'Lot B-08', 
   ARRAY['Compact Design', 'Fuel Efficient'], 
   ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
   '00000000-0000-0000-0000-000000000001'),
  ('1FDXE4FS8KDC11111', 'Jayco', 'Eagle', 2024, 'travel_trailer', 45000.00, 35000.00, 'Lot C-12', 
   ARRAY['Lightweight', 'Bunk Beds', 'Outdoor Kitchen'], 
   ARRAY['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
   '00000000-0000-0000-0000-000000000001'),
  ('1FDXE4FS8KDC22222', 'Grand Design', 'Solitude', 2023, 'fifth_wheel', 78000.00, 62000.00, 'Lot D-05', 
   ARRAY['Residential Refrigerator', 'King Bed', 'Fireplace'], 
   ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
   '00000000-0000-0000-0000-000000000001')
ON CONFLICT (vin) DO NOTHING;

-- Insert sample leads
INSERT INTO leads (first_name, last_name, email, phone, source, source_id, status, notes, score, custom_fields, tenant_id) VALUES
  ('John', 'Smith', 'john.smith@email.com', '(555) 123-4567', 'Website Contact Form', 
   (SELECT id FROM lead_sources WHERE name = 'Website Contact Form' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
   'new', 'Interested in Class A Motorhome, budget $150k-200k', 85,
   '{"budget": "$150k-200k", "timeframe": "3-6 months", "experience": "First-time buyer"}',
   '00000000-0000-0000-0000-000000000001'),
  ('Sarah', 'Johnson', 'sarah.j@email.com', '(555) 987-6543', 'Customer Referral',
   (SELECT id FROM lead_sources WHERE name = 'Customer Referral' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
   'qualified', 'Looking for travel trailer under $50k, referred by Mike Davis', 92,
   '{"budget": "Under $50k", "timeframe": "1-3 months", "experience": "Experienced RVer"}',
   '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;