import { t } from 'elysia'
import { jwtData, refreshJwts, verifyJwtData } from './utils'
import { deleteUserSession } from '../../db/client/session'

export const refreshGet = async ({ status, refresh, access, cookie: { auth }, bearer }) =>
  refreshJwts({ status, refresh, access, auth, bearer })

export const refreshGetShape = {
  status: t.Number(),
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({
    auth: t.String(),
  }),
  bearer: t.String()
}

export const logoutGet = async ({ status, refresh, access, cookie: { auth }, bearer }) => {
  const {
    refreshPayload,
    validAccess,
    session
  } = await jwtData({ refresh, access, auth, bearer })

  const errors = await verifyJwtData({ status, refreshPayload, validAccess, session })
  if (errors) { return errors }

  auth.remove()

  return deleteUserSession(refreshPayload.familyId)
}

export const logoutGetShape = {
  status: t.Number(),
  refresh: t.String(),
  access: t.String(),
  cookie: t.Object({
    auth: t.String(),
  }),
  bearer: t.String()
}
