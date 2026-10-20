import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ACCOUNT_PATHS = [
  "/account/signin",
  "/account/signup",
  "/account/forgot",
  "/account/reset",
  "/account/confirm",
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Skip auth middleware if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — must call getUser() not getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from signin/signup
  if (user && (pathname === "/account/signin" || pathname === "/account/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/charts";
    return NextResponse.redirect(url);
  }

  // Protect /account/* routes (except public ones)
  if (pathname.startsWith("/account") && !user) {
    const isPublic = PUBLIC_ACCOUNT_PATHS.some((p) => pathname.startsWith(p));
    if (!isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/account/signin";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
