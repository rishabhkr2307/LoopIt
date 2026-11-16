'use client'
import { Item } from '@/db/schema/items'
import { Request } from '@/db/schema/requests'
import { Button } from './ui/button'
import { approveRentalRequest, rejectRentalRequest } from '@/app/actions/requests'
import { toast } from 'sonner'

function RequestList({ requests }: { requests: (Request & { item: Item | null })[] }) {
  const handleReject = async (requestId: string) => {
    try {
      await rejectRentalRequest(requestId)
      toast.success('Rejection success')
    } catch (error) {
      console.error(error)
      toast.error('Rejection failed')
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      await approveRentalRequest(requestId)
      toast.success('Approval success')
    } catch (error) {
      console.error(error)
      toast.error('Approval failed')
    }
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((req) => (
        <div key={req.id}>
          <div key={req.id}> {req.item?.name}</div>
          <Button onClick={async () => await handleApprove(req.id)}>Approve</Button>
          <Button variant="destructive" onClick={async () => await handleReject(req.id)}>
            Reject
          </Button>
        </div>
      ))}
    </div>
  )
}

export default RequestList
