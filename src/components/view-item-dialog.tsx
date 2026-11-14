'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { itemCategories } from '@/constants'
import { Item } from '@/db/schema/items'
import { PlusIcon, StarIcon } from '@phosphor-icons/react'
import Image from 'next/image'

export function ViewItemDialog({ item }: { item: Item }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" className="h-8">
            <PlusIcon className="mr-2 h-4 w-4" />
            More
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
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
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <p className="text-muted-foreground text-xs">101 reviews</p>
              </div>
            </div>
            <h3 className="font-medium mt-4">Description</h3>
            <span className="text-muted-foreground text-sm">{item.description}</span>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">${item.pricePerDay}</span>
                <span className="text-muted-foreground text-sm">Per Day</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">${item.pricePerWeek}</span>
                <span className="text-muted-foreground text-sm">Per Week</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">${item.pricePerMonth}</span>
                <span className="text-muted-foreground text-sm">Per Month</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Request Rental</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
