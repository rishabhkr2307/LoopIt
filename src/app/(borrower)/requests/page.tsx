import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BorrowerRequestsPage() {
  const { data: session } = await auth.getSession()
  const requests = await db.query.requests.findMany({
    where: { borrowerId: session?.user.id },
    with: { item: true },
  })
  if (!requests) notFound()
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Item Grid */}
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{requests.length} items found</div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div key={req.id}> {req.item?.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
