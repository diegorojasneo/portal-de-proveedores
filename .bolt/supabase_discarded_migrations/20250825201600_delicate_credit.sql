/*
  # Add sample users to existing portal_users table

  1. Sample Users
    - Add test users for proveedor, aprobador, and operaciones roles
    - Each user has placeholder user_id that needs to be updated with real Supabase Auth IDs
    
  2. Security
    - Uses existing RLS policies on portal_users table
    - No changes to table structure needed
    
  3. Test Credentials
    - proveedor@test.com (role: proveedor)
    - aprobador@test.com (role: aprobador) 
    - operaciones@test.com (role: operaciones)
*/

-- Insert sample users into existing portal_users table
INSERT INTO portal_users (user_id, email, full_name, role, created_by) VALUES
  (
    'placeholder-proveedor-id',
    'proveedor@test.com',
    'Juan Pérez García',
    'proveedor',
    NULL
  ),
  (
    'placeholder-aprobador-id', 
    'aprobador@test.com',
    'María González Rodríguez',
    'aprobador',
    NULL
  ),
  (
    'placeholder-operaciones-id',
    'operaciones@test.com', 
    'Carlos Administrador',
    'operaciones',
    NULL
  )
ON CONFLICT (email) DO NOTHING;

-- Also add to operations_users table if it exists
INSERT INTO operations_users (email, full_name) VALUES
  ('operaciones@test.com', 'Carlos Administrador')
ON CONFLICT (email) DO NOTHING;

-- Also add to approver_directory table if it exists  
INSERT INTO approver_directory (approver_email, approver_name, area) VALUES
  ('aprobador@test.com', 'María González Rodríguez', 'Finanzas')
ON CONFLICT (approver_email) DO NOTHING;

-- Add sample supplier for the proveedor user
INSERT INTO suppliers (
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
  solicitante_neo_email,
  is_active
) VALUES (
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
  'contacto@neoconsulting.com',
  true
) ON CONFLICT DO NOTHING;

-- Add sample bank account for the supplier
INSERT INTO supplier_bank_accounts (
  supplier_id,
  moneda,
  banco,
  numero_cuenta,
  tipo_cuenta,
  codigo_cci,
  is_primary
) VALUES (
  (SELECT id FROM suppliers WHERE contacto_email = 'proveedor@test.com' LIMIT 1),
  'PEN',
  'Banco de Crédito del Perú',
  '194-123456789-0-12',
  'corriente',
  '00219400123456789012',
  true
) ON CONFLICT DO NOTHING;