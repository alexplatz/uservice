import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { users, credentials } from '../schema'
import { db } from '../db'


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
