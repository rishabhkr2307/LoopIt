'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from './ui/textarea'
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { reviewType } from '@/constants'
import { Request } from '@/db/schema/requests'
import { createReview } from '@/app/actions/reviews'
import { toast } from 'sonner'

export function CreateReviewDialog({
  open,
  setOpen,
  request,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  request: Request
}) {
  const [state, formAction, isPending] = useActionState(createReview, null)
  const [type, setType] = useState('item')
  useEffect(() => {
    if (state?.success) {
      toast.success(`Your review for ${type} is created successfully`)
      setOpen(false)
    }
  }, [state?.success, setOpen, type])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger hidden />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create Review</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="status">Type</FieldLabel>
                <Select
                  items={reviewType}
                  value={type}
                  onValueChange={(type) => setType(type ?? 'item')}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {reviewType.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="rating">Rate (Out of 5)</Label>
                <Input id="rating" name="rating" type="number" min={0} max={5} />
              </Field>
              <Field>
                <Label htmlFor="bio">Review</Label>
                <Textarea
                  className="max-h-32 resize-none overflow-y-auto"
                  id="description"
                  name="description"
                  placeholder="Your review goes here"
                />
              </Field>
              <input type="hidden" name="review_type" value={type} />
              <input type="hidden" name="item_id" value={request?.itemId} />
              <input type="hidden" name="owner_id" value={request?.ownerId} />
              <input type="hidden" name="borrower_id" value={request?.borrowerId} />
              {state?.error && (
                <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
              )}
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
