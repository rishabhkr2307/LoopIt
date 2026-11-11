import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { relations } from './relations'

config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL_POOLED!)
export const db = drizzle({ client: sql, logger: true, relations: relations })
