import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
// client is executed by server while embedded
// so path needs to reflect where db is.
// kinda gross tho
const client = new Database(`${Bun.env.DB_URL!}`)
export const db = drizzle({ client })
