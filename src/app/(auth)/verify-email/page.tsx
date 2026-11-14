'use client'

import { InputOTPForm } from '@/components/input-otp-form'
import { Suspense } from 'react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InputOTPForm />
    </Suspense>
  )
}
