-- Database Schema for Magnum Cars

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT false
);

CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id TEXT REFERENCES cities(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- '4 Seater' or '6/7 Seater'
  year INTEGER NOT NULL,
  gear TEXT NOT NULL, -- 'Manual' or 'Automatic'
  fuel TEXT NOT NULL, -- 'Petrol' or 'Diesel'
  price_24h INTEGER NOT NULL,
  price_12h INTEGER NOT NULL,
  mileage TEXT,
  image_url TEXT,
  registration_number TEXT, -- Admin only
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  occupation TEXT,
  address TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected, Completed
  id_proof_url TEXT,
  live_photo_url TEXT,
  signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Seed
INSERT INTO cities (id, name, active) VALUES 
('tirunelveli', 'Tirunelveli', true),
('tenkasi', 'Tenkasi', false),
('tuticorin', 'Tuticorin', false),
('kanyakumari', 'Kanyakumari', false);
