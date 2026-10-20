// À placer dans /lib/db.js
import { Pool } from 'pg'

const globalForPg = globalThis

const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '')

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  })

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool

export const query = (text, params) => pool.query(text, params)
