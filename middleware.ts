import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export function middleware(req: NextRequest) {

    const token = req.cookies.get("adminToken")?.value;

    const isLoginPage = req.nextUrl.pathname === ("/admin");

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
}



export const config = {
    matcher: [
        "/admin/:path*",
    ],
};
