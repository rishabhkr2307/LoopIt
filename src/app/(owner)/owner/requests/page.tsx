import RequestList from '@/components/request-list'
import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OwnerRequestsPage() {
  const { data: session } = await auth.getSession()
  if (!session || !session.user) return <div>No session</div>
  const requests = await db.query.requests.findMany({
    where: { ownerId: session?.user.id },
    with: {
      item: true,
      conversation: {
        with: { messages: true },
      },
    },
  })
  if (!requests) notFound()
  return <RequestList requests={requests} userId={session.user.id} isOwner />
}
