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
