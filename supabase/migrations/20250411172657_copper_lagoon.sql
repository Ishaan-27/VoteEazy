/*
  # Add users table and update profiles table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `firstname` (text)
      - `lastname` (text)
      - `email` (text, unique)
      - `password` (text)
      - `mobilenumber` (text, unique)
      - `aadharnumber` (text, unique)
      - `address` (text)
      - `landmark` (text)
      - `city` (text)
      - `state` (text)
      - `pincode` (text)
      - `constituency` (text)

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  mobilenumber text NOT NULL UNIQUE,
  aadharnumber text NOT NULL UNIQUE,
  address text NOT NULL,
  landmark text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  constituency text NOT NULL,
  CONSTRAINT mobilenumber_check CHECK (mobilenumber ~ '^[0-9]{10}$'),
  CONSTRAINT aadharnumber_check CHECK (aadharnumber ~ '^[0-9]{12}$'),
  CONSTRAINT pincode_check CHECK (pincode ~ '^[0-9]{6}$')
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);