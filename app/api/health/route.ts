import {NextResponse} from "next/server";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(){return NextResponse.json({service:"carpaintfinder",status:"ok",databaseConfigured:Boolean(process.env.DATABASE_URL),indexingEnabled:false},{headers:{"Cache-Control":"no-store"}})}
