'use client'
import { SidebarFilters } from './sidebar-filters'
import { ItemCard } from './item-card'
import { Item } from '@/db/schema/items'
import { Navbar } from './navbar'
import { Profile } from '@/db/schema/profiles'
import { Notification } from '@/db/schema/notifications'

export default function FilterPage({
  items,
  profile,
  reviewInfo,
  notifications,
}: {
  items: Item[]
  profile: Profile
  reviewInfo: {
    itemId: string | null
    avgRating: string | null
    totalReviews: number
  }[]
  notifications: Notification[]
}) {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <Navbar profile={profile} isHome notifications={notifications} />
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <SidebarFilters />

        {/* Item Grid */}
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{items.length} items found</div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                avgRating={
                  reviewInfo.find((r) => r.itemId == item.id)?.avgRating?.slice(0, 4) ?? '0'
                }
                totalReviews={reviewInfo.find((r) => r.itemId == item.id)?.totalReviews ?? 0}
              />
            ))}
          </div>

          {items.length === 0 && (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
