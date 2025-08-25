/*
  # Create sample users for testing

  1. New Tables
    - Sample users in `portal_users` table for testing
    - Users for proveedor, aprobador, and operaciones roles
    
  2. Security
    - Uses existing RLS policies
    - Creates users with proper role assignments
    
  3. Test Credentials
    - Proveedor: proveedor@test.com / password123
    - Aprobador: aprobador@test.com / password123  
    - Operaciones: operaciones@test.com / password123
*/

-- Insert sample users into portal_users table
-- Note: You'll need to create these users in Supabase Auth first, then update the user_id values

-- Sample Proveedor User
INSERT INTO portal_users (
  id,
  user_id,
  email,
  full_name,
  role,
  created_by
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111', -- Replace with actual Supabase Auth user_id
  'proveedor@test.com',
  'Juan Pérez García',
  'proveedor',
  NULL
) ON CONFLICT (email) DO NOTHING;

-- Sample Aprobador User  
INSERT INTO portal_users (
  id,
  user_id,
  email,
  full_name,
  role,
  created_by
) VALUES (
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222', -- Replace with actual Supabase Auth user_id
  'aprobador@test.com',
  'María González López',
  'aprobador',
  NULL
) ON CONFLICT (email) DO NOTHING;

-- Sample Operaciones User (Administrator)
INSERT INTO portal_users (
  id,
  user_id,
  email,
  full_name,
  role,
  created_by
) VALUES (
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333', -- Replace with actual Supabase Auth user_id
  'operaciones@test.com',
  'Carlos Rodríguez Admin',
  'operaciones',
  NULL
) ON CONFLICT (email) DO NOTHING;

-- Insert corresponding entries in other tables for the proveedor user
-- Sample supplier for the proveedor user
INSERT INTO proveedores (
  id,
  email_login,
  ruc,
  razon_social,
  nombre_comercial,
  tipo_persona,
  pais,
  direccion,
  tipo_comprobante_emitir,
  contacto_nombre,
  contacto_email,
  contacto_telefono,
  is_active
) VALUES (
  '11111111-1111-1111-1111-111111111111', -- Same as portal_users user_id for proveedor
  'proveedor@test.com',
  '20123456789',
  'Empresa ABC Sociedad Anónima Cerrada',
  'ABC Consulting',
  'juridica',
  'Perú',
  'Av. Javier Prado Este 123, San Isidro, Lima',
  'factura',
  'Juan Pérez García',
  'proveedor@test.com',
  '987654321',
  true
) ON CONFLICT (id) DO NOTHING;

-- Sample bank account for the supplier
INSERT INTO supplier_bank_accounts (
  supplier_id,
  moneda,
  banco,
  numero_cuenta,
  tipo_cuenta,
  codigo_cci,
  is_primary
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'PEN',
  'Banco de Crédito del Perú',
  '194-123456789-0-12',
  'corriente',
  '00219400123456789012',
  true
) ON CONFLICT DO NOTHING;

-- Insert approver in directory
INSERT INTO approver_directory (
  approver_email,
  approver_name,
  area,
  email_login,
  is_active
) VALUES (
  'aprobador@test.com',
  'María González López',
  'Finanzas',
  'aprobador@test.com',
  true
) ON CONFLICT (approver_email) DO NOTHING;

-- Insert operations user
INSERT INTO operations_users (
  email,
  full_name,
  is_active
) VALUES (
  'operaciones@test.com',
  'Carlos Rodríguez Admin',
  true
) ON CONFLICT (email) DO NOTHING;