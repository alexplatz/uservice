import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { dataPoints } from './schema'

// in practice, this would be a secrets managed url.
// also, client is executed by server while embedded
// so path needs to reflect where db is.
// kinda gross tho
const client = new Database('../db/data.db')
export const db = drizzle({ client })

const getAllDb = (db: BunSQLiteDatabase) => () =>
  db.select().from(dataPoints).all()


const persistValueDb = (db: BunSQLiteDatabase) => (clientId, value) =>
  db.insert(dataPoints).values({ clientId, value }).returning()


export const [getAll, persistValue] = [getAllDb(db), persistValueDb(db)]
