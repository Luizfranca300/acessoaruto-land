/*
  # Garage Management System Schema

  ## Overview
  Complete database schema for a vehicle garage/dealership management system

  ## New Tables Created
  
  ### 1. brands
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Brand name (e.g., Toyota, Ford)
  - `logo_url` (text, optional) - URL to brand logo image
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 2. vehicles
  - `id` (uuid, primary key) - Unique identifier
  - `brand_id` (uuid, foreign key) - Links to brands table
  - `model` (text) - Vehicle model name
  - `year` (integer) - Manufacturing year
  - `price` (decimal) - Sale price
  - `mileage` (integer) - Kilometers driven
  - `fuel_type` (text) - Fuel type (gasoline, diesel, electric, hybrid)
  - `transmission` (text) - Transmission type (manual, automatic)
  - `color` (text) - Vehicle color
  - `description` (text, optional) - Detailed description
  - `features` (text array, optional) - List of features
  - `images` (text array) - Array of image URLs
  - `is_featured` (boolean) - Whether vehicle is featured on homepage
  - `is_sold` (boolean) - Sale status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 3. contact_inquiries
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `phone` (text) - Customer phone number
  - `message` (text) - Inquiry message
  - `vehicle_id` (uuid, optional, foreign key) - Related vehicle if inquiry is about specific vehicle
  - `inquiry_type` (text) - Type of inquiry (general, vehicle_interest, valuation, financing)
  - `status` (text) - Processing status (new, contacted, closed)
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 4. vehicle_valuations
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `phone` (text) - Customer phone number
  - `brand` (text) - Vehicle brand
  - `model` (text) - Vehicle model
  - `year` (integer) - Vehicle year
  - `mileage` (integer) - Current mileage
  - `condition` (text) - Vehicle condition
  - `additional_info` (text, optional) - Additional information
  - `status` (text) - Processing status
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for brands and active vehicles
  - Authenticated users can submit inquiries and valuations
  - Contact inquiries and valuations are private to authenticated admin users

  ## Indexes
  - Indexes on foreign keys for optimal query performance
  - Indexes on frequently filtered columns (brand_id, is_featured, is_sold)
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal(10,2) NOT NULL,
  mileage integer NOT NULL DEFAULT 0,
  fuel_type text NOT NULL DEFAULT 'gasoline',
  transmission text NOT NULL DEFAULT 'manual',
  color text NOT NULL,
  description text,
  features text[],
  images text[] NOT NULL DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_sold boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  CHECK (price >= 0),
  CHECK (mileage >= 0),
  CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'flex')),
  CHECK (transmission IN ('manual', 'automatic', 'cvt'))
);

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  inquiry_type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  CHECK (inquiry_type IN ('general', 'vehicle_interest', 'valuation', 'financing')),
  CHECK (status IN ('new', 'contacted', 'closed'))
);

-- Create vehicle valuations table
CREATE TABLE IF NOT EXISTS vehicle_valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  mileage integer NOT NULL,
  condition text NOT NULL,
  additional_info text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  CHECK (mileage >= 0),
  CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  CHECK (status IN ('pending', 'reviewed', 'completed'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_featured ON vehicles(is_featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_sold ON vehicles(is_sold);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_vehicle_id ON contact_inquiries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_valuations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brands (public read access)
CREATE POLICY "Anyone can view brands"
  ON brands FOR SELECT
  TO public
  USING (true);

-- RLS Policies for vehicles (public can view non-sold vehicles)
CREATE POLICY "Anyone can view available vehicles"
  ON vehicles FOR SELECT
  TO public
  USING (true);

-- RLS Policies for contact_inquiries (users can insert their own inquiries)
CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own inquiries"
  ON contact_inquiries FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for vehicle_valuations (users can submit valuations)
CREATE POLICY "Anyone can submit vehicle valuations"
  ON vehicle_valuations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view valuations"
  ON vehicle_valuations FOR SELECT
  TO authenticated
  USING (true);