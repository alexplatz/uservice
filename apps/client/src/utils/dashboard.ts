import type { QueryClient } from "@tanstack/react-query"
import { loginOauth, magicLinkLogin, refresh } from "../api/client"
import { queryClient } from "./query"
import { getLogger } from "@logtape/logtape"

export const isAuthed = async (jwt: string): Promise<boolean> =>
  isExpired(jwt) ?
    // will probably need to specify this at some point
    ((await refresh()).status < 400) :
    true

const isExpired = (jwt: string): boolean => {
  const exp = jwt ? expiry(jwt) : undefined
  const expireDate = exp ?
    new Date(exp * 1000) :
    undefined

  return expireDate ?
    (expireDate < new Date(Date.now())) :
    true
}

const expiry = (jwt: string): number | undefined =>
  jwt !== '' ?
    JSON.parse(window.atob(jwt.split('.')[1]))?.exp :
    undefined

export const handleToken = async (token: string) => {
  const logger = getLogger(["template-client", "index"]);
  const { data, error } = await magicLinkLogin(token)


  if (error) {
    logger.error`${error.message}`
  } else {
    hydrateClientState({
      jwt: data.jwt,
      username: data.username,
      userId: data.userId
    })
    // queryClient.setQueryData(['emails'], email)
  }
}

export const isGoogleOauthRedirect = () =>
  new URLSearchParams(window.location.search)
    .get("scope")?.includes('googleapis')

export const handleGoogleOauth = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get("code")
  const state = urlParams.get("state")
  const paramsError = urlParams.get("error")
  const storedState = localStorage.getItem("oauth_state");
  const logger = getLogger(["template-client", "dashboard-utils"]);


  if (code && state === storedState) {
    const { data, error: loginError } = await loginOauth({ oauthCode: code })

    loginError ?
      logger.error`${loginError}` :
      hydrateClientState({
        jwt: data.jwt,
        username: data.username,
        userId: data.userId
      })

  } else {
    logger.error`${paramsError}`
  }
}

const hydrateClientStateClient = (queryClient: QueryClient) => ({
  jwt,
  username,
  userId
}: {
  jwt: string,
  username: string,
  userId: string
}) => {
  queryClient.setQueryData(['jwt'], jwt)
  queryClient.setQueryData(['username'], username)
  queryClient.setQueryData(['id'], userId)
}

export const hydrateClientState = hydrateClientStateClient(queryClient)
