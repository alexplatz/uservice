import { createMagicToken, deleteChallenge, getChallenge } from "../../db/client/auth"
import { createUserCredential } from "../../db/client/credential";
import { deleteUserSession, getUserSession, createUserSession, deleteStaleUserSession } from "../../db/client/session"
import { server, type RegistrationJSON } from '@passwordless-id/webauthn'
import { status } from 'elysia'

const { randomBytes } = await import('node:crypto');

export const jwtData = async ({ refresh, access, auth, bearer }) => ({
  refreshPayload: await refresh.verify(auth.value),
  validAccess: await access.verify(bearer),
  session: await getUserSession(auth.value)
})

export const verifyJwtData = async ({ status, refreshPayload, validAccess, session }) => {
  if (!refreshPayload) {
    return status(401, 'no refresh token')
  } else if (!validAccess) {
    return status(401, 'no access token')
  } else if (!session) {
    await deleteUserSession(refreshPayload.familyId)
    return status(401, 'stale refresh token')
  }
}

export const checkJwts = async ({ status, refresh, access, auth, bearer }) => {
  const {
    refreshPayload,
    validAccess,
    session
  } = await jwtData({ refresh, access, auth, bearer })

  return await verifyJwtData({ status, refreshPayload, validAccess, session })
}

export const refreshJwts = async ({ status, refresh, access, auth, bearer }) => {
  const {
    refreshPayload,
    session
  } = await jwtData({ refresh, access, auth, bearer })

  if (!refreshPayload) {
    return status(401, 'no refresh token')
  } else if (!session) {
    await deleteUserSession(refreshPayload.familyId)
    return status(401, 'stale refresh token')
  }

  const newRefresh = await refresh.sign({
    user: refreshPayload.user,
    familyId: refreshPayload.familyId
  })

  const [{ familyId }] = await createUserSession(
    refreshPayload.user.id,
    refreshPayload.familyId,
    newRefresh
  )

  if (auth.value !== newRefresh) { await deleteStaleUserSession(auth.value) }

  const newAccess = await access.sign({ user: refreshPayload.user, familyId })

  setCookie(auth, newRefresh)

  return {
    jwt: newAccess,
    userId: refreshPayload.user.id,
    username: refreshPayload.user.username,
  }
}

export const createJwts = async (refresh, access, auth, user) => {
  const newFamilyId = Bun.randomUUIDv7()
  const newRefresh = await refresh.sign({ user, familyId: newFamilyId })
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

export const createCredential = async ({ userId, challengeId, registration }: { userId: string, challengeId: string, registration: RegistrationJSON }) => {
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
