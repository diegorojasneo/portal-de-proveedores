/*
  # Update portal users table to include operaciones role

  1. Changes
    - Update role check constraint to include 'operaciones'
    - Add sample operaciones user
  
  2. Security
    - Maintain existing RLS policies
    - Operations users can read all data
*/

-- Update the role constraint to include operaciones
ALTER TABLE portal_users DROP CONSTRAINT IF EXISTS portal_users_role_check;
ALTER TABLE portal_users ADD CONSTRAINT portal_users_role_check 
  CHECK (role IN ('proveedor', 'aprobador', 'operaciones'));

-- Add sample operations user
INSERT INTO portal_users (user_id, email, full_name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440003', 'operaciones@neoconsulting.com', 'Administrador Operaciones', 'operaciones')
ON CONFLICT (email) DO NOTHING;