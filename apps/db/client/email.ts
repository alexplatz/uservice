import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import { users, emails } from '../schema'

// client is executed by server while embedded
// so path needs to reflect where db is.
// kinda gross tho
const client = new Database(`${Bun.env.DB_URL!}`)
export const db = drizzle({ client })


const createUserEmailDb = (db: BunSQLiteDatabase) => async (userId: string, email: string) =>
  await db
    .insert(emails)
    .values([{
      email,
      userId,
    }])
    .returning()
    .get()

const updateUserEmailDb = (db: BunSQLiteDatabase) => async (userId: string, emailId: string, email: string, isPrimary: boolean, verified: boolean) =>
  await db
    .insert(emails)
    .values([{
      id: emailId,
      email,
      isPrimary,
      verified,
      userId
    }])
    .onConflictDoUpdate({
      target: emails.id,
      set: {
        email,
        isPrimary,
        verified
      }
    })
    .returning()

const getUserEmailDb = (db: BunSQLiteDatabase) => async (emailId) =>
  await db
    .select()
    .from(emails)
    .where(eq(emails.id, emailId))
    .get()

const deleteUserEmailDb = (db: BunSQLiteDatabase) => async (emailId: string) =>
  await db
    .delete(emails)
    .where(eq(emails.id, emailId))


/* composite queries */


const getAllUserEmailsDb = (db: BunSQLiteDatabase) => async (userId) =>
  await db
    .select({
      id: emails.id,
      email: emails.email,
      isPrimary: emails.isPrimary,
      verified: emails.verified
    })
    .from(emails)
    .leftJoin(users, eq(users.id, emails.userId))
    .where(eq(users.id, userId))


/* exports */

export const [
  getAllUserEmails, createUserEmail, deleteUserEmail, updateUserEmail, getUserEmail
] = [
    getAllUserEmailsDb(db), createUserEmailDb(db), deleteUserEmailDb(db), updateUserEmailDb(db), getUserEmailDb(db)
  ]
