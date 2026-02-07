-- SimpleCRM Row Level Security Policies
-- Run this AFTER 001_initial_schema.sql

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CUSTOMERS POLICIES
-- ===========================================

-- Users can view their own customers
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own customers
CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own customers
CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own customers
CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- NOTES POLICIES
-- ===========================================

-- Users can view their own notes
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own notes
CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- PAYMENTS POLICIES
-- ===========================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own payments
CREATE POLICY "Users can delete own payments"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- FOLLOW_UPS POLICIES
-- ===========================================

-- Users can view their own follow-ups
CREATE POLICY "Users can view own follow_ups"
  ON follow_ups FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own follow-ups
CREATE POLICY "Users can insert own follow_ups"
  ON follow_ups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own follow-ups
CREATE POLICY "Users can update own follow_ups"
  ON follow_ups FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own follow-ups
CREATE POLICY "Users can delete own follow_ups"
  ON follow_ups FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- TIMELINE_EVENTS POLICIES
-- ===========================================

-- Users can view their own timeline events
CREATE POLICY "Users can view own timeline_events"
  ON timeline_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own timeline events
CREATE POLICY "Users can insert own timeline_events"
  ON timeline_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
