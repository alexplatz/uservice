import { t } from "elysia"
import { deleteUserSession, getAllUserSessions } from "../../../db/client/session"


export const getAllUserSessionsPost = async ({ body: { userId } }) =>
  await getAllUserSessions(userId)

export const getAllUserSessionsShape = {
  body: t.Object({
    userId: t.String()
  })
}

export const deleteUserSessionPost = async ({ body: { familyId } }) =>
  await deleteUserSession(familyId)

export const deleteUserSessionShape = {
  body: t.Object({
    familyId: t.String(),
  })
}

