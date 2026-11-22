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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { PlusIcon } from '@phosphor-icons/react'
import { useActionState, useState } from 'react'
import { createItem } from '@/app/actions/items'
import { itemCategories } from '@/constants'

export function CreateItemDialog() {
  const [state, formAction, isPending] = useActionState(createItem, null)
  const [category, setCategory] = useState('electronics_gadgets')

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PlusIcon /> New item
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
            <DialogDescription>Create a new Item</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="image" className="gap-0">
                Image
                <span className="text-red-500">*</span>
              </Label>
              <Input id="image" name="image" type="file" accept="image/*" required />
            </Field>
            <Field>
              <Label htmlFor="name" className="gap-0">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" required />
            </Field>
            <Field>
              <Label htmlFor="description" className="gap-0">
                Description <span className="text-red-500">*</span>{' '}
              </Label>
              <Textarea
                className="max-h-32 resize-none overflow-y-auto"
                id="description"
                name="description"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="category" className="gap-0">
                Category<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={itemCategories}
                value={category}
                onValueChange={(value) => setCategory(value ?? 'electronics_gadgets')}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="price_per_day">Price Per Day</Label>
              <Input id="price_per_day" name="price_per_day" placeholder="0" type="number" />
            </Field>
            <Field>
              <Label htmlFor="price_per_week">Price Per Week</Label>
              <Input id="price_per_week" name="price_per_week" placeholder="0" type="number" />
            </Field>
            <Field>
              <Label htmlFor="price_per_month">Price Per Month</Label>
              <Input id="price_per_month" name="price_per_month" placeholder="0" type="number" />
            </Field>
            <input type="hidden" name="category" value={category} />
            {state?.error && (
              <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
            )}
          </FieldGroup>
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
