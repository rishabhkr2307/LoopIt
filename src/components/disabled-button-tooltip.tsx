import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ReactNode } from 'react'

export function DisabledButtonTooltip({
  children,
  message,
}: {
  children: ReactNode
  message: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span>{children}</span>} />
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  )
}
