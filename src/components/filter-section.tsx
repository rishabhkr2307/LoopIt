import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between py-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0" />}>
          {isOpen ? <CaretUpIcon className="h-4 w-4" /> : <CaretDownIcon className="h-4 w-4" />}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="pb-4">{children}</CollapsibleContent>
      <Separator />
    </Collapsible>
  )
}
