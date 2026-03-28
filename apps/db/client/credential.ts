import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import { users, credentials } from '../schema'

// client is executed by server while embedded
// so path needs to reflect where db is.
// kinda gross tho
const client = new Database(`${Bun.env.DB_URL!}`)
export const db = drizzle({ client })


const createUserCredentialDb = (db: BunSQLiteDatabase) => async (id: string, userId: string, publicKey: string, algorithm: number, transports: string[]) =>
  await db
    .insert(credentials)
    .values([{
      id,
      publicKey,
      algorithm,
      transports,
      userId,
    }])
    .onConflictDoUpdate({
      target: credentials.id,
      set: {
        transports
      }
    })
    .returning()
    .get()

const updateUserCredentialDb = (db: BunSQLiteDatabase) => async (id: string, transports: string[]) =>
  await db
    .update(credentials)
    .set({
      transports,
    })
    .where(eq(credentials.id, id))
    .returning()
    .get()

const getUserCredentialDb = (db: BunSQLiteDatabase) => async (credentialId: string) =>
  await db
    .select()
    .from(credentials)
    .where(eq(credentials.id, credentialId))
    .get()

const deleteUserCredentialDb = (db: BunSQLiteDatabase) => async (credentialId: string) =>
  await db
    .delete(credentials)
    .where(eq(credentials.id, credentialId))


/* composite queries */


const getAllUserCredentialsDb = (db: BunSQLiteDatabase) => async (userId: string) =>
  await db
    .select({
      id: credentials.id,
      publicKey: credentials.publicKey,
      algorithm: credentials.algorithm,
      transports: credentials.transports,
    })
    .from(credentials)
    .leftJoin(users, eq(users.id, credentials.userId))
    .where(eq(users.id, userId))


/* exports */

export const [
  getAllUserCredentials, createUserCredential, deleteUserCredential, updateUserCredential, getUserCredential
] = [
    getAllUserCredentialsDb(db), createUserCredentialDb(db), deleteUserCredentialDb(db), updateUserCredentialDb(db), getUserCredentialDb(db)
  ]
