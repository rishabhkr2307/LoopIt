'use client'
import { SidebarFilters } from './sidebar-filters'
import { ItemCard } from './item-card'
import { Item } from '@/db/schema/items'
import { Navbar } from './navbar'
import { Profile } from '@/db/schema/profiles'
import { City } from '@/db/schema/cities'
import Pagination from './pagination'
import { EmptyState } from './empty-state'
import { filterSchema } from '@/schema/filter'
import * as z from 'zod'
import { NotificationsRow } from '@/lib/realtime/notifications'
import { SealedLiveQuery } from '@neon/realtime/client'

export default function FilterPage({
  items,
  profile,
  city,
  reviewInfo,
  filters,
  sealedQuery,
}: {
  items: Item[]
  profile: Profile
  city: City | null
  reviewInfo: {
    itemId: string | null
    avgRating: string | null
    totalReviews: number
  }[]
  filters: z.infer<typeof filterSchema>
  sealedQuery: SealedLiveQuery<NotificationsRow> | null
}) {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <Navbar profile={profile} isHome sealedQuery={sealedQuery} userId={profile.userId} />
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <SidebarFilters city={city} />

        {/* Item Grid */}
        <div className="flex-1">
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
            <EmptyState
              title="No Items Available"
              description={`Currently no items are available in ${filters.cityName || city?.name} ${filters.category && filters.category.length > 0 ? 'for selected categories' : ''}`}
            />
          )}
          <Pagination nextDisabled={items.length < 12} />
        </div>
      </div>
    </div>
  )
}
