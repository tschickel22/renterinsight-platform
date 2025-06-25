/*
  # PDI Checklist System

  1. New Tables
    - `pdi_templates` - Stores checklist templates for different vehicle types
    - `pdi_template_sections` - Sections within a template
    - `pdi_template_items` - Individual checklist items within sections
    - `pdi_inspections` - Actual PDI inspections performed
    - `pdi_inspection_items` - Results for each checklist item
    - `pdi_defects` - Tracks defects found during inspections
    - `pdi_photos` - Photos taken during inspections
    - `pdi_signoffs` - Approval signatures for completed inspections

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users within the same tenant
*/

-- PDI Templates
CREATE TABLE IF NOT EXISTS pdi_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  vehicle_type vehicle_type NOT NULL,
  is_active boolean DEFAULT true,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PDI Template Sections
CREATE TABLE IF NOT EXISTS pdi_template_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES pdi_templates(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- PDI Template Items
CREATE TABLE IF NOT EXISTS pdi_template_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES pdi_template_sections(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  item_type text NOT NULL DEFAULT 'checkbox', -- checkbox, text, number, photo
  is_required boolean DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- PDI Inspections
CREATE TABLE IF NOT EXISTS pdi_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES pdi_templates(id),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id),
  inspector_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL DEFAULT 'in_progress', -- in_progress, completed, approved, rejected
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  notes text,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PDI Inspection Items
CREATE TABLE IF NOT EXISTS pdi_inspection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES pdi_inspections(id) ON DELETE CASCADE,
  template_item_id uuid NOT NULL REFERENCES pdi_template_items(id),
  status text NOT NULL DEFAULT 'pending', -- pending, passed, failed, na
  value text, -- For text, number inputs
  notes text,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PDI Defects
CREATE TABLE IF NOT EXISTS pdi_defects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES pdi_inspections(id) ON DELETE CASCADE,
  inspection_item_id uuid REFERENCES pdi_inspection_items(id),
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  status text NOT NULL DEFAULT 'open', -- open, in_progress, resolved, verified
  assigned_to uuid REFERENCES users(id),
  resolved_at timestamptz,
  resolution_notes text,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PDI Photos
CREATE TABLE IF NOT EXISTS pdi_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES pdi_inspections(id) ON DELETE CASCADE,
  inspection_item_id uuid REFERENCES pdi_inspection_items(id),
  defect_id uuid REFERENCES pdi_defects(id),
  url text NOT NULL,
  caption text,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- PDI Signoffs
CREATE TABLE IF NOT EXISTS pdi_signoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES pdi_inspections(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  role text NOT NULL, -- inspector, manager, quality_control
  signature_url text,
  notes text,
  signed_at timestamptz DEFAULT now(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pdi_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_signoffs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can access their tenant's PDI templates"
  ON pdi_templates
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI template sections"
  ON pdi_template_sections
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI template items"
  ON pdi_template_items
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI inspections"
  ON pdi_inspections
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI inspection items"
  ON pdi_inspection_items
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI defects"
  ON pdi_defects
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI photos"
  ON pdi_photos
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Users can access their tenant's PDI signoffs"
  ON pdi_signoffs
  FOR ALL
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Insert default templates for different vehicle types
DO $$
DECLARE
  tenant_id uuid := '00000000-0000-0000-0000-000000000000'; -- This will be replaced with actual tenant ID in real usage
  rv_template_id uuid;
  motorhome_template_id uuid;
  travel_trailer_template_id uuid;
  fifth_wheel_template_id uuid;
  toy_hauler_template_id uuid;
  
  -- Section IDs for RV template
  rv_exterior_id uuid;
  rv_interior_id uuid;
  rv_mechanical_id uuid;
  rv_electrical_id uuid;
  rv_plumbing_id uuid;
  rv_final_id uuid;
BEGIN
  -- Create RV template
  INSERT INTO pdi_templates (name, description, vehicle_type, tenant_id)
  VALUES ('RV Pre-Delivery Inspection', 'Standard PDI checklist for recreational vehicles', 'rv', tenant_id)
  RETURNING id INTO rv_template_id;
  
  -- Create sections for RV template
  INSERT INTO pdi_template_sections (template_id, name, description, order_index, tenant_id)
  VALUES 
    (rv_template_id, 'Exterior', 'Exterior inspection items', 1, tenant_id),
    (rv_template_id, 'Interior', 'Interior inspection items', 2, tenant_id),
    (rv_template_id, 'Mechanical', 'Engine and mechanical systems', 3, tenant_id),
    (rv_template_id, 'Electrical', 'Electrical systems and components', 4, tenant_id),
    (rv_template_id, 'Plumbing', 'Water and waste systems', 5, tenant_id),
    (rv_template_id, 'Final Checks', 'Final verification and road test', 6, tenant_id)
  RETURNING id INTO rv_exterior_id, rv_interior_id, rv_mechanical_id, rv_electrical_id, rv_plumbing_id, rv_final_id;
  
  -- Create items for Exterior section
  INSERT INTO pdi_template_items (section_id, name, description, item_type, is_required, order_index, tenant_id)
  VALUES
    (rv_exterior_id, 'Exterior Body Condition', 'Check for scratches, dents, or damage', 'checkbox', true, 1, tenant_id),
    (rv_exterior_id, 'Roof Inspection', 'Check roof seals, vents, and AC units', 'checkbox', true, 2, tenant_id),
    (rv_exterior_id, 'Awning Operation', 'Test awning extension and retraction', 'checkbox', true, 3, tenant_id),
    (rv_exterior_id, 'Exterior Lights', 'Check all exterior lights for proper operation', 'checkbox', true, 4, tenant_id),
    (rv_exterior_id, 'Slide-Outs', 'Test all slide-outs for proper operation', 'checkbox', true, 5, tenant_id),
    (rv_exterior_id, 'Exterior Photos', 'Take photos of all sides of the vehicle', 'photo', true, 6, tenant_id),
    (rv_exterior_id, 'Tires', 'Check tire condition and pressure', 'checkbox', true, 7, tenant_id),
    (rv_exterior_id, 'Exterior Notes', 'Additional notes about exterior condition', 'text', false, 8, tenant_id);

  -- Create items for Interior section
  INSERT INTO pdi_template_items (section_id, name, description, item_type, is_required, order_index, tenant_id)
  VALUES
    (rv_interior_id, 'Interior Cleanliness', 'Verify interior is clean and free of debris', 'checkbox', true, 1, tenant_id),
    (rv_interior_id, 'Furniture Condition', 'Check all furniture for damage or defects', 'checkbox', true, 2, tenant_id),
    (rv_interior_id, 'Window Operation', 'Test all windows for proper operation', 'checkbox', true, 3, tenant_id),
    (rv_interior_id, 'Blinds/Shades', 'Verify all blinds and shades work properly', 'checkbox', true, 4, tenant_id),
    (rv_interior_id, 'Interior Lights', 'Test all interior lights', 'checkbox', true, 5, tenant_id),
    (rv_interior_id, 'Smoke/CO Detectors', 'Test smoke and carbon monoxide detectors', 'checkbox', true, 6, tenant_id),
    (rv_interior_id, 'Interior Photos', 'Take photos of interior areas', 'photo', true, 7, tenant_id),
    (rv_interior_id, 'Interior Notes', 'Additional notes about interior condition', 'text', false, 8, tenant_id);

  -- Create items for Mechanical section
  INSERT INTO pdi_template_items (section_id, name, description, item_type, is_required, order_index, tenant_id)
  VALUES
    (rv_mechanical_id, 'Engine Operation', 'Start engine and check for proper operation', 'checkbox', true, 1, tenant_id),
    (rv_mechanical_id, 'Fluid Levels', 'Check all fluid levels', 'checkbox', true, 2, tenant_id),
    (rv_mechanical_id, 'Battery Condition', 'Check battery condition and connections', 'checkbox', true, 3, tenant_id),
    (rv_mechanical_id, 'Generator Operation', 'Test generator startup and operation', 'checkbox', true, 4, tenant_id),
    (rv_mechanical_id, 'Brakes', 'Check brake operation and fluid level', 'checkbox', true, 5, tenant_id),
    (rv_mechanical_id, 'Mechanical Photos', 'Take photos of engine and mechanical components', 'photo', true, 6, tenant_id),
    (rv_mechanical_id, 'Mechanical Notes', 'Additional notes about mechanical systems', 'text', false, 7, tenant_id);

  -- Create items for Electrical section
  INSERT INTO pdi_template_items (section_id, name, description, item_type, is_required, order_index, tenant_id)
  VALUES
    (rv_electrical_id, 'Shore Power Connection', 'Test shore power connection and operation', 'checkbox', true, 1, tenant_id),
    (rv_electrical_id, 'Inverter Operation', 'Test inverter functionality', 'checkbox', true, 2, tenant_id),
    (rv_electrical_id, 'AC/Heat Pump', 'Test air conditioning and heat pump operation', 'checkbox', true, 3, tenant_id),
    (rv_electrical_id, 'Refrigerator', 'Test refrigerator on all power sources', 'checkbox', true, 4, tenant_id),
    (rv_electrical_id, 'Microwave/Stove', 'Test microwave and stove operation', 'checkbox', true, 5, tenant_id),
    (rv_electrical_id, 'TV/Entertainment System', 'Test TV and entertainment systems', 'checkbox', true, 6, tenant_id),
    (rv_electrical_id, 'Electrical Photos', 'Take photos of electrical components and panels', 'photo', true, 7, tenant_id),
    (rv_electrical_id, 'Electrical Notes', 'Additional notes about electrical systems', 'text', false, 8, tenant_id);

  -- Create items for Plumbing section
  INSERT INTO pdi_template_items (section_id, name, description, item_type, is_required, order_index, tenant_id)
  VALUES
    (rv_plumbing_id, 'Fresh Water System', 'Test fresh water system for leaks and proper operation', 'checkbox', true, 1, tenant_id),
    (rv_plumbing_id, 'Water Heater', 'Test water heater on all power sources', 'checkbox', true, 2, tenant_id),
    (rv_plumbing_id, 'Toilet Operation', 'Check toilet operation and seal', 'checkbox', true, 3, tenant_id),
    (rv_plumbing_id, 'Shower/Sink Drains', 'Test all drains for proper operation', 'checkbox', true, 4, tenant_id),
    (rv_plumbing_id, 'Black/Gray Tanks', 'Check tank monitors and valves', 'checkbox', true, 5, tenant_id),
    (rv_plumbing_id, 'Plumbing Photos', 'Take photos of plumbing components', 'photo', true, 6, tenant_id),
    (rv_plumbing_id, 'Plumbing Notes', 'Additional notes about plumbing systems', 'text', false, 7, tenant_id);

  -- Create items for Final Checks section
  INSERT INTO pdi_template_items (section_id, name, description, item_type, is_required, order_index, tenant_id)
  VALUES
    (rv_final_id, 'Road Test', 'Perform road test to verify proper operation', 'checkbox', true, 1, tenant_id),
    (rv_final_id, 'Owner\'s Manual', 'Verify owner\'s manual and documentation is present', 'checkbox', true, 2, tenant_id),
    (rv_final_id, 'Keys/Remotes', 'Verify all keys and remotes are present and functional', 'checkbox', true, 3, tenant_id),
    (rv_final_id, 'Final Cleaning', 'Verify final cleaning has been completed', 'checkbox', true, 4, tenant_id),
    (rv_final_id, 'Customer Walkthrough', 'Ready for customer walkthrough', 'checkbox', true, 5, tenant_id),
    (rv_final_id, 'Final Notes', 'Additional notes for delivery preparation', 'text', false, 6, tenant_id);

  -- Create Motorhome template
  INSERT INTO pdi_templates (name, description, vehicle_type, tenant_id)
  VALUES ('Motorhome Pre-Delivery Inspection', 'Comprehensive PDI checklist for motorhomes', 'motorhome', tenant_id)
  RETURNING id INTO motorhome_template_id;
  
  -- Create Travel Trailer template
  INSERT INTO pdi_templates (name, description, vehicle_type, tenant_id)
  VALUES ('Travel Trailer Pre-Delivery Inspection', 'PDI checklist for travel trailers', 'travel_trailer', tenant_id)
  RETURNING id INTO travel_trailer_template_id;
  
  -- Create Fifth Wheel template
  INSERT INTO pdi_templates (name, description, vehicle_type, tenant_id)
  VALUES ('Fifth Wheel Pre-Delivery Inspection', 'PDI checklist for fifth wheels', 'fifth_wheel', tenant_id)
  RETURNING id INTO fifth_wheel_template_id;
  
  -- Create Toy Hauler template
  INSERT INTO pdi_templates (name, description, vehicle_type, tenant_id)
  VALUES ('Toy Hauler Pre-Delivery Inspection', 'PDI checklist for toy haulers', 'toy_hauler', tenant_id)
  RETURNING id INTO toy_hauler_template_id;
  
  -- Note: Additional sections and items for other templates would be added here
  -- For brevity, we're only showing the full template for RV type
END $$;