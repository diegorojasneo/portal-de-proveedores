/*
  # Insert sample users into existing portal_users table

  1. Sample Users
    - Proveedor: proveedor@test.com (Juan Pérez García)
    - Aprobador: aprobador@test.com (María González Rodríguez)  
    - Operaciones: operaciones@test.com (Carlos Administrador)

  2. Sample Data
    - Creates a sample supplier (proveedores table)
    - Creates sample bank account (proveedor_cuentas_bancarias table)
    - Creates sample operations user (operations_users table)
    - Creates sample approver (approver_directory table)

  3. Notes
    - Uses placeholder user_ids that need to be updated with real Supabase Auth IDs
    - Uses ON CONFLICT DO NOTHING to avoid duplicates
    - All users have password123 as password (set in Supabase Auth)
*/

-- Insert sample users into existing portal_users table
INSERT INTO portal_users (id, user_id, email, full_name, role, created_by) VALUES
  (
    'sample-proveedor-001',
    'placeholder-auth-id-1', -- Replace with real Supabase Auth user ID
    'proveedor@test.com',
    'Juan Pérez García',
    'proveedor',
    NULL
  ),
  (
    'sample-aprobador-001', 
    'placeholder-auth-id-2', -- Replace with real Supabase Auth user ID
    'aprobador@test.com',
    'María González Rodríguez',
    'aprobador',
    NULL
  ),
  (
    'sample-operaciones-001',
    'placeholder-auth-id-3', -- Replace with real Supabase Auth user ID  
    'operaciones@test.com',
    'Carlos Administrador',
    'operaciones',
    NULL
  )
ON CONFLICT (email) DO NOTHING;

-- Insert sample supplier for the proveedor user
INSERT INTO proveedores (id, email_login, ruc, razon_social, nombre_comercial, tipo_persona, pais, direccion, tipo_comprobante_emitir, contacto_nombre, contacto_email, contacto_telefono, is_active) VALUES
  (
    'sample-supplier-001',
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
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample bank account for the supplier
INSERT INTO proveedor_cuentas_bancarias (id, proveedor_id, moneda, banco, numero_cuenta, tipo_cuenta, cci, es_principal) VALUES
  (
    'sample-bank-001',
    'sample-supplier-001',
    'PEN',
    'Banco de Crédito del Perú',
    '194-123456789-0-12',
    'corriente',
    '00219400123456789012',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample operations user
INSERT INTO operations_users (id, email, full_name, is_active) VALUES
  (
    'sample-ops-001',
    'operaciones@test.com',
    'Carlos Administrador',
    true
  )
ON CONFLICT (email) DO NOTHING;

-- Insert sample approver
INSERT INTO approver_directory (id, approver_email, approver_name, area, is_active) VALUES
  (
    'sample-approver-001',
    'aprobador@test.com',
    'María González Rodríguez',
    'Finanzas',
    true
  )
ON CONFLICT (approver_email) DO NOTHING;