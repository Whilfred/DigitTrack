// À placer dans /lib/db.js
// npm install pg
// .env.local : DATABASE_URL=postgresql://user:motdepasse@localhost:5432/winner_school
import { Pool } from 'pg'

const globalForPg = globalThis

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool

export const query = (text, params) => pool.query(text, params)
