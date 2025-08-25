/*
  # Clean Database - Remove All Custom Tables

  This migration removes all custom tables to start fresh.
  Only keeps Supabase's built-in auth tables.

  ## Tables to Remove
  - portal_users
  - suppliers  
  - supplier_bank_accounts
  - invoices
  - payments
  - operations_documents
  - announcements
  - supplier_feedback
  - approver_directory
  - operations_users
  - proveedores
  - proveedor_cuentas_bancarias
  - usuarios_operaciones
  - directorio_aprobadores
  - comprobantes
  - pagos
  - comunicados
  - documentos_operaciones
  - encuestas_feedback

  ## Views to Remove
  - v_dashboard_proveedor
  - v_dashboard_operaciones
  - v_bandeja_aprobador
  - v_cola_pagos_operaciones

  ## Functions to Remove
  - update_updated_at_column
*/

-- Drop all views first
DROP VIEW IF EXISTS v_dashboard_proveedor CASCADE;
DROP VIEW IF EXISTS v_dashboard_operaciones CASCADE;
DROP VIEW IF EXISTS v_bandeja_aprobador CASCADE;
DROP VIEW IF EXISTS v_cola_pagos_operaciones CASCADE;

-- Drop all custom tables
DROP TABLE IF EXISTS portal_users CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS supplier_bank_accounts CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS operations_documents CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS supplier_feedback CASCADE;
DROP TABLE IF EXISTS approver_directory CASCADE;
DROP TABLE IF EXISTS operations_users CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS proveedor_cuentas_bancarias CASCADE;
DROP TABLE IF EXISTS usuarios_operaciones CASCADE;
DROP TABLE IF EXISTS directorio_aprobadores CASCADE;
DROP TABLE IF EXISTS comprobantes CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS comunicados CASCADE;
DROP TABLE IF EXISTS documentos_operaciones CASCADE;
DROP TABLE IF EXISTS encuestas_feedback CASCADE;

-- Drop trigger functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Clean up any remaining objects
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop any remaining custom tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'auth_%' AND tablename NOT IN ('schema_migrations', 'supabase_migrations')) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Drop any remaining custom views
    FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.viewname) || ' CASCADE';
    END LOOP;
END $$;