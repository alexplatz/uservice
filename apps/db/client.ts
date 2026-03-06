import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import { users, challenges, credentials, sessions } from './schema'

// in practice, this would be a secrets managed url.
// also, client is executed by server while embedded
// so path needs to reflect where db is.
// kinda gross tho
const client = new Database(`${Bun.env.DB_URL!}`)
export const db = drizzle({ client })

const getAllUsersDb = (db: BunSQLiteDatabase) => async () =>
  await db.select().from(users).all()

const getUserDb = (db: BunSQLiteDatabase) => async (userId) =>
  await db.select().from(users).where(eq(users.id, userId))

const persistUserDb = (db: BunSQLiteDatabase) => async (email, username) =>
  await db.insert(users).values([{ email, username }]).returning()

const persistChallengeDb = (db: BunSQLiteDatabase) => async (challengeId, challenge) =>
  await db
    .insert(challenges)
    .values([{ challenge, id: challengeId }])
    .onConflictDoUpdate({
      target: challenges.id,
      set: { challenge }
    })
    .returning()

// user should only have one challenge active at a time
// can probably better represent this in schema
const getChallengeDb = (db: BunSQLiteDatabase) => async (challengeId) =>
  await db.select({ challenge: challenges.challenge }).from(challenges).where(eq(challenges.id, challengeId)).limit(1)

const deleteChallengeDb = (db: BunSQLiteDatabase) => async (challengeId) =>
  await db.delete(challenges).where(eq(challenges.id, challengeId))

const persistCredentialDb = (db: BunSQLiteDatabase) => async (credential) =>
  await db.insert(credentials).values([credential]).returning()

const persistSessionDb = (db: BunSQLiteDatabase) => async (userId, familyId, refreshToken) =>
  await db
    .insert(sessions)
    .values([{ userId, familyId, refreshToken }])
    .onConflictDoUpdate({
      target: sessions.familyId,
      set: { refreshToken }
    })
    .returning()

const getSessionDb = (db: BunSQLiteDatabase) => async (refreshToken) =>
  await db.select().from(sessions).where(eq(sessions.refreshToken, refreshToken)).limit(1)

const deleteSessionDb = (db: BunSQLiteDatabase) => async (familyId) =>
  await db.delete(sessions).where(eq(sessions.familyId, familyId))


/* composite queries */

const getCredentialWithUserDb = (db: BunSQLiteDatabase) => async (credentialId) =>
  await db
    .select()
    .from(credentials)
    .leftJoin(users, eq(users.id, credentials.userId))
    .where(eq(credentials.id, credentialId))
    .limit(1)


/* exports */

export const [
  getAllUsers,
  persistUser, getUser,
  persistChallenge, getChallenge, deleteChallenge,
  persistCredential,
  persistSession, getSession, deleteSession,
  getCredentialWithUser
] = [
    getAllUsersDb(db),
    persistUserDb(db), getUserDb(db),
    persistChallengeDb(db), getChallengeDb(db), deleteChallengeDb(db),
    persistCredentialDb(db),
    persistSessionDb(db), getSessionDb(db), deleteSessionDb(db),
    getCredentialWithUserDb(db)
  ]
