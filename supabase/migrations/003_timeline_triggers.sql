-- SimpleCRM Timeline Auto-Creation Triggers
-- Run this AFTER 002_rls_policies.sql

-- ===========================================
-- TIMELINE HELPER FUNCTION
-- ===========================================

-- Function to create timeline event
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

-- ===========================================
-- CUSTOMER CREATED TRIGGER
-- ===========================================

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

-- ===========================================
-- STATUS CHANGED TRIGGER
-- ===========================================

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

-- ===========================================
-- NOTE ADDED TRIGGER
-- ===========================================

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

-- ===========================================
-- PAYMENT ADDED TRIGGER
-- ===========================================

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

-- ===========================================
-- FOLLOW-UP SCHEDULED TRIGGER
-- ===========================================

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

-- ===========================================
-- FOLLOW-UP COMPLETED TRIGGER
-- ===========================================

CREATE OR REPLACE FUNCTION on_follow_up_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.completed = FALSE AND NEW.completed = TRUE THEN
    -- Set completed_at timestamp
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
