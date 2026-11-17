'use client'
import { StarIcon, TrashIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { Item } from '@/db/schema/items'
import { ViewItemDialog } from './view-item-dialog'
import { itemCategories } from '@/constants'
import { EditItemDialog } from './edit-item-dialog'
import { ConfirmDialog } from './confirm-dialog'
import { useState } from 'react'
import { deleteItemById } from '@/app/actions/items'
import { toast } from 'sonner'

export const ItemCard = ({ item, isOwner }: { item: Item; isOwner?: boolean }) => {
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    try {
      const { success, error } = await deleteItemById(item.id)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Item delete success')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setOpen(false)
    }
  }
  return (
    <div className="group overflow-hidden rounded-lg border">
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
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">${item.pricePerDay}</span>
            <span className="text-muted-foreground text-sm">Per Day</span>
          </div>
          {isOwner ? (
            <div className="flex">
              <ConfirmDialog
                size="icon"
                variant="destructive"
                icon={<TrashIcon />}
                open={open}
                setOpen={setOpen}
                title={`Delete ${item.name}`}
                subtitle="Are you sure you want to delete"
                handler={handleDelete}
              />
              <EditItemDialog item={item} />
            </div>
          ) : (
            <ViewItemDialog item={item} />
          )}
        </div>
      </div>
    </div>
  )
}
