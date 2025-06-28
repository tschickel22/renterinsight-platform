/*
  # Add Tenant Users Function

  1. New Functions
    - `get_tenant_users` - Function to fetch users for a specific tenant

  2. Security
    - Function is secured to only allow access to users with appropriate permissions
*/

-- Function to get users for a specific tenant
CREATE OR REPLACE FUNCTION get_tenant_users(tenant_id_param uuid)
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  role text,
  avatar_url text,
  is_active boolean,
  created_at timestamptz
) AS $$
BEGIN
  -- Check if the user has permission to view users for this tenant
  IF (auth.jwt() ->> 'role' = 'admin') OR 
     ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id_param AND 
      (auth.jwt() ->> 'role' IN ('admin', 'manager'))) THEN
    
    RETURN QUERY
    SELECT 
      u.id,
      u.email,
      u.name,
      u.role::text,
      u.avatar_url,
      u.is_active,
      u.created_at
    FROM 
      users u
    WHERE 
      u.tenant_id = tenant_id_param
    ORDER BY 
      u.name;
  ELSE
    RAISE EXCEPTION 'Permission denied to view users for this tenant';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_tenant_users(uuid) TO authenticated;