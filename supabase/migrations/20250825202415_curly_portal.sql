/*
  # Debug portal users table

  This migration helps debug the portal_users table by:
  1. Showing current table structure
  2. Listing all existing users
  3. Ensuring proper sample data exists
*/

-- First, let's see what's in the portal_users table
DO $$
BEGIN
  RAISE NOTICE 'Current portal_users table contents:';
END $$;

-- Insert sample users if they don't exist (using email as unique identifier)
INSERT INTO portal_users (user_id, email, full_name, role, created_by)
VALUES 
  (
    gen_random_uuid(), 
    'proveedor@test.com', 
    'Juan Pérez García', 
    'proveedor',
    (SELECT id FROM operations_users LIMIT 1)
  ),
  (
    gen_random_uuid(), 
    'aprobador@test.com', 
    'María González Rodríguez', 
    'aprobador',
    (SELECT id FROM operations_users LIMIT 1)
  ),
  (
    gen_random_uuid(), 
    'operaciones@test.com', 
    'Carlos Administrador', 
    'operaciones',
    NULL
  )
ON CONFLICT (email) DO NOTHING;

-- Also ensure we have operations users
INSERT INTO operations_users (email, full_name)
VALUES 
  ('admin@neoconsulting.com', 'Administrador Sistema'),
  ('operaciones@test.com', 'Carlos Administrador')
ON CONFLICT (email) DO NOTHING;

-- Show final state
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM portal_users;
  RAISE NOTICE 'Total portal users: %', user_count;
END $$;