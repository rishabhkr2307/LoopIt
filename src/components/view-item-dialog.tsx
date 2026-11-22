'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { itemCategories, requestDurationType } from '@/constants'
import { Item } from '@/db/schema/items'
import { StarIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react'
import { createRentalRequest } from '@/app/actions/requests'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { toast } from 'sonner'

export function ViewItemDialog({
  open,
  setOpen,
  item,
  avgRating,
  totalReviews,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  item: Item
  avgRating: string | null
  totalReviews: number
}) {
  const [state, formAction, isPending] = useActionState(createRentalRequest, null)
  const [type, setType] = useState('days')

  useEffect(() => {
    if (state?.success) {
      toast.success('Your request is created successfully')
      setOpen(false)
    }
  }, [state?.success, setOpen])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger hidden />
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <form action={formAction}>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <div className="col-span-1">
              <div className="group overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    width={1024}
                    height={1024}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {itemCategories.filter((i) => i.value == item.itemCategory)[0].label}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <StarIcon className="fill-primary text-primary h-4 w-4" />
                        <span className="text-sm font-medium">{avgRating}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">{totalReviews} reviews</p>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <h3 className="font-medium mt-4">Description</h3>
                    <span className="text-muted-foreground text-sm ">{item.description}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">${item.pricePerDay}</span>
                      <span className="text-muted-foreground text-sm">Per Day</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-medium">${item.pricePerWeek}</span>
                      <span className="text-muted-foreground text-sm">Per Week</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-medium">${item.pricePerMonth}</span>
                      <span className="text-muted-foreground text-sm">Per Month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="category">Request For</FieldLabel>
                  <Select
                    items={requestDurationType}
                    value={type}
                    onValueChange={(value) => setType(value ?? 'days')}
                  >
                    <SelectTrigger id="request_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {requestDurationType.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label htmlFor="message">Message for Owner</Label>
                  <Textarea
                    className="max-h-32 resize-none overflow-y-auto"
                    id="message"
                    name="message"
                    placeholder="(Optional) Max 200 characters allowed"
                    maxLength={200}
                  />
                </Field>

                <Field>
                  <Label htmlFor="duration" className="gap-0">
                    Duration<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder={`e.g. 12 ${type}`}
                    min={1}
                    type="number"
                    required
                  />
                </Field>
                <input type="hidden" name="duration_type" value={type} />
                <input type="hidden" name="item_id" value={item.id} />
                {state?.error && (
                  <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
                )}

                <span className="text-muted-foreground text-sm text-right italic">
                  You can negotiate after rental request approval
                </span>
              </FieldGroup>
            </div>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isPending}>
              Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
