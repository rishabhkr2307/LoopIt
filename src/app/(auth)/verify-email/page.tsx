'use client'

import { InputOTPForm } from '@/components/input-otp-form'
import { InfinityIcon } from '@phosphor-icons/react'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  if (!email) return <div>No email</div>
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <InfinityIcon className="size-4" />
          </div>
          LoopIt
        </a>
        <InputOTPForm email={email} />
      </div>
    </div>
  )
}
