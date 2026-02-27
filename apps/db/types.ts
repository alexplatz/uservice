export type User = {
  id: number,
  name: string,
  displayName: string
}

export type Challenge = {
  userName: string,
  challenge: string
}

export type Credential = {
  id: string,
  publicKey: string,
  algorithm: string,
  transports: string[]
  userId: number
}
