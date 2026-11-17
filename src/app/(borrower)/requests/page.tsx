import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'
import RequestList from '@/components/request-list'

export const dynamic = 'force-dynamic'

export default async function BorrowerRequestsPage() {
  const { data: session } = await auth.getSession()
  if (!session || !session.user) return <div>No session</div>
  const requests = await db.query.requests.findMany({
    where: { borrowerId: session?.user.id },
    with: {
      item: true,
      conversation: {
        with: { messages: true },
      },
    },
  })
  if (!requests) notFound()
  return <RequestList requests={requests} userId={session.user.id} />
}
