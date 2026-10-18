import {Pool} from "pg";
let pool:Pool|undefined;
function getPool(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL is not configured");return pool??=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:5000,ssl:process.env.PGSSL==="require"?{rejectUnauthorized:true}:undefined});}
export type PaintMatch={manufacturer:string;model:string;oem_code:string;color_name:string;year_from:number;year_to:number;source_url:string};
export async function searchVerifiedPaint(input:{make?:string;model?:string;year?:number;code?:string}):Promise<PaintMatch[]>{const conditions:string[]=[];const values:(string|number)[]=[];const add=(sql:string,value:string|number)=>{values.push(value);conditions.push(sql.replace("?",'$'+values.length))};if(input.make)add("lower(manufacturer)=lower(?)",input.make);if(input.model)add("lower(model)=lower(?)",input.model);if(input.code)add("lower(oem_code)=lower(?)",input.code);if(input.year!==undefined){values.push(input.year);conditions.push("year_from <= $"+values.length+" AND year_to >= $"+values.length)}if(!conditions.length)return [];const result=await getPool().query<PaintMatch>("SELECT manufacturer,model,oem_code,color_name,year_from,year_to,source_url FROM public_paint_applications WHERE "+conditions.join(" AND ")+" ORDER BY manufacturer,model,year_from DESC LIMIT 100",values);return result.rows;}

export type LabelLocation={manufacturer:string;model:string;year_from:number;year_to:number;location_text:string;code_field_hint:string|null;source_url:string};
export async function searchVerifiedLocations(input:{make:string;model?:string;year?:number}):Promise<LabelLocation[]>{
const values:(string|number)[]=[input.make];const conditions=["lower(manufacturer)=lower($1)"];
if(input.model){values.push(input.model);conditions.push("lower(model)=lower($"+values.length+")")}
if(input.year!==undefined){values.push(input.year);conditions.push("year_from <= $"+values.length+" AND year_to >= $"+values.length)}
const result=await getPool().query<LabelLocation>("SELECT manufacturer,model,year_from,year_to,location_text,code_field_hint,source_url FROM public_label_locations WHERE "+conditions.join(" AND ")+" ORDER BY model,year_from DESC LIMIT 50",values);
return result.rows;
}
