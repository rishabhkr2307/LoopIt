import { getItemsByProfile } from '@/app/actions/items'
import { getProfile } from '@/app/actions/profile'
import { ItemCard } from '@/components/item-card'
import ProfileCard from '@/components/profile-card'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: profile } = await getProfile(id)
  const { data: items = [] } = await getItemsByProfile(id)
  if (!profile) return notFound()
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Mobile View */}
        <div className="mb-4 lg:hidden">
          <ProfileCard profile={profile} />
        </div>

        {/* Desktop View */}
        <div className="hidden w-64 shrink-0 lg:block">
          <ProfileCard profile={profile} />
        </div>

        {/* Item Grid */}
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{items.length} items found</div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
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
