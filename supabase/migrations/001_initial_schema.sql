-- SimpleCRM Initial Schema
-- Run this in Supabase SQL Editor

-- ===========================================
-- EXTENSIONS
-- ===========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE customer_status AS ENUM (
  'new',
  'contacted',
  'in_progress',
  'completed',
  'lost'
);

CREATE TYPE payment_mode AS ENUM (
  'cash',
  'upi',
  'bank',
  'other'
);

CREATE TYPE event_type AS ENUM (
  'customer_created',
  'status_changed',
  'note_added',
  'payment_added',
  'follow_up_scheduled',
  'follow_up_completed'
);

-- ===========================================
-- TABLES
-- ===========================================

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  status customer_status DEFAULT 'new',
  source VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_phone UNIQUE(user_id, phone)
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  mode payment_mode NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow-ups table
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  note TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline events table
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Customers indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_phone ON customers(user_id, phone);
CREATE INDEX idx_customers_status ON customers(user_id, status);
CREATE INDEX idx_customers_updated_at ON customers(user_id, updated_at DESC);

-- Notes indexes
CREATE INDEX idx_notes_customer_id ON notes(customer_id);

-- Payments indexes
CREATE INDEX idx_payments_customer_id ON payments(customer_id);

-- Follow-ups indexes
CREATE INDEX idx_follow_ups_customer_id ON follow_ups(customer_id);
CREATE INDEX idx_follow_ups_due_date ON follow_ups(user_id, due_date) WHERE completed = FALSE;
CREATE INDEX idx_follow_ups_user_due ON follow_ups(user_id, completed, due_date);

-- Timeline indexes
CREATE INDEX idx_timeline_customer_created ON timeline_events(customer_id, created_at DESC);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Customers updated_at trigger
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
