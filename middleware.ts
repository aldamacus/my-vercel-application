import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/authConstants";
import { verifySessionJwt } from "@/lib/authJwt";
import { isAdminEmail } from "@/lib/admin";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const url = request.nextUrl.clone();

  if (!token) {
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const email = await verifySessionJwt(token);
  if (!email) {
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin")) {
    if (!isAdminEmail(email)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (path.startsWith("/profile") && isAdminEmail(email)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
