'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from './ui/textarea'
import { useActionState, useState } from 'react'
import { editProfile } from '@/app/actions/profile'
import { Profile } from '@/db/schema/profiles'
import { City } from '@/db/schema/cities'
import { PencilIcon } from '@phosphor-icons/react'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete'

export function EditProfileDialog({ profile, city: propCity }: { profile: Profile; city: City }) {
  const [state, formAction, isPending] = useActionState(editProfile, null)
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')

  // @ts-expect-error Geoapify does not provide a type for feature
  const onPlaceSelected = (feature) => {
    const p = feature?.properties

    const city =
      p?.city || p?.town || p?.village || p?.state_district || p?.district || p?.county || ''
    setCity(city)

    const pincode = p?.postcode || ''
    setPincode(pincode)
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PencilIcon />
            Edit Profile
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Avatar</Label>
                <Input id="avatar" name="avatar" type="file" accept="image/*" />
              </Field>
              <Field>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  className="max-h-32 resize-none overflow-y-auto"
                  id="bio"
                  name="bio"
                  placeholder="Your bio goes here"
                  defaultValue={profile.bio ?? ''}
                />
              </Field>
              <Field>
                <Label htmlFor="name" className="gap-0">
                  Pincode<span className="text-red-500">*</span>
                </Label>
                <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}>
                  <GeoapifyGeocoderAutocomplete
                    placeholder="Search for an address"
                    lang="en"
                    limit={8}
                    addDetails={true}
                    placeSelect={onPlaceSelected}
                    type="postcode"
                    value={propCity.pincode}
                  />
                </GeoapifyContext>
              </Field>
              <input type="hidden" name="profile_id" value={profile.id} />
              {state?.error && (
                <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
              )}
              <Input id="city" name="city" hidden type="text" value={city} />
              <Input id="pincode" name="pincode" hidden type="text" value={pincode} />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
