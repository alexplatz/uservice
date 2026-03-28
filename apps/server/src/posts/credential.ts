import { t } from "elysia"
import { deleteUserCredential, getAllUserCredentials, updateUserCredential } from "../../../db/client/credential"
import { createCredential } from "../utils"


export const getAllUserCredentialsPost = async ({ body: { userId } }) =>
  await getAllUserCredentials(userId)

export const getAllUserCredentialsShape = {
  body: t.Object({
    userId: t.String()
  })
}

// check this
export const createUserCredentialPost = async ({ body: { userId, challengeId, registration } }) =>
  createCredential({ userId, challengeId, registration })

export const createUserCredentialShape = {
  body: t.Object({
    userId: t.String(),
    challengeId: t.String(),
    registration: t.Object({
      id: t.String(),
      authenticatorAttachment: t.Optional(t.String()),
      clientExtensionResults: t.Object({}),
      response: t.Object({
        attestationObject: t.String(),
        authenticatorData: t.String(),
        clientDataJSON: t.String(),
        publicKey: t.String(),
        publicKeyAlgorithm: t.Number(),
        transports: t.Array(t.String())
      }),
    })
  })
}

export const updateUserCredentialPost = async ({ body: { credentialId, transports } }) =>
  await updateUserCredential(credentialId, transports)

export const updateUserCredentialShape = {
  body: t.Object({
    credentialId: t.String(),
    transports: t.Array(t.String()),
  })
}

export const deleteUserCredentialPost = async ({ body: { credentialId } }) =>
  await deleteUserCredential(credentialId)

export const deleteUserCredentialShape = {
  body: t.Object({
    credentialId: t.String(),
  })
}

