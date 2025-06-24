/*
  # Seed Initial Data

  1. Lead Sources
    - Common lead sources for RV dealerships
  
  2. Sales Representatives
    - Sample sales team members
  
  3. Sample Data
    - A few sample leads and vehicles for testing
*/

-- Insert default lead sources
INSERT INTO lead_sources (name, type, tracking_code, conversion_rate) VALUES
  ('Website Contact Form', 'website', 'WEB_CONTACT', 15.5),
  ('Facebook Ads', 'advertising', 'FB_ADS', 8.2),
  ('Customer Referral', 'referral', NULL, 35.8),
  ('RV Show', 'event', 'RV_SHOW_2024', 22.1),
  ('Google Ads', 'advertising', 'GOOGLE_ADS', 12.3),
  ('Walk-in', 'other', NULL, 45.2),
  ('Phone Inquiry', 'phone', 'PHONE_INQ', 18.7),
  ('Email Campaign', 'email', 'EMAIL_CAMP', 9.4)
ON CONFLICT DO NOTHING;

-- Insert sample sales representatives
INSERT INTO sales_reps (name, email, phone, territory, monthly_target, quarterly_target, annual_target) VALUES
  ('John Smith', 'john.smith@dealership.com', '(555) 123-4567', 'North Region', 10, 30, 120),
  ('Sarah Johnson', 'sarah.johnson@dealership.com', '(555) 987-6543', 'South Region', 12, 36, 144),
  ('Mike Davis', 'mike.davis@dealership.com', '(555) 456-7890', 'East Region', 8, 24, 96),
  ('Lisa Wilson', 'lisa.wilson@dealership.com', '(555) 321-0987', 'West Region', 11, 33, 132)
ON CONFLICT DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (vin, make, model, year, type, price, cost, location, features, images) VALUES
  ('1FDXE4FS8KDC12345', 'Forest River', 'Georgetown', 2024, 'motorhome', 125000.00, 95000.00, 'Lot A-15', 
   ARRAY['Slide-out', 'Generator', 'Solar Panel'], 
   ARRAY['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg']),
  ('1FDXE4FS8KDC67890', 'Winnebago', 'View', 2023, 'rv', 89000.00, 72000.00, 'Lot B-08', 
   ARRAY['Compact Design', 'Fuel Efficient'], 
   ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg']),
  ('1FDXE4FS8KDC11111', 'Jayco', 'Eagle', 2024, 'travel_trailer', 45000.00, 35000.00, 'Lot C-12', 
   ARRAY['Lightweight', 'Bunk Beds', 'Outdoor Kitchen'], 
   ARRAY['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg']),
  ('1FDXE4FS8KDC22222', 'Grand Design', 'Solitude', 2023, 'fifth_wheel', 78000.00, 62000.00, 'Lot D-05', 
   ARRAY['Residential Refrigerator', 'King Bed', 'Fireplace'], 
   ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'])
ON CONFLICT (vin) DO NOTHING;