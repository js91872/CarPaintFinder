import {NextRequest,NextResponse} from "next/server";
import {searchVerifiedLocations} from "../../../lib/paint-db";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
const q=req.nextUrl.searchParams;const make=(q.get("make")||"").trim(),model=(q.get("model")||"").trim(),rawYear=q.get("year");
if(!make||make.length>80||model.length>80)return NextResponse.json({error:"A valid manufacturer is required"},{status:400});
let year:number|undefined;
if(rawYear!==null){year=Number(rawYear);if(!Number.isInteger(year)||year<1900||year>2100)return NextResponse.json({error:"Invalid year"},{status:400})}
if(!process.env.DATABASE_URL)return NextResponse.json({status:"database_not_configured",results:[]},{status:503});
try{const results=await searchVerifiedLocations({make,model,year});return NextResponse.json({results,count:results.length},{headers:{"Cache-Control":"no-store"}})}
catch(error){console.error("Label location lookup failed",error);return NextResponse.json({error:"Location lookup temporarily unavailable"},{status:503})}
}
