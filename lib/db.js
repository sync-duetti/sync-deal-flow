import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL missing')

let pool
if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
  })
}
pool = global._pgPool

export async function query(text, params) {
  return pool.query(text, params)
}
