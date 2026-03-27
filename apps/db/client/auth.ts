import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import { users, challenges, credentials, sessions, emails, magicTokens } from '../schema'

// client is executed by server while embedded
// so path needs to reflect where db is.
// kinda gross tho
const client = new Database(`${Bun.env.DB_URL!}`)
export const db = drizzle({ client })

const getAllUsersDb = (db: BunSQLiteDatabase) => async () =>
  await db.select().from(users).all()

const getUserDb = (db: BunSQLiteDatabase) => async (userId) =>
  await db.select().from(users).where(eq(users.id, userId))

const persistUserDb = (db: BunSQLiteDatabase) => async (email, username) =>
  await db.transaction(async (tx) => {
    const [dbUser] = await tx.insert(users).values([{ username }]).returning()
    await tx.insert(emails).values([{ email, userId: dbUser.id, isPrimary: true }]).returning()

    return tx
      .select()
      .from(users)
      .leftJoin(emails, eq(users.id, emails.userId))
      .where(eq(emails.email, email))
      .limit(1)
  })

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


const createMagicTokenDb = (db: BunSQLiteDatabase) => async (email, tokenHash, createdAt, expiresAt) =>
  await db.transaction(async (tx) => {
    const [{ userId }] = await tx
      .select({ userId: emails.userId })
      .from(emails)
      .where(eq(emails.email, email))
      .limit(1)

    return await tx
      .insert(magicTokens)
      .values([{ tokenHash, createdAt, expiresAt, email, userId }])
      .onConflictDoUpdate({
        target: magicTokens.email,
        set: { tokenHash }
      })
      .returning()
  })

const updateMagicTokenDb = (db: BunSQLiteDatabase) => async (email, tokenHash, expiresAt) =>
  await db
    .update(magicTokens)
    .set({
      tokenHash,
      expiresAt
    })
    .where(eq(emails.email, email))
    .returning()

const updateEmailVerifiedDb = (db: BunSQLiteDatabase) => async (email) =>
  await db
    .update(emails)
    .set({
      verified: true,
    })
    .where(eq(emails.email, email))
    .returning()
    .get()


/* composite queries */

const getCredentialWithUserDb = (db: BunSQLiteDatabase) => async (credentialId) =>
  await db
    .select()
    .from(credentials)
    .leftJoin(users, eq(users.id, credentials.userId))
    .where(eq(credentials.id, credentialId))
    .limit(1)


const getMagicTokenDetailsDb = (db: BunSQLiteDatabase) => async (newTokenHash) =>
  await db.transaction(async (tx) => {
    const [magicTokenDetails] = await tx
      .select({
        magicToken: magicTokens,
        verified: emails.verified,
        email: emails.email,
        user: users,
      })
      .from(magicTokens)
      .innerJoin(emails, eq(emails.userId, magicTokens.userId))
      .innerJoin(users, eq(users.id, magicTokens.userId))
      .where(eq(magicTokens.tokenHash, newTokenHash))
      .limit(1)

    await tx
      .delete(magicTokens)
      .where(eq(magicTokens.id, magicTokenDetails.magicToken.id))

    return magicTokenDetails
  })


/* exports */

export const [
  getAllUsers,
  persistUser, getUser,
  persistChallenge, getChallenge, deleteChallenge,
  persistCredential,
  persistSession, getSession, deleteSession,
  getCredentialWithUser,
  createMagicToken, getMagicTokenDetails, updateMagicToken,
  updateEmailVerified,
] = [
    getAllUsersDb(db),
    persistUserDb(db), getUserDb(db),
    persistChallengeDb(db), getChallengeDb(db), deleteChallengeDb(db),
    persistCredentialDb(db),
    persistSessionDb(db), getSessionDb(db), deleteSessionDb(db),
    getCredentialWithUserDb(db),
    createMagicTokenDb(db), getMagicTokenDetailsDb(db), updateMagicTokenDb(db),
    updateEmailVerifiedDb(db),
  ]
