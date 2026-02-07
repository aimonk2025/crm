-- ===========================================
-- SimpleCRM Complete Database Schema
-- ===========================================
--
-- Run this single file in Supabase SQL Editor
-- to set up the entire database.
--
-- This includes:
-- 1. Extensions
-- 2. Enums
-- 3. Tables
-- 4. Indexes
-- 5. Functions & Triggers
-- 6. Row Level Security (RLS)
-- 7. Timeline Auto-Creation
--
-- ===========================================


-- ===========================================
-- 1. EXTENSIONS
-- ===========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ===========================================
-- 2. ENUMS
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
-- 3. TABLES
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
-- 4. INDEXES
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
-- 5. FUNCTIONS & TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Customers updated_at trigger
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ===========================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS POLICIES
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

-- NOTES POLICIES
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- PAYMENTS POLICIES
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);

-- FOLLOW_UPS POLICIES
CREATE POLICY "Users can view own follow_ups"
  ON follow_ups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own follow_ups"
  ON follow_ups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own follow_ups"
  ON follow_ups FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own follow_ups"
  ON follow_ups FOR DELETE
  USING (auth.uid() = user_id);

-- TIMELINE_EVENTS POLICIES
CREATE POLICY "Users can view own timeline_events"
  ON timeline_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timeline_events"
  ON timeline_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ===========================================
-- 7. TIMELINE AUTO-CREATION TRIGGERS
-- ===========================================

-- Helper function to create timeline event
CREATE OR REPLACE FUNCTION create_timeline_event(
  p_customer_id UUID,
  p_user_id UUID,
  p_event_type event_type,
  p_event_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO timeline_events (customer_id, user_id, event_type, event_data)
  VALUES (p_customer_id, p_user_id, p_event_type, p_event_data)
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Customer created trigger
CREATE OR REPLACE FUNCTION on_customer_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_timeline_event(
    NEW.id,
    NEW.user_id,
    'customer_created',
    jsonb_build_object(
      'name', NEW.name,
      'phone', NEW.phone,
      'source', NEW.source
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_customer_created
  AFTER INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION on_customer_created();

-- Status changed trigger
CREATE OR REPLACE FUNCTION on_customer_status_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_timeline_event(
      NEW.id,
      NEW.user_id,
      'status_changed',
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_customer_status_changed
  AFTER UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION on_customer_status_changed();

-- Note added trigger
CREATE OR REPLACE FUNCTION on_note_added()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_timeline_event(
    NEW.customer_id,
    NEW.user_id,
    'note_added',
    jsonb_build_object(
      'note_id', NEW.id,
      'content', LEFT(NEW.content, 100)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_note_added
  AFTER INSERT ON notes
  FOR EACH ROW
  EXECUTE FUNCTION on_note_added();

-- Payment added trigger
CREATE OR REPLACE FUNCTION on_payment_added()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_timeline_event(
    NEW.customer_id,
    NEW.user_id,
    'payment_added',
    jsonb_build_object(
      'payment_id', NEW.id,
      'amount', NEW.amount,
      'mode', NEW.mode
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_payment_added
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION on_payment_added();

-- Follow-up scheduled trigger
CREATE OR REPLACE FUNCTION on_follow_up_scheduled()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_timeline_event(
    NEW.customer_id,
    NEW.user_id,
    'follow_up_scheduled',
    jsonb_build_object(
      'follow_up_id', NEW.id,
      'due_date', NEW.due_date,
      'note', NEW.note
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_follow_up_scheduled
  AFTER INSERT ON follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION on_follow_up_scheduled();

-- Follow-up completed trigger
CREATE OR REPLACE FUNCTION on_follow_up_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.completed = FALSE AND NEW.completed = TRUE THEN
    NEW.completed_at = NOW();

    PERFORM create_timeline_event(
      NEW.customer_id,
      NEW.user_id,
      'follow_up_completed',
      jsonb_build_object(
        'follow_up_id', NEW.id,
        'due_date', NEW.due_date
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_follow_up_completed
  BEFORE UPDATE ON follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION on_follow_up_completed();


-- ===========================================
-- DONE!
-- ===========================================
-- Your SimpleCRM database is ready.
--
-- Tables created:
--   - customers
--   - notes
--   - payments
--   - follow_ups
--   - timeline_events
--
-- All tables have RLS enabled.
-- Timeline events are auto-created on actions.
-- ===========================================
