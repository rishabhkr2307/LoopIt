import { ItemCard } from '@/components/item-card'
import { db } from '@/db'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await db.query.profiles.findFirst({
    where: { id },
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
            avgRating={
              item.reviews.length > 0
                ? (
                    item.reviews.reduce((sum, r) => (sum += r.rating), 0) / item.reviews.length
                  ).toString()
                : '0'
            }
            totalReviews={item.reviews.length}
          />
        ))}
      </div>

      {profile.items.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  )
}
