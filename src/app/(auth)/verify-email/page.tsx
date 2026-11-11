'use client'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ArrowUpRightIcon, WarningCircleIcon } from '@phosphor-icons/react'

export function Page() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary text-primary-foreground">
          <WarningCircleIcon />
        </EmptyMedia>
        <EmptyTitle>Mail not verified</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t verified your email. Please check you inbox.
        </EmptyDescription>
      </EmptyHeader>
      <Button
        variant="link"
        className="text-muted-foreground"
        size="sm"
        nativeButton={false}
        render={
          <a href="/onboarding">
            Onboard <ArrowUpRightIcon />
          </a>
        }
      />
    </Empty>
  )
}

export default Page
