-- Core provenance-first schema. Paint and location records are never seeded here.
CREATE TABLE manufacturers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0)
);

CREATE TABLE vehicle_models (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  manufacturer_id BIGINT NOT NULL REFERENCES manufacturers(id),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  UNIQUE (manufacturer_id, slug),
  UNIQUE (manufacturer_id, name)
);

CREATE TABLE sources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url TEXT NOT NULL UNIQUE CHECK (url ~ '^https?://'),
  publisher TEXT NOT NULL CHECK (length(trim(publisher)) > 0),
  document_title TEXT NOT NULL CHECK (length(trim(document_title)) > 0),
  license_notes TEXT NOT NULL DEFAULT 'Not assessed',
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE paint_colors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  manufacturer_id BIGINT NOT NULL REFERENCES manufacturers(id),
  oem_code TEXT NOT NULL CHECK (length(trim(oem_code)) > 0),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  finish TEXT,
  source_id BIGINT NOT NULL REFERENCES sources(id),
  verification TEXT NOT NULL DEFAULT 'pending' CHECK (verification IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  UNIQUE (manufacturer_id, oem_code, name),
  CHECK ((verification = 'verified') = (verified_at IS NOT NULL))
);

CREATE TABLE paint_applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  paint_color_id BIGINT NOT NULL REFERENCES paint_colors(id) ON DELETE CASCADE,
  vehicle_model_id BIGINT NOT NULL REFERENCES vehicle_models(id),
  year_from INT NOT NULL CHECK (year_from BETWEEN 1900 AND 2100),
  year_to INT NOT NULL CHECK (year_to BETWEEN 1900 AND 2100),
  source_id BIGINT NOT NULL REFERENCES sources(id),
  verification TEXT NOT NULL DEFAULT 'pending' CHECK (verification IN ('pending', 'verified', 'rejected')),
  CHECK (year_to >= year_from),
  UNIQUE (paint_color_id, vehicle_model_id, year_from, year_to)
);

CREATE TABLE label_locations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehicle_model_id BIGINT NOT NULL REFERENCES vehicle_models(id),
  year_from INT NOT NULL CHECK (year_from BETWEEN 1900 AND 2100),
  year_to INT NOT NULL CHECK (year_to BETWEEN 1900 AND 2100),
  location_text TEXT NOT NULL CHECK (length(trim(location_text)) > 0),
  code_field_hint TEXT,
  source_id BIGINT NOT NULL REFERENCES sources(id),
  verification TEXT NOT NULL DEFAULT 'pending' CHECK (verification IN ('pending', 'verified', 'rejected')),
  CHECK (year_to >= year_from),
  UNIQUE (vehicle_model_id, year_from, year_to, location_text)
);

CREATE INDEX idx_paint_colors_code ON paint_colors (lower(oem_code));
CREATE INDEX idx_paint_applications_model_year ON paint_applications (vehicle_model_id, year_from, year_to);
CREATE INDEX idx_label_locations_model_year ON label_locations (vehicle_model_id, year_from, year_to);
CREATE OR REPLACE VIEW public_paint_applications AS
SELECT pc.id AS paint_color_id, m.name AS manufacturer, vm.name AS model,
       pc.oem_code, pc.name AS color_name, pa.year_from, pa.year_to,
       s.url AS source_url
FROM paint_applications pa
JOIN paint_colors pc ON pc.id = pa.paint_color_id
JOIN vehicle_models vm ON vm.id = pa.vehicle_model_id
JOIN manufacturers m ON m.id = vm.manufacturer_id
JOIN sources s ON s.id = pa.source_id
WHERE pc.verification = 'verified' AND pa.verification = 'verified';

CREATE OR REPLACE VIEW public_label_locations AS
SELECT m.name AS manufacturer, vm.name AS model, ll.year_from, ll.year_to,
       ll.location_text, ll.code_field_hint, s.url AS source_url
FROM label_locations ll
JOIN vehicle_models vm ON vm.id = ll.vehicle_model_id
JOIN manufacturers m ON m.id = vm.manufacturer_id
JOIN sources s ON s.id = ll.source_id
WHERE ll.verification = 'verified';
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
