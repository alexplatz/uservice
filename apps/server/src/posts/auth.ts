import { t, status } from "elysia"
import { deleteChallenge, getChallenge, getCredentialWithUser, getMagicTokenDetails, getUserByEmail, persistChallenge, createUser, updateEmailVerified } from "../../../db/client/auth"
import { server } from '@passwordless-id/webauthn'
import { createAndSaveMagicToken, createCredential, createJwts, getGoogleOauthTicket, googleCodeLogin } from "../utils"
import { enqueueVerificationEmail, enqueueMagicLinkEmail } from "../../../workers/src/client";

export const challenge = async ({ body: { challengeId } }) => {
  const challenge = server.randomChallenge()

  // persist to cache in the future
  await persistChallenge(challengeId, challenge)

  return challenge
}

export const challengeShape = {
  body: t.Object({
    challengeId: t.String()
  })
}

export const register = async ({ refresh, access, cookie, body: { challengeId, email, username, registration } }) => {
  const createdUser = await createUser(email, username)

  if (createdUser === undefined) { return status(500, "Could not register user") }

  createCredential({ userId: createdUser.user.id, challengeId, registration })

  return createJwts(refresh, access, cookie['auth'], createdUser.user)
}

export const registerShape = {
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({}),
  body: t.Object({
    email: t.String(),
    username: t.String(),
    challengeId: t.String(),
    registration: t.Object({
      id: t.String(),
      authenticatorAttachment: t.Optional(t.String()),
      clientExtensionResults: t.Object({}),
      response: t.Object({
        attestationObject: t.String(),
        authenticatorData: t.String(),
        clientDataJSON: t.String(),
        publicKey: t.String(),
        publicKeyAlgorithm: t.Number(),
        transports: t.Array(t.String())
      }),
      type: t.String(),
      rawId: t.String(),
    })
  })
}


export const login = async ({ refresh, access, cookie, body: { challengeId, authentication } }) => {

  const [{ credentials: credentialKey, users: user }] = await getCredentialWithUser(authentication.id)

  if (credentialKey === null || user === null) { return status(401, "User has not registered") }

  const [{ challenge }] = await getChallenge(challengeId)

  if (challenge === null) { return status(400, "No passkey authentication challenge found") }

  await deleteChallenge(challengeId)

  const expected = {
    challenge,
    origin: `${Bun.env.CLIENT_URL!}`,
    userVerified: true
  }

  // something weird is happening with the types here
  // also figure out error handling
  await server.verifyAuthentication(authentication, credentialKey, expected)


  return createJwts(refresh, access, cookie['auth'], user)
}

export const loginShape = {
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({}),
  body: t.Object({
    challengeId: t.String(),
    authentication: t.Object({
      id: t.String(),
      authenticatorAttachment: t.Optional(t.String()),
      clientExtensionResults: t.Object({}),
      response: t.Object({
        authenticatorData: t.String(),
        clientDataJSON: t.String(),
        signature: t.String(),
        userHandle: t.Optional(t.String())
      }),
      type: t.String(),
      rawId: t.String(),
    })
  })
}

export const verifyEmail = async ({ body: { email } }) => {
  return await enqueueVerificationEmail(
    await createAndSaveMagicToken(email)
  )
}

export const verifyEmailShape = {
  body: t.Object({
    email: t.String()
  })
}

export const magicLinkEmail = async ({ body: { email } }) => {
  return await enqueueMagicLinkEmail(
    await createAndSaveMagicToken(email)
  )
}

export const magicLinkEmailShape = {
  body: t.Object({
    email: t.String()
  })
}

export const verifyMagicLink = async ({ refresh, access, cookie, body: { token } }) => {
  const newTokenHash = Bun.sha(token, 'hex')

  const magicTokenDetails = await getMagicTokenDetails(newTokenHash)

  if (!magicTokenDetails) { return status(401, "Invalid token") }

  const {
    user,
    email,
    verified,
    magicToken: { expiresAt }
  } = magicTokenDetails

  if (expiresAt.getTime() < Date.now()) { return status(401, "Token expired") }

  return !verified ? {
    email: await updateEmailVerified(email),
    ... await createJwts(refresh, access, cookie['auth'], user)
  } : {
    email: undefined,
    ... await createJwts(refresh, access, cookie['auth'], user)
  }
}

export const verifyMagicLinkShape = {
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({}),
  body: t.Object({
    token: t.String(),
  })
}

export const oauthLogin = async ({ refresh, access, cookie, body: { oauthCode } }) => {
  const { id_token: idToken } = await googleCodeLogin(oauthCode)
  const res = await getGoogleOauthTicket(idToken)

  if (!res || (!res.email || !res.name)) { return status(400, "Oauth user does not exist") }

  const existingUser = await getUserByEmail(res.email)
  const user = existingUser ?
    existingUser :
    (await createUser(res.email, res.name))?.user

  if (user === undefined) { return status(500, "Could not find or register user") }

  return createJwts(refresh, access, cookie['auth'], user)
}

export const oauthLoginShape = {
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({}),
  body: t.Object({
    oauthCode: t.String(),
  })
}
