import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { users, sessions } from '../schema'
import { db } from '../db'

const createUserSessionDb = (db: BunSQLiteDatabase) => async (userId: string, familyId: string, refreshToken: string) =>
  await db
    .insert(sessions)
    .values([{
      userId,
      familyId,
      refreshToken
    }])
    .onConflictDoUpdate({
      target: sessions.familyId,
      set: { refreshToken }
    })
    .returning()

const getUserSessionDb = (db: BunSQLiteDatabase) => async (refreshToken: string) =>
  await db
    .select()
    .from(sessions)
    .where(eq(sessions.refreshToken, refreshToken))
    .get()

const deleteUserSessionDb = (db: BunSQLiteDatabase) => async (familyId: string) =>
  await db
    .delete(sessions)
    .where(eq(sessions.familyId, familyId))

const deleteStaleUserSessionDb = (db: BunSQLiteDatabase) => async (refreshToken: string) =>
  await db
    .delete(sessions)
    .where(eq(sessions.refreshToken, refreshToken))


/* composite queries */


const getAllUserSessionsDb = (db: BunSQLiteDatabase) => async (userId: string) =>
  await db
    .select({
      familyId: sessions.familyId,
      lastUsed: sessions.lastUsed,
    })
    .from(sessions)
    .leftJoin(users, eq(users.id, sessions.userId))
    .where(eq(users.id, userId))


/* exports */

export const [
  getAllUserSessions, createUserSession, deleteUserSession, getUserSession,
  deleteStaleUserSession
] = [
    getAllUserSessionsDb(db), createUserSessionDb(db), deleteUserSessionDb(db), getUserSessionDb(db),
    deleteStaleUserSessionDb(db)
  ]
