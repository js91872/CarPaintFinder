import {readFileSync} from "node:fs";
const file=process.argv[2];if(!file){console.error("Usage: node scripts/validate-location-candidates.mjs <file.json>");process.exit(2)}
let rows;try{rows=JSON.parse(readFileSync(file,"utf8"))}catch(e){console.error(e.message);process.exit(1)}
if(!Array.isArray(rows)||rows.length===0){console.error("Expected nonempty JSON array");process.exit(1)}
const required=["manufacturer","model","locationText","sourceUrl","sourcePublisher","sourceTitle","reuseRights"];
const seen=new Set();let failures=0;
for(const [i,r] of rows.entries()){const errors=[];
for(const key of required)if(typeof r?.[key]!=="string"||!r[key].trim())errors.push(key+" missing");
if(!Number.isInteger(r?.yearFrom)||!Number.isInteger(r?.yearTo)||r.yearFrom<1900||r.yearTo>2100||r.yearTo<r.yearFrom)errors.push("invalid year range");
try{if(!["http:","https:"].includes(new URL(r.sourceUrl).protocol))errors.push("invalid URL")}catch{errors.push("invalid URL")}
if(r.verification!=="pending")errors.push("status must be pending");
const key=[r.manufacturer,r.model,r.yearFrom,r.yearTo,r.locationText].join("|").toLowerCase();if(seen.has(key))errors.push("duplicate");seen.add(key);
if(errors.length){failures++;console.error("Row",i+1,errors.join("; "))}
}
console.log("Checked",rows.length,"location candidates;",failures,"invalid");if(failures)process.exit(1);
