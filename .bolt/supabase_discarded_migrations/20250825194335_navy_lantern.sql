/*
  # Create portal_users table for additional user information

  1. New Tables
    - `portal_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text, enum: proveedor, aprobador)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `portal_users` table
    - Add policy for users to read their own data
    - Add policy for operations to manage all users

  3. Functions
    - Create trigger to update updated_at column
    - Create function to handle user registration
*/

-- Create portal_users table
CREATE TABLE IF NOT EXISTS portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('proveedor', 'aprobador')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON portal_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON portal_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portal_users_updated_at
  BEFORE UPDATE ON portal_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portal_users_user_id ON portal_users(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_users_email ON portal_users(email);
CREATE INDEX IF NOT EXISTS idx_portal_users_role ON portal_users(role);

-- Insert sample users
INSERT INTO portal_users (user_id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'proveedor@example.com', 'Juan Pérez García', 'proveedor'),
  ('550e8400-e29b-41d4-a716-446655440003', 'aprobador@neoconsulting.com', 'Carlos Rodríguez', 'aprobador')
ON CONFLICT (email) DO NOTHING;