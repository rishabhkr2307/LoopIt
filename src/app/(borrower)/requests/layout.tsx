import { Navbar } from '@/components/navbar'
import ProfileCard from '@/components/profile-card'
import { db } from '@/db'
import { City } from '@/db/schema/cities'
import { auth } from '@/lib/auth/server'
import { sealNotifications } from '@/lib/realtime/notifications'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function BorrowerRequestLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
    with: {
      city: true,
      borrowerReviews: true,
    },
  })
  if (!profile || !session) return notFound()
  const sealedNotificationQuery = await sealNotifications(session.user.id)
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <Navbar profile={profile} sealedQuery={sealedNotificationQuery} userId={session.user.id} />
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Mobile View */}
        <div className="mb-4 lg:hidden">
          <ProfileCard
            profile={profile}
            city={profile.city as City}
            reviews={profile.borrowerReviews}
          />
        </div>
        {/* Desktop View */}
        <div className="hidden w-64 shrink-0 lg:block">
          <ProfileCard
            profile={profile}
            city={profile.city as City}
            reviews={profile.borrowerReviews}
          />
        </div>
        {children}
      </div>
    </div>
  )
}
