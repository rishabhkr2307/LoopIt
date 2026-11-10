import { auth } from '@/lib/auth/server'

export default auth.middleware({
  loginUrl: '/sign-in',
  publicRoutes: ['/sign-in', '/sign-up'],
})

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
