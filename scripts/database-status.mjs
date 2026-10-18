import nextEnv from "@next/env";
const {loadEnvConfig}=nextEnv;
loadEnvConfig(process.cwd());
import pg from "pg";
if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL missing from .env.local");
const client=new pg.Client({connectionString:process.env.DATABASE_URL});
await client.connect();
try{
for(const [label,sql] of [
["Manufacturers","SELECT COUNT(*)::int AS count FROM manufacturers"],
["Vehicle models","SELECT COUNT(*)::int AS count FROM vehicle_models"],
["Source documents","SELECT COUNT(*)::int AS count FROM sources"],
["Paint codes by review status","SELECT verification,COUNT(*)::int AS count FROM paint_colors GROUP BY verification ORDER BY verification"],
["Paint applications by review status","SELECT verification,COUNT(*)::int AS count FROM paint_applications GROUP BY verification ORDER BY verification"],
["Label locations by review status","SELECT verification,COUNT(*)::int AS count FROM label_locations GROUP BY verification ORDER BY verification"],
["Public verified paint applications","SELECT COUNT(*)::int AS count FROM public_paint_applications"],
["Public verified label locations","SELECT COUNT(*)::int AS count FROM public_label_locations"],
["Applied schema migrations","SELECT migration_name,applied_at FROM schema_migrations ORDER BY migration_name"]
]){const r=await client.query(sql);console.log("\n"+label);console.table(r.rows)}
}finally{await client.end()}
