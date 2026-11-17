'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TrashIcon } from '@phosphor-icons/react'
import { Item } from '@/db/schema/items'
import { deleteItemById } from '@/app/actions/items'
import { toast } from 'sonner'
import { useState } from 'react'

export function DeleteItemDialog({ item }: { item: Item }) {
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
    <Dialog open={open}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <TrashIcon />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete {item.name} </DialogTitle>
          <DialogDescription>Are you sure you want to delete?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            }
          />
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
