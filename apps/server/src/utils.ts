import { deleteSession, getSession, persistSession } from "../../db/client"

export const refreshJwts = async (status, refresh, access, auth, jwt) => {
  const refreshPayload = await refresh.verify(auth.value)

  if (!refreshPayload) {
    return status(401, 'no refreshToken')
  }

  const { user } = await access.verify(jwt)

  if (!user) {
    return status(401, 'no jwt')
  }

  const [session] = await getSession(auth.value)

  if (!session) {
    await deleteSession(refreshPayload.familyId)
    return status(401, 'stale refreshToken')
  }

  const newRefresh = await refresh.sign({
    userId: user.id,
    familyId: refreshPayload.familyId
  })

  const [{ familyId }] = await persistSession(
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
  const [{ familyId }] = await persistSession(user.id, newFamilyId, newRefresh)

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
