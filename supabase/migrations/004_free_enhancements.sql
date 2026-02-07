-- Migration: FREE Enhancements (Tags + Custom Fields)
-- Version: 0.4.0

-- =====================
-- TAGS SYSTEM
-- =====================

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Customer tags junction table
CREATE TABLE IF NOT EXISTS customer_tags (
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (customer_id, tag_id)
);

-- Indexes for tags
CREATE INDEX IF NOT EXISTS idx_tags_user ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_tags_customer ON customer_tags(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_tags_tag ON customer_tags(tag_id);

-- RLS for tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tags"
ON tags FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags"
ON tags FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
ON tags FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
ON tags FOR DELETE
USING (auth.uid() = user_id);

-- RLS for customer_tags
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer tags"
ON customer_tags FOR SELECT
USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create own customer tags"
ON customer_tags FOR INSERT
WITH CHECK (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  AND tag_id IN (SELECT id FROM tags WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete own customer tags"
ON customer_tags FOR DELETE
USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

-- =====================
-- CUSTOM FIELDS SYSTEM
-- =====================

-- Custom fields definition table
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  field_type VARCHAR(20) NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'select')),
  options JSONB DEFAULT NULL, -- For select type: ["Option 1", "Option 2"]
  is_required BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom field values table
CREATE TABLE IF NOT EXISTS custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, field_id)
);

-- Indexes for custom fields
CREATE INDEX IF NOT EXISTS idx_custom_fields_user ON custom_fields(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_order ON custom_fields(user_id, display_order);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_customer ON custom_field_values(customer_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_field ON custom_field_values(field_id);

-- RLS for custom_fields
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom fields"
ON custom_fields FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own custom fields"
ON custom_fields FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom fields"
ON custom_fields FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom fields"
ON custom_fields FOR DELETE
USING (auth.uid() = user_id);

-- RLS for custom_field_values
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom field values"
ON custom_field_values FOR SELECT
USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create own custom field values"
ON custom_field_values FOR INSERT
WITH CHECK (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  AND field_id IN (SELECT id FROM custom_fields WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update own custom field values"
ON custom_field_values FOR UPDATE
USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete own custom field values"
ON custom_field_values FOR DELETE
USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

-- Trigger for updated_at on custom_field_values
CREATE TRIGGER update_custom_field_values_updated_at
  BEFORE UPDATE ON custom_field_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
