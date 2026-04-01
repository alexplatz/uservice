import { refresh } from "../api/client"

export const isAuthed = async (jwt: string): Promise<boolean> =>
  isExpired(jwt) ?
    // will probably need to specify this at some point
    ((await refresh()).status < 400) :
    true

const isExpired = (jwt: string): boolean => {
  const exp = expiry(jwt)
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
