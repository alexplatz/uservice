import type { QueryClient } from "@tanstack/react-query"
import { loginOauth, refresh } from "../api/client"
import { queryClient } from "./query"

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


export const isGoogleOauthRedirect = () =>
  new URLSearchParams(window.location.search)
    .get("scope")?.includes('googleapis')

export const handleGoogleOauth = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get("code")
  const state = urlParams.get("state")
  const paramsError = urlParams.get("error")
  const storedState = localStorage.getItem("oauth_state");

  if (code && state === storedState) {
    const { data, error: loginError } = await loginOauth({ oauthCode: code })

    loginError ?
      console.log(loginError) :
      hydrateClientState({
        jwt: data.jwt,
        username: data.username,
        userId: data.userId
      })

  } else {
    console.log(paramsError)
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
