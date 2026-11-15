'use client'

import { InfinityIcon } from '@phosphor-icons/react'
import { UserAvatar } from './user-avatar'
import { Profile } from '@/db/schema/profiles'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useQueryState } from 'nuqs'

const Navbar = ({ profile }: { profile: Profile }) => {
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
            <a href="#" className="flex items-center gap-2 self-center font-medium">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <InfinityIcon className="size-4" />
              </div>
              LoopIt
            </a>
          </div>
          <div className="flex gap-2">
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
            <UserAvatar profile={profile} />
          </div>
        </nav>
      </div>
    </section>
  )
}

export { Navbar }
