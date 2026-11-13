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
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'sonner'

export function InputOTPForm({ email }: { email: string }) {
  const router = useRouter()
  const [otp, setOtp] = useState('')

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
        router.push('/onboarding')
      })
      .catch((err) => toast.error(err.message))
  }
  return (
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
  )
}
