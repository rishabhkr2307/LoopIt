import 'server-only'

import { createRealtime } from '@neon/realtime/server'
import { drizzleAdapter } from '@neon/realtime-drizzle'

let realtime: ReturnType<typeof create> | undefined
function create() {
  return createRealtime({
    secret: process.env.NEON_REALTIME_SECRET!,
    db: process.env.NEON_DATABASE_NAME!,
    adapter: drizzleAdapter(),
    debugMode: process.env.NODE_ENV === 'development',
  })
}
export const getRealtime = () => (realtime ??= create())
