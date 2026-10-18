import assert from "node:assert/strict";
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for database-backed API tests");
const base = process.env.BASE_URL || "http://localhost:3099";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
let manufacturerId;
let modelId;
let sourceId;
let colorId;

try {
  const manufacturer = await client.query(
    "INSERT INTO manufacturers (slug, name) VALUES ($1, $2) RETURNING id",
    ["codex-api-fixture", "Codex API Fixture"],
  );
  manufacturerId = manufacturer.rows[0].id;
  const model = await client.query(
    "INSERT INTO vehicle_models (manufacturer_id, slug, name) VALUES ($1, $2, $3) RETURNING id",
    [manufacturerId, "fixture-coupe", "Fixture Coupe"],
  );
  modelId = model.rows[0].id;
  const source = await client.query(
    "INSERT INTO sources (url, publisher, document_title, license_notes) VALUES ($1, $2, $3, $4) RETURNING id",
    ["https://example.org/codex-api-fixture", "Test fixture", "Automated API fixture", "Test data; not an OEM record"],
  );
  sourceId = source.rows[0].id;
  const color = await client.query(
    `INSERT INTO paint_colors (manufacturer_id, oem_code, name, source_id, verification, verified_at)
     VALUES ($1, $2, $3, $4, 'verified', NOW()) RETURNING id`,
    [manufacturerId, "TEST-CODE-CP", "Test-only fixture color", sourceId],
  );
  colorId = color.rows[0].id;
  await client.query(
    "INSERT INTO paint_applications (paint_color_id, vehicle_model_id, year_from, year_to, source_id, verification) VALUES ($1, $2, 2020, 2021, $3, 'verified')",
    [colorId, modelId, sourceId],
  );
  await client.query(
    "INSERT INTO paint_colors (manufacturer_id, oem_code, name, source_id, verification) VALUES ($1, $2, $3, $4, 'pending')",
    [manufacturerId, "PENDING-CP", "Pending fixture", sourceId],
  );
  await client.query(
    "INSERT INTO label_locations (vehicle_model_id, year_from, year_to, location_text, code_field_hint, source_id, verification) VALUES ($1, 2020, 2021, 'Test-only verified location', 'Test field', $2, 'verified')",
    [modelId, sourceId],
  );
  await client.query(
    "INSERT INTO label_locations (vehicle_model_id, year_from, year_to, location_text, source_id, verification) VALUES ($1, 2020, 2021, 'Pending fixture location', $2, 'pending')",
    [modelId, sourceId],
  );

  const paintResponse = await fetch(`${base}/api/paint-search?make=Codex%20API%20Fixture&model=Fixture%20Coupe&year=2020&code=TEST-CODE-CP`);
  assert.equal(paintResponse.status, 200, "verified paint API should return 200");
  const paint = await paintResponse.json();
  assert.equal(paint.count, 1);
  assert.equal(paint.results[0].oem_code, "TEST-CODE-CP");
  assert.equal(paint.results[0].source_url, "https://example.org/codex-api-fixture");

  const pendingPaintResponse = await fetch(`${base}/api/paint-search?make=Codex%20API%20Fixture&code=PENDING-CP`);
  assert.equal(pendingPaintResponse.status, 200);
  assert.equal((await pendingPaintResponse.json()).count, 0, "pending paint data must remain private");

  const locationResponse = await fetch(`${base}/api/label-locations?make=Codex%20API%20Fixture&model=Fixture%20Coupe&year=2020`);
  assert.equal(locationResponse.status, 200, "verified location API should return 200");
  const locations = await locationResponse.json();
  assert.equal(locations.count, 1);
  assert.equal(locations.results[0].location_text, "Test-only verified location");

  const audit = await client.query("SELECT count(*)::int AS count FROM review_audit_events WHERE record_id = $1 AND table_name = 'paint_colors'", [colorId]);
  assert.equal(audit.rows[0].count, 1, "inserted paint status should be present in review audit");
  console.log("Database-backed API and review-audit tests passed.");
} finally {
  await client.query(`DELETE FROM review_audit_events
    WHERE new_record->>'oem_code' IN ('TEST-CODE-CP', 'PENDING-CP')
       OR new_record->>'location_text' IN ('Test-only verified location', 'Pending fixture location')`);
  if (manufacturerId) {
    if (modelId) await client.query("DELETE FROM label_locations WHERE vehicle_model_id = $1", [modelId]);
    if (colorId) await client.query("DELETE FROM paint_applications WHERE paint_color_id = $1", [colorId]);
    await client.query("DELETE FROM paint_colors WHERE manufacturer_id = $1", [manufacturerId]);
    if (modelId) await client.query("DELETE FROM vehicle_models WHERE id = $1", [modelId]);
    await client.query("DELETE FROM manufacturers WHERE id = $1", [manufacturerId]);
  }
  if (sourceId) await client.query("DELETE FROM sources WHERE id = $1", [sourceId]);
  await client.end();
}
