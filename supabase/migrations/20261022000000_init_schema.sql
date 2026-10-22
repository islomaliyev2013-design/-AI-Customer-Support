-- ========================================================
-- NexusAI Customer Support & Financial SaaS Database Schema
-- Migration: 20261022000000_init_schema.sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  category TEXT DEFAULT 'General' NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  currency TEXT DEFAULT 'USD' NOT NULL CHECK (currency IN ('USD', 'UZS', 'EUR')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD' NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  availability TEXT DEFAULT 'in_stock' NOT NULL CHECK (availability IN ('in_stock', 'out_of_stock', 'pre_order')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  customer_identifier TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  conversations_count INTEGER DEFAULT 0 NOT NULL,
  last_interaction TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(business_id, customer_identifier)
);

-- 6. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  customer_identifier TEXT NOT NULL,
  customer_name TEXT DEFAULT 'Guest Customer',
  last_message_preview TEXT,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'resolved', 'needs_attention')),
  has_unanswered BOOLEAN DEFAULT FALSE NOT NULL,
  message_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'ai', 'admin')),
  text TEXT NOT NULL,
  products_mentioned JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. FINANCIAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD' NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_availability ON public.products(availability);
CREATE INDEX IF NOT EXISTS idx_faqs_business_active ON public.faqs(business_id, is_active);
CREATE INDEX IF NOT EXISTS idx_customers_business ON public.customers(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business ON public.conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_financial_business_date ON public.financial_records(business_id, transaction_date);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read/write their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Businesses: Owners can manage their businesses
CREATE POLICY "Owners can view own business" ON public.businesses
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can create own business" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own business" ON public.businesses
  FOR UPDATE USING (auth.uid() = owner_id);

-- Public read policy for business support landing page
CREATE POLICY "Public can view business info by slug" ON public.businesses
  FOR SELECT USING (true);

-- 3. Products: Public can view active products for customer support
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Owners can manage products" ON public.products
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- 4. FAQs: Public can view active FAQs
CREATE POLICY "Public can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage faqs" ON public.faqs
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- 5. Financial Records: Strictly Private to Business Owner
CREATE POLICY "Owners can manage financial records" ON public.financial_records
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- 6. Customers & Conversations: Business owners view and manage
CREATE POLICY "Owners manage customers" ON public.customers
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owners manage conversations" ON public.conversations
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owners manage messages" ON public.messages
  FOR ALL USING (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.businesses b ON c.business_id = b.id
      WHERE b.owner_id = auth.uid()
    )
  );
