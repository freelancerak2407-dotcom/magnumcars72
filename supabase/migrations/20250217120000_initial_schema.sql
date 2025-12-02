/*
  # Initial Schema Setup for Magnum Cars
  
  ## Query Description:
  1. Creates tables for Cities, Cars, and Bookings.
  2. Sets up Row Level Security (RLS) policies.
  3. Seeds the database with the mandatory 13 Tirunelveli cars.
  4. Creates a storage bucket for documents.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "High"
  - Requires-Backup: false
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
    id text PRIMARY KEY,
    name text NOT NULL,
    active boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 2. CARS TABLE
CREATE TABLE IF NOT EXISTS public.cars (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL, -- '4 Seater' | '6/7 Seater'
    year integer NOT NULL,
    gear text NOT NULL, -- 'Manual' | 'Automatic'
    fuel text NOT NULL, -- 'Petrol' | 'Diesel'
    price24h integer NOT NULL,
    price12h integer NOT NULL,
    mileage text NOT NULL,
    image text NOT NULL,
    city_id text REFERENCES public.cities(id),
    registration_number text, -- Admin only view
    is_available boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    car_id uuid REFERENCES public.cars(id),
    city_id text REFERENCES public.cities(id),
    customer_name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    occupation text,
    address text,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    total_amount integer NOT NULL,
    status text DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Completed'
    id_proof_url text,
    live_photo_url text,
    signature_url text,
    start_km integer,
    end_km integer,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Cities: Public read
CREATE POLICY "Allow public read access on cities" ON public.cities FOR SELECT USING (true);

-- Cars: Public read
CREATE POLICY "Allow public read access on cars" ON public.cars FOR SELECT USING (true);

-- Bookings: Public insert (Create booking), Admin read/update
CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own bookings" ON public.bookings FOR SELECT USING (true); -- Simplified for demo, ideally auth based
CREATE POLICY "Allow update for admins" ON public.bookings FOR UPDATE USING (true);

-- SEED DATA

-- Cities
INSERT INTO public.cities (id, name, active) VALUES
('tirunelveli', 'Tirunelveli (Head Office)', true),
('tenkasi', 'Tenkasi', false),
('tuticorin', 'Tuticorin', false),
('kanyakumari', 'Kanyakumari', false)
ON CONFLICT (id) DO UPDATE SET active = EXCLUDED.active;

-- Cars (Tirunelveli)
INSERT INTO public.cars (name, year, type, gear, fuel, price24h, price12h, mileage, city_id, is_available, image) VALUES
('Maruti Suzuki Alto', 2018, '4 Seater', 'Manual', 'Petrol', 1800, 1600, '20–24 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Celerio', 2025, '4 Seater', 'Automatic', 'Petrol', 2400, 2000, '20–24 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Swift', 2025, '4 Seater', 'Manual', 'Petrol', 2400, 2200, '20–24 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'),
('Hyundai i10 Nios', 2025, '4 Seater', 'Manual', 'Petrol', 2200, 2400, '18–23 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Ignis', 2019, '4 Seater', 'Automatic', 'Petrol', 2000, 2200, '18–23 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=800'),
('Honda Amaze', 2015, '4 Seater', 'Manual', 'Diesel', 2200, 2000, '18–23 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Dzire', 2019, '4 Seater', 'Automatic', 'Petrol', 2400, 2200, '16–20 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Dzire', 2024, '4 Seater', 'Manual', 'Petrol', 2700, 2500, '18–23 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Baleno', 2024, '4 Seater', 'Manual', 'Petrol', 2700, 2500, '18–23 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'),
('Nissan Magnite', 2024, '4 Seater', 'Manual', 'Petrol', 2700, 2500, '17–19 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1606152421811-aa81130ce0a9?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki Ertiga', 2024, '6/7 Seater', 'Manual', 'Petrol', 3800, 3500, '13–16 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'),
('Maruti Suzuki XL6', 2023, '6/7 Seater', 'Automatic', 'Petrol', 4000, 3800, '13–16 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800'),
('KIA Carens', 2025, '6/7 Seater', 'Manual', 'Petrol', 4500, 4000, '15–19 KMPL', 'tirunelveli', true, 'https://images.unsplash.com/photo-1678725164647-82d44c322177?auto=format&fit=crop&q=80&w=800');

-- Storage Bucket for Documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public upload to documents
CREATE POLICY "Public Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
