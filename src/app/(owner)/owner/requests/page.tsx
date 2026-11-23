import RequestList from '@/components/request-list'
import { pageSize } from '@/constants'
import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { requestsFilterSchema } from '@/schema/filter'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function OwnerRequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const { requestStatus, page } = requestsFilterSchema.parse(await searchParams)

  const { data: session } = await auth.getSession()
  if (!session || !session.user) return <div>No session</div>
  const requests = await db.query.requests.findMany({
    where: { ownerId: session?.user.id, ...(requestStatus ? { status: requestStatus } : {}) },
    with: {
      item: true,
      conversation: {
        with: { messages: true },
      },
    },
    orderBy: (requests, { desc }) => desc(requests.createdAt),
    limit: pageSize,
    offset: page ? (page - 1) * pageSize : 0,
  })
  if (!requests) notFound()
  return <RequestList requests={requests} userId={session.user.id} isOwner />
}
