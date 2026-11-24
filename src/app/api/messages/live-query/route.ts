import { sealMessages } from '@/lib/realtime/messages'

const noStore = { 'Cache-Control': 'private, no-store' }

export async function POST(request: Request) {
  const { conversationId } = await request.json()
  return Response.json(await sealMessages(conversationId), { headers: noStore })
}
