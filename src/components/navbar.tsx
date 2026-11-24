'use client'

import { InfinityIcon } from '@phosphor-icons/react'
import { UserAvatar } from './user-avatar'
import { Profile } from '@/db/schema/profiles'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useQueryState } from 'nuqs'
import Link from 'next/link'
import { NotificationPopover } from './notification-popover'
import { SealedLiveQuery } from '@neon/realtime/client'
import { NotificationsRow } from '@/lib/realtime/notifications'

const Navbar = ({
  profile,
  isHome,
  sealedQuery,
  userId,
}: {
  profile: Profile
  isHome?: boolean
  sealedQuery: SealedLiveQuery<NotificationsRow> | null
  userId: string
}) => {
  const [searchQ, setSearchQ] = useQueryState('searchQ', {
    shallow: false,
  })
  const handleClearSearch = () => {
    setSearchQ(null)
  }
  return (
    <section className="mb-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 self-center font-medium">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <InfinityIcon className="size-4" />
              </div>
              LoopIt
            </Link>
          </div>

          <div className="flex gap-2">
            {isHome && (
              <ButtonGroup>
                <Input
                  id="input-button-group"
                  placeholder="Search items..."
                  value={searchQ ?? ''}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
                <Button variant="outline" disabled={!searchQ} onClick={handleClearSearch}>
                  Clear
                </Button>
              </ButtonGroup>
            )}
            <NotificationPopover sealedQuery={sealedQuery} userId={userId} />
            <UserAvatar profile={profile} />
          </div>
        </nav>
      </div>
    </section>
  )
}

export { Navbar }
