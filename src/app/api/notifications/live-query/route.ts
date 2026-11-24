import { sealNotifications } from '@/lib/realtime/notifications'

const noStore = { 'Cache-Control': 'private, no-store' }

export async function POST(request: Request) {
  const { userId } = await request.json()
  return Response.json(await sealNotifications(userId), { headers: noStore })
}
