export type RegisterUser = {
  username: string,
  email: string
}

export type emailData = {
  id: string,
  email: string,
  isPrimary: boolean,
  verified: boolean
}

export type passkeyData = {
  id: string,
  publicKey: string,
  algorithm: number,
  transports: string[]
}

export type sessionData = {
  familyId: string,
  lastUsed: string
}
