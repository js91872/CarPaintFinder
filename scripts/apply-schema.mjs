import nextEnv from "@next/env";
const {loadEnvConfig}=nextEnv;loadEnvConfig(process.cwd());
import {readFileSync} from "node:fs";import pg from "pg";
if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL is required");
const db=new pg.Client({connectionString:process.env.DATABASE_URL});
await db.connect();
try{const tables=await db.query("SELECT to_regclass('public.manufacturers') AS present");if(tables.rows[0].present){console.log("Existing schema found. Applying idempotent label-location view migration only.");await db.query(readFileSync("db/migrations/002_public_label_locations.sql","utf8"))}else{console.log("Creating initial database schema.");await db.query("BEGIN");try{await db.query(readFileSync("db/schema.sql","utf8"));await db.query("COMMIT")}catch(e){await db.query("ROLLBACK");throw e}}console.log("Database schema ready.")}finally{await db.end()}
