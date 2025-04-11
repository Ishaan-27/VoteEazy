/*
  # Add mobile and Aadhar number columns to profiles table

  1. Changes
    - Add mobile_number column to profiles table
    - Add aadhar_number column to profiles table
    - Add unique constraints to both columns
    - Add validation check constraints

  2. Security
    - No changes to RLS policies needed
*/

-- Add mobile_number column with unique constraint and validation
ALTER TABLE profiles
ADD COLUMN mobile_number text,
ADD CONSTRAINT profiles_mobile_number_key UNIQUE (mobile_number),
ADD CONSTRAINT mobile_number_check CHECK (mobile_number ~ '^[0-9]{10}$');

-- Add aadhar_number column with unique constraint and validation
ALTER TABLE profiles
ADD COLUMN aadhar_number text,
ADD CONSTRAINT profiles_aadhar_number_key UNIQUE (aadhar_number),
ADD CONSTRAINT aadhar_number_check CHECK (aadhar_number ~ '^[0-9]{12}$');