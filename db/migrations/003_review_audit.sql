CREATE TABLE review_audit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL CHECK (table_name IN ('paint_colors', 'paint_applications', 'label_locations')),
  record_id BIGINT NOT NULL,
  old_verification TEXT,
  new_verification TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT SESSION_USER,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  old_record JSONB,
  new_record JSONB NOT NULL
);

CREATE INDEX idx_review_audit_record ON review_audit_events (table_name, record_id, changed_at DESC);

CREATE OR REPLACE FUNCTION record_verification_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' OR OLD.verification IS DISTINCT FROM NEW.verification THEN
    INSERT INTO review_audit_events
      (table_name, record_id, old_verification, new_verification, old_record, new_record)
    VALUES
      (TG_TABLE_NAME, NEW.id, CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.verification END,
       NEW.verification, CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END, to_jsonb(NEW));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER paint_colors_review_audit
AFTER INSERT OR UPDATE OF verification ON paint_colors
FOR EACH ROW EXECUTE FUNCTION record_verification_change();
CREATE TRIGGER paint_applications_review_audit
AFTER INSERT OR UPDATE OF verification ON paint_applications
FOR EACH ROW EXECUTE FUNCTION record_verification_change();
CREATE TRIGGER label_locations_review_audit
AFTER INSERT OR UPDATE OF verification ON label_locations
FOR EACH ROW EXECUTE FUNCTION record_verification_change();
