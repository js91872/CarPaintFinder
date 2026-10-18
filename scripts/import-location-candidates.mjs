import {readFileSync} from "node:fs";
import pg from "pg";
const filename=process.argv[2];
if(!filename || !process.env.DATABASE_URL)throw new Error("Provide JSON filename and DATABASE_URL");
const rows=JSON.parse(readFileSync(filename,"utf8"));
if(!Array.isArray(rows)||!rows.length)throw new Error("Expected nonempty array");
for(const row of rows){
if(["manufacturer","model","locationText","sourceUrl","sourcePublisher","sourceTitle","reuseRights"].some(key=>typeof row[key]!=="string"||!row[key].trim()))throw new Error("Missing required field");
if(row.verification!=="pending")throw new Error("Only pending rows accepted");
if(!Number.isInteger(row.yearFrom)||!Number.isInteger(row.yearTo)||row.yearFrom<1900||row.yearTo>2100||row.yearFrom>row.yearTo)throw new Error("Invalid years");
if(!["http:","https:"].includes(new URL(row.sourceUrl).protocol))throw new Error("Invalid source URL");
}
const slug=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const db=new pg.Client({connectionString:process.env.DATABASE_URL});await db.connect();
try{
await db.query("BEGIN");
for(const row of rows){
const make=(await db.query("INSERT INTO manufacturers(slug,name) VALUES($1,$2) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name RETURNING id",[slug(row.manufacturer),row.manufacturer])).rows[0].id;
const model=(await db.query("INSERT INTO vehicle_models(manufacturer_id,slug,name) VALUES($1,$2,$3) ON CONFLICT(manufacturer_id,slug) DO UPDATE SET name=EXCLUDED.name RETURNING id",[make,slug(row.model),row.model])).rows[0].id;
const source=(await db.query("INSERT INTO sources(url,publisher,document_title,license_notes) VALUES($1,$2,$3,$4) ON CONFLICT(url) DO UPDATE SET publisher=EXCLUDED.publisher,document_title=EXCLUDED.document_title RETURNING id",[row.sourceUrl,row.sourcePublisher,row.sourceTitle,row.reuseRights])).rows[0].id;
await db.query("INSERT INTO label_locations(vehicle_model_id,year_from,year_to,location_text,code_field_hint,source_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(vehicle_model_id,year_from,year_to,location_text) DO NOTHING",[model,row.yearFrom,row.yearTo,row.locationText,row.codeFieldHint||null,source]);
}
await db.query("COMMIT");console.log("Imported",rows.length,"location candidates as pending; none published.");
}catch(error){await db.query("ROLLBACK");throw error}finally{await db.end()}
