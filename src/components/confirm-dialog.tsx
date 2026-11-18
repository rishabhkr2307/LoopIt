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
import { Dispatch, ReactNode, SetStateAction } from 'react'

export function ConfirmDialog({
  open,
  setOpen,
  title,
  subtitle,
  handler,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  icon?: ReactNode
  btnText?: string
  title: string
  subtitle: string
  handler: () => void
}) {
  return (
    <Dialog open={open}>
      <DialogTrigger hidden />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            }
          />
          <Button variant="destructive" onClick={handler}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
