'use client'
import { ButtonGroup } from './ui/button-group'
import {
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  FunnelXIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { Button } from './ui/button'
import { useQueryState } from 'nuqs'
import { cn } from 'cn'

function RequestFilter() {
  const [requestStatus, setRequestStatus] = useQueryState('requestStatus', {
    shallow: false,
  })
  return (
    <div className="text-muted-foreground mb-4 text-sm">
      <ButtonGroup>
        <Button
          variant="outline"
          className={cn(requestStatus == 'pending' && 'bg-accent text-accent-foreground')}
          onClick={() => setRequestStatus('pending')}
        >
          <ClockIcon />
          Pending
        </Button>
        <Button
          variant="outline"
          className={cn(requestStatus == 'approved' && 'bg-accent text-accent-foreground')}
          onClick={() => setRequestStatus('approved')}
        >
          <CheckCircleIcon />
          Approved
        </Button>
        <Button
          variant="outline"
          className={cn(requestStatus == 'rejected' && 'bg-accent text-accent-foreground')}
          onClick={() => setRequestStatus('rejected')}
        >
          <XCircleIcon />
          Rejected
        </Button>
        <Button
          variant="outline"
          className={cn(requestStatus == 'completed' && 'bg-accent text-accent-foreground')}
          onClick={() => setRequestStatus('completed')}
        >
          <CheckIcon />
          Completed
        </Button>
        <Button
          variant="outline"
          className={cn(requestStatus && 'text-destructive')}
          onClick={() => setRequestStatus(null)}
        >
          <FunnelXIcon />
          Clear
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default RequestFilter
