'use client'
import { ButtonGroup } from './ui/button-group'
import { ArchiveIcon, CheckIcon, FunnelXIcon, ProhibitIcon } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { useQueryState } from 'nuqs'
import { cn } from 'cn'

function ProfileFilter() {
  const [itemStatus, setItemStatus] = useQueryState('itemStatus', {
    shallow: false,
  })
  return (
    <div className="text-muted-foreground mb-4 text-sm">
      <ButtonGroup>
        <Button
          variant="outline"
          className={cn(itemStatus == 'available' && 'bg-accent text-accent-foreground')}
          onClick={() => setItemStatus('available')}
        >
          <CheckIcon />
          Available
        </Button>
        <Button
          variant="outline"
          className={cn(itemStatus == 'rented' && 'bg-accent text-accent-foreground')}
          onClick={() => setItemStatus('rented')}
        >
          <ProhibitIcon />
          Rented
        </Button>
        <Button
          variant="outline"
          className={cn(itemStatus == 'archived' && 'bg-accent text-accent-foreground')}
          onClick={() => setItemStatus('archived')}
        >
          <ArchiveIcon />
          Archived
        </Button>
        <Button
          variant="outline"
          className={cn(itemStatus && 'text-destructive')}
          onClick={() => setItemStatus(null)}
        >
          <FunnelXIcon />
          Clear
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default ProfileFilter
