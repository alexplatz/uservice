import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { users, challenges, credentials, emails, magicTokens } from '../schema'
import { db } from '../db'

const getAllUsersDb = (db: BunSQLiteDatabase) => async () =>
  await db.select().from(users).all()

const getUserDb = (db: BunSQLiteDatabase) => async (userId) =>
  await db.select().from(users).where(eq(users.id, userId))

const createUserDb = (db: BunSQLiteDatabase) => async (email, username) =>
  await db.transaction(async (tx) => {
    const [dbUser] = await tx.insert(users).values([{ username }]).returning()
    await tx.insert(emails).values([{ email, userId: dbUser.id, isPrimary: true }]).returning()

    return tx
      .select({
        user: {
          id: users.id,
          username: users.username
        },
        emails
      })
      .from(users)
      .leftJoin(emails, eq(users.id, emails.userId))
      .where(eq(emails.email, email))
      .limit(1)
      .get()
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

const getUserByEmailDb = (db: BunSQLiteDatabase) => async (email: string) =>
  await db
    .select({
      id: emails.userId,
      username: users.username
    })
    .from(emails)
    .leftJoin(users, eq(users.id, emails.userId))
    .where(eq(emails.email, email))
    .get()


/* exports */

export const [
  getAllUsers,
  createUser, getUser,
  persistChallenge, getChallenge, deleteChallenge,
  persistCredential,
  getCredentialWithUser,
  createMagicToken, getMagicTokenDetails, updateMagicToken,
  updateEmailVerified,
  getUserByEmail
] = [
    getAllUsersDb(db),
    createUserDb(db), getUserDb(db),
    persistChallengeDb(db), getChallengeDb(db), deleteChallengeDb(db),
    persistCredentialDb(db),
    getCredentialWithUserDb(db),
    createMagicTokenDb(db), getMagicTokenDetailsDb(db), updateMagicTokenDb(db),
    updateEmailVerifiedDb(db),
    getUserByEmailDb(db)
  ]
