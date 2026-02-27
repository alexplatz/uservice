import { t, status } from "elysia"
import { deleteChallenge, getChallenge, getCredentialWithUser, persistChallenge, persistCredential, persistUser } from "../db/client"
import { server } from '@passwordless-id/webauthn'
import { createJwts, refreshJwts } from "./utils"

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
  const [{ challenge }] = await getChallenge(challengeId)

  if (challenge === null) { return status(400, "No passkey registration challenge found") }

  const expected = {
    challenge,
    origin: `${Bun.env.CLIENT_URL!}`
  }

  const { credential: { id, publicKey, algorithm, transports } } = await server.verifyRegistration(registration, expected)

  await deleteChallenge(challengeId)
  const [user] = await persistUser(email, username)

  await persistCredential({ id, publicKey, algorithm, transports, userId: user.id })

  return createJwts(refresh, access, cookie['auth'], user)
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

export const refresh = async ({ status, refresh, access, cookie: { auth }, body: { jwt } }) =>
  refreshJwts(status, refresh, access, auth, jwt)


export const refreshShape = {
  status: t.Number(),
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({
    auth: t.String(),
  }),
  body: t.Object({
    jwt: t.String(),
  }),
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
        userHandle: t.String()
      }),
      type: t.String(),
      rawId: t.String(),
    })
  })
}

