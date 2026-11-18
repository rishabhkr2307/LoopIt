import { ItemCard } from '@/components/item-card'
import ProfileFilter from '@/components/profile-filter'
import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { profileFilterSchema } from '@/schema/filter'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function OwnerProfilePage({ searchParams }: { searchParams: SearchParams }) {
  const { itemStatus } = profileFilterSchema.parse(await searchParams)
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
    with: {
      items: {
        where: itemStatus ? { itemStatus } : {},
        with: { reviews: true },
      },
    },
  })
  if (!profile) {
    return notFound()
  }
  return (
    <div className="flex-1">
      <ProfileFilter />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profile.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isOwner
            avgRating={
              item.reviews.length > 0
                ? item.reviews.reduce((sum, r) => (sum += r.rating), 0).toString()
                : '0'
            }
            totalReviews={item.reviews.length}
          />
        ))}
      </div>

      {profile.items.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium">No items found</h3>
        </div>
      )}
    </div>
  )
}
