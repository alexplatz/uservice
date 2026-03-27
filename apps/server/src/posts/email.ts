import { t } from "elysia"
import { createUserEmail, deleteUserEmail, getAllUserEmails, getUserEmail, updateUserEmail } from "../../../db/client"


export const getAllUserEmailsPost = async ({ body: { userId } }) =>
  await getAllUserEmails(userId)

export const getAllUserEmailsShape = {
  body: t.Object({
    userId: t.String()
  })
}

export const createUserEmailPost = async ({ body: { userId, email } }) =>
  await createUserEmail(userId, email)

export const createUserEmailShape = {
  body: t.Object({
    userId: t.String(),
    email: t.String(),
  })
}

export const updateUserEmailPost = async ({ body: { userId, emailId, email, isPrimary, verified } }) => {
  const oldEmailDetails = await getUserEmail(emailId)
  const addressChanged = oldEmailDetails !== undefined && oldEmailDetails.email !== email

  return addressChanged ?
    await updateUserEmail(userId, emailId, email, isPrimary, false) :
    await updateUserEmail(userId, emailId, email, isPrimary, verified)
}

export const updateUserEmailShape = {
  body: t.Object({
    userId: t.String(),
    emailId: t.String(),
    email: t.String(),
    isPrimary: t.String(),
    verified: t.String(),
  })
}

export const deleteUserEmailPost = async ({ body: { emailId } }) =>
  await deleteUserEmail(emailId)

export const deleteUserEmailShape = {
  body: t.Object({
    emailId: t.String(),
  })
}

