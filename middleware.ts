import { NextRequest } from "next/server";
import { proxy } from "./src/proxy";

export default function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
