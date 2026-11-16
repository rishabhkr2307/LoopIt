import RequestList from '@/components/request-list'
import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OwnerRequestsPage() {
  const { data: session } = await auth.getSession()
  const requests = await db.query.requests.findMany({
    where: { ownerId: session?.user.id },
    with: { item: true },
  })
  if (!requests) notFound()
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{requests.length} items found</div>
          <RequestList requests={requests} />
        </div>
      </div>
    </div>
  )
}
