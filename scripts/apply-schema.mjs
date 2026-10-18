import nextEnv from "@next/env";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const migrationsDir = join(process.cwd(), "db/migrations");
const migrationFiles = readdirSync(migrationsDir).filter((name) => /^\d{3}_.+\.sql$/.test(name)).sort();
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

try {
  await db.query("SELECT pg_advisory_lock($1)", [739214805]);
  await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    migration_name TEXT PRIMARY KEY,
    checksum TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  const existingSchema = await db.query("SELECT to_regclass('public.manufacturers') AS present");
  const applied = await db.query("SELECT migration_name, checksum FROM schema_migrations");
  const appliedByName = new Map(applied.rows.map((row) => [row.migration_name, row.checksum]));

  // Adopt databases created by the former one-shot schema installer without replaying DDL.
  if (existingSchema.rows[0].present && !appliedByName.has("001_initial_schema.sql")) {
    const required = ["manufacturers", "vehicle_models", "sources", "paint_colors", "paint_applications", "label_locations"];
    for (const table of required) {
      const found = await db.query("SELECT to_regclass($1) AS present", [`public.${table}`]);
      if (!found.rows[0].present) throw new Error(`Existing database is incomplete: missing ${table}`);
    }
    const first = "001_initial_schema.sql";
    const digest = createHash("sha256").update(readFileSync(join(migrationsDir, first))).digest("hex");
    await db.query("INSERT INTO schema_migrations (migration_name, checksum) VALUES ($1, $2)", [first, digest]);
    appliedByName.set(first, digest);
    console.log("Adopted existing core schema as migration 001.");
  }

  for (const name of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, name), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const previous = appliedByName.get(name);
    if (previous) {
      if (previous !== checksum) throw new Error(`Applied migration was edited: ${name}`);
      console.log(`Already applied: ${name}`);
      continue;
    }
    await db.query("BEGIN");
    try {
      await db.query(sql);
      await db.query("INSERT INTO schema_migrations (migration_name, checksum) VALUES ($1, $2)", [name, checksum]);
      await db.query("COMMIT");
      appliedByName.set(name, checksum);
      console.log(`Applied: ${name}`);
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }
  console.log("Database migrations are current.");
} finally {
  await db.query("SELECT pg_advisory_unlock($1)", [739214805]).catch(() => {});
  await db.end();
}
