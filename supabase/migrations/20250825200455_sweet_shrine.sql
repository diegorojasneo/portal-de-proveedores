/*
  # Create missing tables for NEO Consulting Portal

  1. New Tables
    - `operations_users` (usuarios_operaciones)
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `approver_directory` (directorio_aprobadores)
      - `id` (uuid, primary key)
      - `approver_email` (text, unique)
      - `approver_name` (text)
      - `area` (text)
      - `email_login` (text, unique)
      - `password_hash` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
    - Add proper indexes for performance

  3. Sample Data
    - Add sample operations users
    - Add sample approvers
*/

-- Create operations_users table (usuarios_operaciones)
CREATE TABLE IF NOT EXISTS operations_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create approver_directory table (directorio_aprobadores)
CREATE TABLE IF NOT EXISTS approver_directory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approver_email text UNIQUE NOT NULL,
  approver_name text,
  area text,
  email_login text UNIQUE,
  password_hash text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE operations_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE approver_directory ENABLE ROW LEVEL SECURITY;

-- Create policies for operations_users
CREATE POLICY "Operations users can read own data"
  ON operations_users
  FOR SELECT
  TO authenticated
  USING (email = (jwt() ->> 'email'));

-- Create policies for approver_directory
CREATE POLICY "Approvers can read own data"
  ON approver_directory
  FOR SELECT
  TO authenticated
  USING (
    approver_email = (jwt() ->> 'email') OR 
    email_login = (jwt() ->> 'email')
  );

CREATE POLICY "Operations can read all approvers"
  ON approver_directory
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_operations_users_email ON operations_users(email);
CREATE INDEX IF NOT EXISTS idx_approver_directory_email ON approver_directory(approver_email);
CREATE INDEX IF NOT EXISTS idx_approver_directory_login ON approver_directory(email_login);

-- Insert sample operations users
INSERT INTO operations_users (email, full_name) VALUES
  ('admin@neoconsulting.com', 'Administrador NEO'),
  ('operaciones@neoconsulting.com', 'Equipo de Operaciones'),
  ('alisson.trauco@neo.com.pe', 'Alisson Trauco'),
  ('lizbeth.zamora@neo.com.pe', 'Lizbeth Zamora'),
  ('manuel.falcon@neo.com.pe', 'Manuel Falcon')
ON CONFLICT (email) DO NOTHING;

-- Insert sample approvers
INSERT INTO approver_directory (approver_email, approver_name, area) VALUES
  ('aprobador@neoconsulting.com', 'Carlos Rodríguez', 'Finanzas'),
  ('aprobador2@neoconsulting.com', 'María González', 'Operaciones'),
  ('supervisor@neoconsulting.com', 'Ana López', 'Administración')
ON CONFLICT (approver_email) DO NOTHING;

-- Insert corresponding portal_users for operations and approvers
INSERT INTO portal_users (user_id, email, full_name, role) VALUES
  (gen_random_uuid(), 'admin@neoconsulting.com', 'Administrador NEO', 'operaciones'),
  (gen_random_uuid(), 'operaciones@neoconsulting.com', 'Equipo de Operaciones', 'operaciones'),
  (gen_random_uuid(), 'aprobador@neoconsulting.com', 'Carlos Rodríguez', 'aprobador'),
  (gen_random_uuid(), 'aprobador2@neoconsulting.com', 'María González', 'aprobador')
ON CONFLICT (email) DO NOTHING;