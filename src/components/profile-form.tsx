import { cn } from 'cn'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useActionState } from 'react'
import { createProfile } from '@/app/actions/profile'

export function ProfileForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState(createProfile, null)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Onboarding</CardTitle>
          <CardDescription>Continue to setup your own profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea id="bio" name="bio" />
              </Field>
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" name="city" type="text" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="city">Pin Code</FieldLabel>
                <Input id="pincode" name="pincode" type="text" required />
              </Field>
              {state?.error && (
                <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
              )}
              <Field>
                <Button type="submit" disabled={isPending}>
                  Continue
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
