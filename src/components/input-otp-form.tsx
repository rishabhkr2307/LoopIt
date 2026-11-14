import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth/client'
import { InfinityIcon } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function InputOTPForm() {
  const params = useSearchParams()
  const router = useRouter()
  const email = params.get('email') ?? ''
  const [otp, setOtp] = useState('')
  if (!email) return <div>No email</div>

  const handleOtp = async () => {
    if (!otp.trim()) {
      toast.info('Please enter a valid 6 digit OTP')
      return
    }

    authClient.emailOtp
      .verifyEmail({
        email: email,
        otp: otp.trim(),
      })
      .then(() => {
        toast.success('OTP Verification Success')
        router.push('/')
      })
      .catch((err) => toast.error(err.message))
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <InfinityIcon className="size-4" />
          </div>
          LoopIt
        </a>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{' '}
              <span className="font-medium">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
              <InputOTP maxLength={6} id="otp-verification" required value={otp} onChange={setOtp}>
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <Button className="w-full" onClick={handleOtp}>
                Verify
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
