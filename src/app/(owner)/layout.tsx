import { Navbar } from '@/components/navbar'
import ProfileCard from '@/components/profile-card'
import { db } from '@/db'
import { City } from '@/db/schema/cities'
import { auth } from '@/lib/auth/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
export const metadata: Metadata = {
  title: 'LoopIt Owner',
  description:
    'A peer to peer rental marketplace that enables people to borrow and lend everyday items',
}

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
    with: { city: true },
  })
  if (!profile) return notFound()
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <Navbar profile={profile} />
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Mobile View */}
        <div className="mb-4 lg:hidden">
          <ProfileCard profile={profile} isOwner city={profile.city as City} />
        </div>
        {/* Desktop View */}
        <div className="hidden w-64 shrink-0 lg:block">
          <ProfileCard profile={profile} isOwner city={profile.city as City} />
        </div>
        {children}
      </div>
    </div>
  )
}
