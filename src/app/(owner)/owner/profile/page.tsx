import { ItemCard } from '@/components/item-card'
import ProfileCard from '@/components/profile-card'
import { db } from '@/db'
import { auth } from '@/lib/auth/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OwnerProfilePage() {
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
    with: { items: true },
  })
  if (!profile) {
    return notFound()
  }
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Mobile View */}
        <div className="mb-4 lg:hidden">
          <ProfileCard profile={profile} isOwner />
        </div>

        {/* Desktop View */}
        <div className="hidden w-64 shrink-0 lg:block">
          <ProfileCard profile={profile} isOwner />
        </div>

        {/* Item Grid */}
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">
            {profile.items.length} items found
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profile.items.map((item) => (
              <ItemCard key={item.id} item={item} isOwner />
            ))}
          </div>

          {profile.items.length === 0 && (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium">No items found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
