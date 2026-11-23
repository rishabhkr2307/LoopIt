'use client'
import { ArchiveIcon, MapPinIcon, PlusIcon, StarIcon, TrashIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { Item } from '@/db/schema/items'
import { ViewItemDialog } from './view-item-dialog'
import { itemCategories } from '@/constants'
import { EditItemDialog } from './edit-item-dialog'
import { ConfirmDialog } from './confirm-dialog'
import { useState } from 'react'
import { archiveItemById, deleteItemById } from '@/app/actions/items'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { DotsThreeIcon } from '@phosphor-icons/react/dist/ssr'
import { ButtonGroup } from './ui/button-group'

export const ItemCard = ({
  item,
  isOwner,
  avgRating,
  totalReviews,
}: {
  item: Item
  isOwner?: boolean
  avgRating: string | null
  totalReviews: number
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [viewItemOpen, setViewItemOpen] = useState(false)
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
      setDeleteOpen(false)
    }
  }
  const handleArchive = async () => {
    try {
      const { success, error } = await archiveItemById(item.id)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Item archive success')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setArchiveOpen(false)
    }
  }
  return (
    <>
      <div
        className="group overflow-hidden rounded-lg border"
        onClick={() => (!isOwner ? setViewItemOpen(true) : undefined)}
      >
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
              <h3 className="font-medium max-w-32">{item.name}</h3>
              <p className="text-muted-foreground text-sm">
                {itemCategories.filter((i) => i.value == item.itemCategory)[0].label}
              </p>
              <p className="flex items-center mt-2 gap-1 text-muted-foreground text-sm">
                <MapPinIcon />
                {item.cityName}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <StarIcon className="fill-primary text-primary h-4 w-4" />
                <span className="text-sm font-medium">{avgRating ?? '0'}</span>
              </div>
              <p className="text-muted-foreground text-xs">{totalReviews} reviews</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">${item.pricePerDay}</span>
              <span className="text-muted-foreground text-sm">Per Day</span>
            </div>
            {isOwner ? (
              <div className="flex">
                <ButtonGroup>
                  <EditItemDialog item={item} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="outline" size="icon" aria-label="More Options">
                          <DotsThreeIcon />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <TrashIcon /> Delete Item
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
                          <ArchiveIcon /> Archive Item
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ButtonGroup>
              </div>
            ) : (
              <Button size="sm" className="h-8">
                <PlusIcon className="mr-2 h-4 w-4" />
                More
              </Button>
            )}
          </div>
        </div>
      </div>
      {isOwner ? (
        <>
          <ConfirmDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            title={`Delete ${item.name}`}
            subtitle="Are you sure you want to delete"
            handler={handleDelete}
          />
          <ConfirmDialog
            open={archiveOpen}
            setOpen={setArchiveOpen}
            title={`Archive ${item.name}`}
            subtitle="Are you sure you want to archive"
            handler={handleArchive}
          />
        </>
      ) : (
        <ViewItemDialog
          open={viewItemOpen}
          setOpen={setViewItemOpen}
          item={item}
          avgRating={avgRating}
          totalReviews={totalReviews}
        />
      )}
    </>
  )
}
