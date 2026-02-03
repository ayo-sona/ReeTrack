import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const currentRole = request.cookies.get("current_role")?.value;
  const userRoles = request.cookies.get("user_roles")?.value
    ? request.cookies.get("user_roles")?.value?.split(",")
    : "";
  const { pathname } = request.nextUrl;
  // console.log("current_role", currentRole);
  // console.log("user_roles", userRoles);

  // Public paths that don't require authentication
  const publicPaths = ["/auth", "/members/dashboard"];

  // If user is not authenticated and trying to access protected routes
  // if (!token && !publicPaths.some((path) => pathname.startsWith(path))) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   url.search = `redirect=${pathname}`;
  //   return NextResponse.redirect(url);
  // }

  // Role-based route protection
  if (token && currentRole && userRoles) {
    // Member trying to access organization routes
    if (pathname.startsWith("/organization") && currentRole === "MEMBER") {
      return NextResponse.redirect(new URL("/select-role", request.url));
    }

    // Organization admin/staff trying to access member routes
    if (
      pathname.startsWith("/member") &&
      (currentRole === "STAFF" || currentRole === "ADMIN")
    ) {
      return NextResponse.redirect(new URL("/select-role", request.url));
    }

    if (!userRoles.includes("MEMBER") && pathname.startsWith("/select-role")) {
      return NextResponse.redirect(new URL("/select-org", request.url));
    }

    if (
      !(userRoles.includes("ADMIN") || userRoles.includes("STAFF")) &&
      (pathname.startsWith("/select-org") ||
        pathname.startsWith("/select-role"))
    ) {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  if (!userRoles) {
    if (
      token &&
      (pathname.startsWith("/organization") ||
        pathname.startsWith("/select-role") ||
        pathname.startsWith("/select-org"))
    ) {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths this proxy should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
