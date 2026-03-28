import { createMagicToken, deleteChallenge, getChallenge } from "../../db/client/auth"
import { createUserCredential } from "../../db/client/credential";
import { deleteUserSession, getUserSession, createUserSession } from "../../db/client/session"
import { server, type RegistrationInfo } from '@passwordless-id/webauthn'
import { status } from 'elysia'

const { randomBytes } = await import('node:crypto');

const jwtData = async ({ refresh, access, auth, bearer }) => ({
  refreshPayload: await refresh.verify(auth.value),
  user: (await access.verify(bearer))?.user,
  session: await getUserSession(auth.value)
})

const verifyJwtData = async ({ status, refreshPayload, user, session }) => {
  if (!refreshPayload) {
    return status(401, 'no refresh token')
  } else if (!user) {
    return status(401, 'no access token')
  } else if (!session) {
    await deleteUserSession(refreshPayload.familyId)
    return status(401, 'stale refresh token')
  }
}

export const checkJwts = async ({ status, refresh, access, auth, bearer }) => {
  const {
    refreshPayload,
    user,
    session
  } = await jwtData({ refresh, access, auth, bearer })

  return await verifyJwtData({ status, refreshPayload, user, session })
}

export const refreshJwts = async ({ status, refresh, access, auth, bearer }) => {
  const {
    refreshPayload,
    user,
    session
  } = await jwtData({ refresh, access, auth, bearer })

  const errors = await verifyJwtData({ status, refreshPayload, user, session })
  if (errors) { return errors }

  const newRefresh = await refresh.sign({
    userId: user.id,
    familyId: refreshPayload.familyId
  })

  const [{ familyId }] = await createUserSession(
    user.id,
    refreshPayload.familyId,
    newRefresh
  )

  const newAccess = await access.sign({ user, familyId })

  setCookie(auth, newRefresh)

  return {
    jwt: newAccess,
    userId: user.id,
    username: user.username,
  }
}

export const createJwts = async (refresh, access, auth, user) => {
  const newFamilyId = Bun.randomUUIDv7()
  const newRefresh = await refresh.sign({ userId: user.id, familyId: newFamilyId })
  const [{ familyId }] = await createUserSession(user.id, newFamilyId, newRefresh)

  const newAccess = await access.sign({ user, familyId })

  setCookie(auth, newRefresh)

  return {
    jwt: newAccess,
    userId: user.id,
    username: user.username,
  }
}

const setCookie = (cookie, value) => {
  return cookie.set({
    domain: `${Bun.env.CLIENT_DOMAIN!}`,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 86400,
    path: '/'
  })
}

export const generateMagicToken = () => randomBytes(256).toString('hex')

export const generateMagicTokenRecord = async (token: string) => ({
  tokenHash: Bun.sha(token, 'hex'),
  createdAt: new Date(Date.now()),
  expiresAt: new Date(Date.now() + 10 * 60000)
})

export const createAndSaveMagicToken = async (email: string) => {
  const token = generateMagicToken()
  const { tokenHash, createdAt, expiresAt } = await generateMagicTokenRecord(token)
  const url = `${Bun.env.CLIENT_URL!}?token=${token}`

  await createMagicToken(email, tokenHash, createdAt, expiresAt)

  return { to: email, url }
}

export const createCredential = async ({ userId, challengeId }: { userId: string, challengeId: string, registration: RegistrationInfo }) => {
  const [{ challenge }] = await getChallenge(challengeId)

  if (challenge === null) { return status(400, "No passkey registration challenge found") }

  const expected = {
    challenge,
    origin: `${Bun.env.CLIENT_URL!}`
  }

  const { credential: { id, publicKey, algorithm, transports } } = await server.verifyRegistration(registration, expected)

  await deleteChallenge(challengeId)

  return await createUserCredential(id, userId, publicKey, algorithm, transports)
}
