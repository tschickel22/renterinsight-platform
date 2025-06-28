/*
  # Platform Admin Enhancement Schema

  1. New Tables
    - `admin_settings` - Global platform settings
    - `role_permissions` - Role-based permissions
    - `tenant_settings_overrides` - Tenant-specific setting overrides
    - `field_permissions` - Field-level permissions
    - `system_alerts` - System-wide alerts and notifications
    - `audit_logs` - System audit logging

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  is_tenant_overridable boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage admin settings"
  ON admin_settings
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Role Permissions Table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  resource text NOT NULL,
  action text NOT NULL,
  conditions jsonb DEFAULT '{}'::jsonb,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(role, resource, action, tenant_id)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage role permissions"
  ON role_permissions
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Tenant Settings Overrides
CREATE TABLE IF NOT EXISTS tenant_settings_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  setting_key text NOT NULL REFERENCES admin_settings(key),
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, setting_key)
);

ALTER TABLE tenant_settings_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage tenant settings overrides"
  ON tenant_settings_overrides
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Field Permissions
CREATE TABLE IF NOT EXISTS field_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  module text NOT NULL,
  field_name text NOT NULL,
  can_view boolean DEFAULT true,
  can_edit boolean DEFAULT false,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(role, module, field_name, tenant_id)
);

ALTER TABLE field_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage field permissions"
  ON field_permissions
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- System Alerts
CREATE TABLE IF NOT EXISTS system_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  target_roles text[] DEFAULT '{}'::text[],
  target_tenants uuid[] DEFAULT '{}'::uuid[],
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage system alerts"
  ON system_alerts
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view relevant system alerts"
  ON system_alerts
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    (start_date <= now()) AND
    (end_date IS NULL OR end_date >= now()) AND
    (
      array_length(target_roles, 1) IS NULL OR
      auth.jwt() ->> 'role' = ANY(target_roles) OR
      'all' = ANY(target_roles)
    ) AND
    (
      array_length(target_tenants, 1) IS NULL OR
      (auth.jwt() ->> 'tenant_id')::uuid = ANY(target_tenants) OR
      '00000000-0000-0000-0000-000000000000'::uuid = ANY(target_tenants)
    )
  );

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource text NOT NULL,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Tenant admins can view their tenant's audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'manager')
  );

-- Create function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  action text,
  resource text,
  resource_id text DEFAULT NULL,
  details jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO audit_logs (
    user_id,
    tenant_id,
    action,
    resource,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    (auth.jwt() ->> 'tenant_id')::uuid,
    action,
    resource,
    resource_id,
    details,
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent'
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some default admin settings
INSERT INTO admin_settings (key, value, description, is_tenant_overridable)
VALUES 
  ('system.maintenance_mode', 'false'::jsonb, 'Enable maintenance mode for the entire platform', false),
  ('system.default_user_role', '"user"'::jsonb, 'Default role for new users', true),
  ('system.password_policy', '{"min_length": 8, "require_uppercase": true, "require_number": true, "require_special": true}'::jsonb, 'Password policy settings', true),
  ('system.session_timeout', '30'::jsonb, 'Session timeout in minutes', true),
  ('system.max_login_attempts', '5'::jsonb, 'Maximum failed login attempts before lockout', true),
  ('system.lockout_duration', '30'::jsonb, 'Account lockout duration in minutes', true),
  ('system.audit_level', '"standard"'::jsonb, 'Audit logging level (minimal, standard, verbose)', true);

-- Insert default role permissions
INSERT INTO role_permissions (role, resource, action, conditions)
VALUES
  ('admin', '*', '*', '{}'::jsonb),
  ('manager', 'leads', '*', '{}'::jsonb),
  ('manager', 'vehicles', '*', '{}'::jsonb),
  ('manager', 'quotes', '*', '{}'::jsonb),
  ('manager', 'agreements', '*', '{}'::jsonb),
  ('manager', 'service_tickets', '*', '{}'::jsonb),
  ('manager', 'deliveries', '*', '{}'::jsonb),
  ('manager', 'commissions', '*', '{}'::jsonb),
  ('manager', 'invoices', '*', '{}'::jsonb),
  ('manager', 'reports', '*', '{}'::jsonb),
  ('sales', 'leads', '*', '{}'::jsonb),
  ('sales', 'vehicles', 'read', '{}'::jsonb),
  ('sales', 'quotes', '*', '{}'::jsonb),
  ('sales', 'agreements', 'read,create', '{}'::jsonb),
  ('sales', 'commissions', 'read', '{}'::jsonb),
  ('service', 'service_tickets', '*', '{}'::jsonb),
  ('service', 'vehicles', 'read,update', '{}'::jsonb),
  ('service', 'invoices', 'read,create', '{}'::jsonb),
  ('user', 'leads', 'read', '{}'::jsonb),
  ('user', 'vehicles', 'read', '{}'::jsonb),
  ('user', 'quotes', 'read', '{}'::jsonb);