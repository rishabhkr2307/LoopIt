import { ItemCard } from '@/components/item-card'
import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OwnerProfilePage() {
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
    with: {
      items: {
        with: { reviews: true },
      },
    },
  })
  if (!profile) {
    return notFound()
  }
  return (
    <div className="flex-1">
      <div className="text-muted-foreground mb-4 text-sm">{profile.items.length} items found</div>

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
