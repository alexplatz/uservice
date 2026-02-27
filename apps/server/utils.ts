import { deleteSession, getSession, persistSession } from "../db/client"

export const refreshJwts = async (status, refresh, access, auth, jwt) => {
  const refreshPayload = await refresh.verify(auth.value)

  const { user } = await refresh.verify(jwt)

  if (!refreshPayload) {
    return status(401)
  }

  const [session] = await getSession(auth.value)

  if (!session) {
    await deleteSession(refreshPayload.familyId)
    return status(401)
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

  auth.set({
    value: newRefresh,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/'
  })

  return {
    jwt: newAccess,
    username: user.username,
    email: user.email
  }
}

export const createJwts = async (refresh, access, auth, user) => {
  const newFamilyId = Bun.randomUUIDv7()
  const newRefresh = await refresh.sign({ userId: user.id, familyId: newFamilyId })
  const [{ familyId }] = await persistSession(user.id, newFamilyId, newRefresh)

  const newAccess = await access.sign({ user, familyId })

  auth.set({
    value: newRefresh,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/'
  })

  return {
    jwt: newAccess,
    username: user.username,
    email: user.email
  }
}

