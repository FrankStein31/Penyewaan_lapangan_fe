import { NextResponse } from 'next/server'

export function middleware(request) {
    const token = request.cookies.get('token')
    
    if (!token && !request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/pemesanan/:path*',
        '/lapangan/:path*'
    ]
} 