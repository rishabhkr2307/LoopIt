import { db } from '@/db'
import { City } from '@/db/schema/cities'
import { auth } from '@/lib/auth/server'

export async function getAllCities(): Promise<{
  success: boolean
  error?: string
  data?: City[]
}> {
  const { data: session } = await auth.getSession()
  if (!session?.user) {
    return { success: false, error: 'You should be logged in.' }
  }
  const cities = await db.query.cities.findMany({})
  if (!cities) {
    return { success: false, error: 'No city exist' }
  }

  return { success: true, data: cities }
}
