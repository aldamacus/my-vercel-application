import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/authConstants";
import { verifySessionJwt } from "@/lib/authJwt";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({});
  }
  const email = await verifySessionJwt(token);
  if (!email) {
    return NextResponse.json({});
  }
  return NextResponse.json({ email });
}
