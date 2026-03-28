import { t } from 'elysia'
import { refreshJwts } from './utils'

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
