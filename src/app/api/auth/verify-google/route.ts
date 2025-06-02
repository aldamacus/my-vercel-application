import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 });
    }
    return NextResponse.json({ user: { email: payload.email } });
  } catch (e) {
    return NextResponse.json({ error: "Invalid token " + e }, { status: 401 });
  }
}
