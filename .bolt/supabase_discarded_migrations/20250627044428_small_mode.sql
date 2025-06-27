/*
  # Create portal_users table

  1. New Tables
    - `portal_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `status` (text)
      - `lead_id` (uuid, references leads)
      - `last_login` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `portal_users` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own portal user data"
  ON portal_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for admins to manage all portal users
CREATE POLICY "Admins can manage all portal users"
  ON portal_users
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'tenant_id'::text) = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND 
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));