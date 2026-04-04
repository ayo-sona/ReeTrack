import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PATHS = [
  "/organization",
  "/select-role",
  "/select-org",
  "/member",
];
const AUTH_PATHS = ["/auth/login", "/auth/register"];

function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete("access_token");
  response.cookies.delete("current_role");
  response.cookies.delete("user_roles");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const currentRole = request.cookies.get("current_role")?.value;

  // Always parse userRoles as a clean string array
  const userRolesRaw = request.cookies.get("user_roles")?.value ?? "";
  const userRoles: string[] = userRolesRaw
    ? userRolesRaw.split(",").map((r) => r.trim().toUpperCase())
    : [];
  // console.log(token, currentRole, userRoles);

  const isMember = userRoles.includes("MEMBER");
  const isOrg = userRoles.includes("ADMIN") || userRoles.includes("STAFF");
  const isPrivatePath = PRIVATE_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // ── 1. Unauthenticated user hitting a private route ──────────────────────
  if (!token && isPrivatePath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.search = `redirect=${encodeURIComponent(pathname)}`;
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response); // properly clear via response headers
    return response;
  }

  // ── 2. Authenticated user hitting auth pages — redirect away ─────────────
  if (token && isAuthPath) {
    if (isMember && isOrg) {
      return NextResponse.redirect(new URL("/select-role", request.url));
    }
    if (isOrg && !isMember) {
      return NextResponse.redirect(new URL("/select-org", request.url));
    }
    return NextResponse.redirect(new URL("/member/dashboard", request.url));
  }

  // ── 3. Role-based route protection (requires token) ──────────────────────
  if (token) {
    // No userRoles at all — roles cookie is missing/expired
    // Send to login to re-authenticate cleanly
    if (userRoles.length === 0 && isPrivatePath) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.search = `redirect=${encodeURIComponent(pathname)}`;
      const response = NextResponse.redirect(loginUrl);
      clearAuthCookies(response);
      return response;
    }

    // Member trying to access org routes
    if (pathname.startsWith("/organization") && currentRole === "MEMBER") {
      // If they also have org role, let them pick
      if (isOrg)
        return NextResponse.redirect(new URL("/select-role", request.url));
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }

    // Org role trying to access member routes without switching
    if (
      pathname.startsWith("/member") &&
      (currentRole === "STAFF" || currentRole === "ADMIN")
    ) {
      if (isMember)
        return NextResponse.redirect(new URL("/select-role", request.url));
      return NextResponse.redirect(new URL("/select-org", request.url));
    }

    // Pure member (no org role) trying to reach org selection screens
    if (
      !isOrg &&
      (pathname.startsWith("/select-role") ||
        pathname.startsWith("/select-org"))
    ) {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }

    // Pure org user (no member role) trying to reach select-role
    if (!isMember && isOrg && pathname.startsWith("/select-role")) {
      return NextResponse.redirect(new URL("/select-org", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
