import {readFileSync} from "node:fs";
import pg from "pg";
const filename=process.argv[2];
if(!filename || !process.env.DATABASE_URL) throw new Error("Provide JSON filename and DATABASE_URL");
const rows=JSON.parse(readFileSync(filename,"utf8"));
if(!Array.isArray(rows) || !rows.length) throw new Error("Expected nonempty JSON array");
const required=["manufacturer","model","oemCode","colorName","sourceUrl","sourcePublisher","sourceTitle","reuseRights"];
for(const row of rows){
if(required.some(key=>typeof row[key]!=="string" || !row[key].trim()))throw new Error("Missing required field");
if(row.verification!=="pending")throw new Error("Only pending records accepted");
if(!Number.isInteger(row.yearFrom)||!Number.isInteger(row.yearTo)||row.yearFrom<1900||row.yearTo>2100||row.yearFrom>row.yearTo)throw new Error("Invalid years");
if(!["http:","https:"].includes(new URL(row.sourceUrl).protocol))throw new Error("Invalid source URL");
if(row.oemCode==="SAMPLE-000")throw new Error("Example data is not importable");
}
const slug=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const db=new pg.Client({connectionString:process.env.DATABASE_URL});
await db.connect();
try{
await db.query("BEGIN");
for(const row of rows){
const make=(await db.query("INSERT INTO manufacturers(slug,name) VALUES($1,$2) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name RETURNING id",[slug(row.manufacturer),row.manufacturer])).rows[0].id;
const model=(await db.query("INSERT INTO vehicle_models(manufacturer_id,slug,name) VALUES($1,$2,$3) ON CONFLICT(manufacturer_id,slug) DO UPDATE SET name=EXCLUDED.name RETURNING id",[make,slug(row.model),row.model])).rows[0].id;
const source=(await db.query("INSERT INTO sources(url,publisher,document_title,license_notes) VALUES($1,$2,$3,$4) ON CONFLICT(url) DO UPDATE SET publisher=EXCLUDED.publisher,document_title=EXCLUDED.document_title RETURNING id",[row.sourceUrl,row.sourcePublisher,row.sourceTitle,row.reuseRights])).rows[0].id;
const paint=(await db.query("INSERT INTO paint_colors(manufacturer_id,oem_code,name,source_id) VALUES($1,$2,$3,$4) ON CONFLICT(manufacturer_id,oem_code,name) DO UPDATE SET source_id=EXCLUDED.source_id RETURNING id",[make,row.oemCode,row.colorName,source])).rows[0].id;
await db.query("INSERT INTO paint_applications(paint_color_id,vehicle_model_id,year_from,year_to,source_id) VALUES($1,$2,$3,$4,$5) ON CONFLICT(paint_color_id,vehicle_model_id,year_from,year_to) DO NOTHING",[paint,model,row.yearFrom,row.yearTo,source]);
}
await db.query("COMMIT");
console.log("Imported",rows.length,"paint candidates as pending; none published.");
}catch(error){await db.query("ROLLBACK");throw error}finally{await db.end()}
