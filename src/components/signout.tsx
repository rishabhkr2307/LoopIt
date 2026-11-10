'use client'

import { authClient } from '@/lib/auth/client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

function SignOut() {
  const router = useRouter()
  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }
  return <Button onClick={handleSignOut}> Sign Out</Button>
}

export default SignOut
