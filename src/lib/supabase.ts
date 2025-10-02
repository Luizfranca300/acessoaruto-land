import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

export type Vehicle = {
  id: string;
  brand_id: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string | null;
  features: string[] | null;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  brands?: Brand;
};

export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicle_id?: string;
  inquiry_type: 'general' | 'vehicle_interest' | 'valuation' | 'financing';
};

export type VehicleValuation = {
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  additional_info?: string;
};
