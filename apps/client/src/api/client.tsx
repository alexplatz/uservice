import { treaty } from "@elysiajs/eden"
import type { App } from "../../../server/src"
import { client, type AuthenticationResponseJSON } from "@passwordless-id/webauthn"
import { queryClient } from "@/utils/query"

type Server = ReturnType<typeof treaty<App>>
type PasskeyClient = typeof client

const server = treaty<App>(import.meta.env.VITE_SERVER_URL!, {
  onRequest: () => ({
    headers: {
      authorization: queryClient.getQueryData(['jwt']) ?
        `Bearer ${queryClient.getQueryData(['jwt'])}` :
        '',
    }
  }),
  fetch: {
    credentials: 'include'
  }
})

const withRefresh = async (reqFn) => {
  const reqFnRes = await reqFn()

  const refreshRes =
    reqFnRes.error?.value === 'no access token' ?
      await refresh() :
      undefined

  if (refreshRes?.data) {
    // reqFn may be operating with stale data 
    return await reqFn()
  } else {
    return reqFnRes
  }
}


const registerServer = (server: Server, passkeyClient: PasskeyClient) => async (user: { username: string, email: string }) => {
  const challengeId = crypto.randomUUID()
  const { data, error } = await server.user.challenge.post({ challengeId })

  if (error) {
    return { data, error }
  } else {
    const registration = await passkeyClient.register({
      challenge: data,
      user: { displayName: user.username, name: user.email }
    })

    return await server.user.register.post({
      email: user.email,
      username: user.username,
      challengeId,
      registration
    })
  }
}

const refreshServer = (server: Server) => async () => {
  const refreshRes = await server.refresh.get()
  if (refreshRes.data) {
    queryClient.setQueryData(['jwt'], refreshRes.data.jwt)
    queryClient.setQueryData(['id'], refreshRes.data.userId)
  }
  return refreshRes
}

const loginServer = (server: Server, passkeyClient: PasskeyClient) => async () => {
  const challengeId = crypto.randomUUID()
  const { data, error } = await server.user.challenge.post({ challengeId })

  if (error) {
    return { data, error }
  } else {
    const authentication: AuthenticationResponseJSON = await passkeyClient.authenticate({
      challenge: data,
    })

    return await server.user.login.post({
      challengeId,
      authentication
    })
  }
}

const verifyEmailServer = (server: Server) => async (email: string) =>
  await server.user.email.verify.post({ email })

const createMagicLinkServer = (server: Server) => async (email: string) =>
  await server.user.login["magic-link"].post({ email })

const magicLinkLoginServer = (server: Server) => async (token: string) =>
  await server.user.verify.post({ token })

const logoutServer = (server: Server) => async () =>
  await withRefresh(async () =>
    await server.user.logout.get()
  )

const getEmailsServer = (server: Server) => async (userId: string) =>
  await withRefresh(async () =>
    await server.user.email.get.all.post({ userId })
  )

const createEmailServer = (server: Server) => async (userId: string, email: string) =>
  await withRefresh(async () =>
    await server.user.email.create.post({ userId, email })
  )

const deleteEmailServer = (server: Server) => async (emailId: string) =>
  await withRefresh(async () =>
    await server.user.email.delete.post({ emailId })
  )

const getCredentialsServer = (server: Server) => async (userId: string) =>
  await withRefresh(async () =>
    await server.user.credential.get.all.post({ userId })
  )

const createCredentialsServer = (server: Server, passkeyClient: PasskeyClient) => async ({ userId, username, email }) =>
  await withRefresh(async () => {
    const challengeId = crypto.randomUUID()

    const { data, error } = await server.user.challenge.post({ challengeId })

    if (error) {
      return { data, error }
    } else {
      const registration = await passkeyClient.register({
        challenge: data,
        user: { displayName: username, name: email }
      })

      return await server.user.credential.create.post({ userId, challengeId, registration })
    }
  })

const deleteCredentialServer = (server: Server) => async (passkeyId: string) =>
  await withRefresh(async () =>
    await server.user.credential.delete.post({ credentialId: passkeyId })
  )

const getSessionsServer = (server: Server) => async (userId: string) =>
  await withRefresh(async () =>
    await server.user.session.get.all.post({ userId })
  )

const deleteSessionServer = (server: Server) => async (familyId: string) => {
  return await withRefresh(async () =>
    await server.user.session.delete.post({ familyId })
  )
}

export const [
  register, login, refresh,
  verifyEmail,
  createMagicLink, magicLinkLogin,
  logout,
  getEmails, createEmail, deleteEmail,
  createCredential, getCredentials, deleteCredential,
  getSessions, deleteSession
] = [
    registerServer(server, client), loginServer(server, client), refreshServer(server),
    verifyEmailServer(server),
    createMagicLinkServer(server), magicLinkLoginServer(server),
    logoutServer(server),
    getEmailsServer(server), createEmailServer(server), deleteEmailServer(server),
    createCredentialsServer(server, client), getCredentialsServer(server), deleteCredentialServer(server),
    getSessionsServer(server), deleteSessionServer(server)
  ]
