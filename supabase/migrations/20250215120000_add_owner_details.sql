/*
  # Add Owner Details to Cars Table
  Adds columns to track car ownership and revenue sharing models.

  ## Query Description:
  This migration adds three new columns to the 'cars' table to support the new Revenue Management feature.
  1. owner_name: To identify who owns the car.
  2. owner_phone: Contact number for the owner.
  3. owner_share_percentage: The percentage of revenue the owner receives (0-100).

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - Table: cars
  - New Columns: owner_name (TEXT), owner_phone (TEXT), owner_share_percentage (INTEGER)
*/

ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS owner_name TEXT DEFAULT 'Magnum',
ADD COLUMN IF NOT EXISTS owner_phone TEXT DEFAULT '7845012402',
ADD COLUMN IF NOT EXISTS owner_share_percentage INTEGER DEFAULT 100;
