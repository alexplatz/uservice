import { treaty } from "@elysiajs/eden"
import type { App } from "../../../server/src"
import { client } from "@passwordless-id/webauthn"
import { useAuthStore } from "@/store/auth"

const server = treaty<App>(import.meta.env.VITE_SERVER_URL!, {
  onRequest: () => ({
    headers: {
      authorization: `Bearer ${useAuthStore.getState().jwt}`,
    }
  }),
  fetch: {
    credentials: 'include'
  }
})


const registerServer = (server, passkeyClient) => async (user: { username: string, email: string }) => {
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

const refreshServer = (server) => async () => {
  return await server.refresh.get()
}

const loginServer = (server, passkeyClient) => async () => {
  const challengeId = crypto.randomUUID()
  const { data, error } = await server.user.challenge.post({ challengeId })

  if (error) {
    return { data, error }
  } else {
    const authentication = await passkeyClient.authenticate({
      challenge: data,
    })

    return await server.user.login.post({
      challengeId,
      authentication
    })
  }
}

const getEmailsServer = (server) => async (userId) => {
  return await server.user.email.get.all.post({ userId })
}

const verifyEmailServer = (server) => async (email) =>
  await server.user.email.verify.post({ email })

const createMagicLinkServer = (server) => async (email: string) =>
  await server.user.login["magic-link"].post({ email })

const magicLinkLoginServer = (server) => async (token: string) =>
  await server.user.verify.post({ token })

export const [
  register, login, refresh,
  getEmails, verifyEmail,
  createMagicLink, magicLinkLogin
] = [
    registerServer(server, client), loginServer(server, client), refreshServer(server),
    getEmailsServer(server), verifyEmailServer(server),
    createMagicLinkServer(server), magicLinkLoginServer(server)
  ]
